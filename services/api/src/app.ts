import Fastify from "fastify";
import type { PrismaClient, Prisma } from "@prisma/client";
import { compare } from "bcrypt-ts";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileTypeFromBuffer } from "file-type";
import {
  bookingFields,
  UpdateBookingSchema,
  slotTimes,
  validateVisit,
  zooDate,
} from "../../../shared/booking";
import {
  HttpError,
  serviceAuthorized,
  principal,
  createSession,
  rateLimit,
  hash,
} from "./security";

const id = z.string().regex(/^[a-f0-9]{24}$/i);
const requestKey = z.string().uuid();
const contactFields = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().toLowerCase().email().max(254),
    mobile: z
      .string()
      .trim()
      .regex(/^[+\d ()-]{6,25}$/),
    company: z.string().trim().max(200).optional(),
    jobTitle: z.string().trim().max(200).optional(),
    note: z.string().trim().max(3000).optional(),
    position: z.string().trim().max(200).optional(),
  })
  .strict();
type ApiConfig = { serviceToken: string; uploadDir: string };

export function createApp(db: PrismaClient, config: ApiConfig) {
  const app = Fastify({ bodyLimit: 8 * 1024 * 1024, logger: false });
  app.addHook("onRequest", async (req, reply) => {
    if (!serviceAuthorized(req.headers.authorization, config.serviceToken))
      return reply.code(401).send({ error: "Chưa xác thực dịch vụ" });
  });
  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof z.ZodError)
      return reply.code(400).send({
        error: "Thông tin không hợp lệ",
        fields: error.flatten().fieldErrors,
      });
    if ((error as { code?: string }).code === "P2034")
      return reply
        .code(409)
        .send({ error: "Thông tin vừa thay đổi. Vui lòng thử lại" });
    const typed = error as Error & { statusCode?: number };
    const status =
      error instanceof HttpError ? error.statusCode : typed.statusCode || 500;
    return reply.code(status).send({
      error:
        status >= 500
          ? "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại"
          : typed.message,
    });
  });
  const clientBucket = (req: { headers: Record<string, unknown> }) =>
    hash(String(req.headers["x-client-address"] || "unknown"));
  app.get("/health", async () => {
    await db.$runCommandRaw({ ping: 1 });
    return { ok: true };
  });
  app.post("/sessions/guest", async (req) => {
    await rateLimit(db, `guest:${clientBucket(req)}`, 60);
    return createSession(db);
  });
  app.post("/sessions/login", async (req) => {
    await rateLimit(db, `login:${clientBucket(req)}`, 10);
    const data = z
      .object({
        email: z.string().trim().toLowerCase().email(),
        password: z.string().min(1).max(200),
      })
      .strict()
      .parse(req.body);
    await rateLimit(db, `login-email:${hash(data.email)}`, 10);
    const user = await db.user.findUnique({ where: { email: data.email } });
    // Compare against a valid dummy hash too, so unknown/deleted users do not skip password work.
    const fallback =
      "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
    const valid = await compare(data.password, user?.password || fallback);
    if (
      !user ||
      user.deletedAt ||
      !user.password ||
      !valid ||
      !user.permissions.length
    )
      throw new HttpError(401, "Email hoặc mật khẩu không đúng");
    return createSession(db, user.id);
  });
  app.get("/sessions/me", async (req) => {
    const { session, user, permissions } = await principal(db, req);
    return {
      kind: session.kind,
      user: user
        ? {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          }
        : null,
      permissions,
    };
  });
  app.post("/sessions/logout", async (req) => {
    const { session } = await principal(db, req);
    await db.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
    return { ok: true };
  });
  app.get("/slots", async (req) => {
    await principal(db, req, "slots:read");
    const { date } = z.object({ date: z.string().length(10) }).parse(req.query);
    const policy = await db.bookingPolicy.findUnique({
      where: { key: "default" },
    });
    if (!policy) throw new HttpError(503, "Lịch tham quan chưa được cấu hình");
    let times;
    try {
      times = slotTimes(date, policy);
    } catch {
      throw new HttpError(400, "Ngày không hợp lệ");
    }
    const closed = await db.slotClosure.findMany({
      where: { startTime: { in: times.map((t) => new Date(t.start_time)) } },
    });
    return {
      slots: times.filter(
        (t) => !closed.some((c) => c.startTime.toISOString() === t.start_time),
      ),
      durationMinutes: policy.durationMinutes,
    };
  });

  async function checkTime(start: Date, end: Date, lead: boolean) {
    const policy = await db.bookingPolicy.findUnique({
      where: { key: "default" },
    });
    if (!policy) throw new HttpError(503, "Lịch tham quan chưa được cấu hình");
    try {
      validateVisit(start, end, policy, new Date(), lead);
    } catch (e) {
      throw new HttpError(400, (e as Error).message);
    }
    if (await db.slotClosure.findUnique({ where: { startTime: start } }))
      throw new HttpError(
        409,
        "Suất này đang tạm đóng. Vui lòng chọn suất khác",
      );
  }
  async function once(
    subjectId: string,
    kind: string,
    key: string,
    payload: unknown,
    create: (tx: Prisma.TransactionClient) => Promise<string>,
  ) {
    const scopedKey = `${subjectId}:${kind}:${key}`;
    const payloadHash = hash(JSON.stringify(payload));
    const previous = await db.submission.findUnique({
      where: { key: scopedKey },
    });
    if (previous) {
      if (previous.payloadHash !== payloadHash)
        throw new HttpError(
          409,
          "Yêu cầu đã thay đổi. Vui lòng gửi lại với mã mới",
        );
      return previous.recordId;
    }
    try {
      return await db.$transaction(async (tx) => {
        const recordId = await create(tx);
        await tx.submission.create({
          data: { key: scopedKey, subjectId, kind, recordId, payloadHash },
        });
        return recordId;
      });
    } catch (error) {
      const existing = await db.submission.findUnique({
        where: { key: scopedKey },
      });
      if (!existing) throw error;
      if (existing.payloadHash !== payloadHash)
        throw new HttpError(409, "Yêu cầu đã thay đổi");
      return existing.recordId;
    }
  }
  app.post("/bookings", async (req) => {
    const { session } = await principal(db, req, "booking:create");
    await rateLimit(db, `booking:${clientBucket(req)}`, 20);
    const body = z
      .object({ data: bookingFields, requestKey })
      .strict()
      .parse(req.body);
    const recordId = await once(
      session.id,
      "booking",
      body.requestKey,
      body.data,
      async (tx) => {
        await checkTime(body.data.start_time, body.data.end_time, true);
        const record = await tx.booking.create({
          data: {
            ...body.data,
            status: "PENDING",
            code: randomUUID().slice(0, 8).toUpperCase(),
          },
        });
        await tx.emailOutbox.create({
          data: {
            eventKey: `booking:${record.id}:received`,
            payload: {
              kind: "booking",
              email: record.email,
              code: record.code,
              start: record.start_time.toISOString(),
              adults: record.adults,
              kids: record.kids,
              accepted: false,
            },
          },
        });
        await tx.emailOutbox.create({
          data: {
            eventKey: `booking:${record.id}:staff-received`,
            payload: {
              kind: "booking",
              staff: true,
              email: record.email,
              code: record.code,
              start: record.start_time.toISOString(),
              adults: record.adults,
              kids: record.kids,
              accepted: false,
            },
          },
        });
        return record.id;
      },
    );
    const result = await db.booking.findUniqueOrThrow({
      where: { id: recordId },
    });
    return {
      id: result.id,
      code: result.code,
      status: result.status,
      delivery: "QUEUED",
    };
  });
  app.get("/bookings", async (req) => {
    await principal(db, req, "booking:read");
    const range = z
      .object({ startRange: z.coerce.date(), endRange: z.coerce.date() })
      .parse(req.query);
    if (
      range.endRange <= range.startRange ||
      +range.endRange - +range.startRange > 93 * 86400000
    )
      throw new HttpError(400, "Khoảng ngày tối đa 93 ngày");
    return db.booking.findMany({
      where: {
        start_time: { lt: range.endRange },
        end_time: { gte: range.startRange },
      },
      orderBy: { start_time: "asc" },
    });
  });
  app.get("/bookings/:id", async (req) => {
    await principal(db, req, "booking:read");
    const booking = await db.booking.findUnique({
      where: { id: id.parse((req.params as { id: string }).id) },
    });
    if (!booking) throw new HttpError(404, "Không tìm thấy booking");
    return booking;
  });
  app.patch("/bookings/:id", async (req) => {
    const { user } = await principal(db, req, "booking:update");
    const bookingId = id.parse((req.params as { id: string }).id);
    const changes = UpdateBookingSchema.partial().strict().parse(req.body);
    const current = await db.booking.findUnique({ where: { id: bookingId } });
    if (!current) throw new HttpError(404, "Không tìm thấy booking");
    const data = { ...current, ...changes };
    if (changes.status === "ACCEPTED" && current.status !== "ACCEPTED")
      throw new HttpError(400, "Dùng thao tác xác nhận booking");
    if (
      changes.status &&
      changes.status !== current.status &&
      !(changes.status === "CANCELLED" && current.status !== "CANCELLED")
    )
      throw new HttpError(
        409,
        "Trạng thái booking không cho phép thay đổi này",
      );
    bookingFields.parse({
      name: data.name,
      email: data.email,
      phone: data.phone,
      adults: data.adults,
      kids: data.kids,
      note: data.note,
      start_time: data.start_time,
      end_time: data.end_time,
    });
    if (changes.start_time || changes.end_time)
      await checkTime(data.start_time, data.end_time, true);
    return db.$transaction(async (tx) => {
      const changed = await tx.booking.updateMany({
        where: { id: bookingId, updatedAt: current.updatedAt },
        data: changes,
      });
      if (changed.count !== 1)
        throw new HttpError(409, "Booking vừa được thay đổi. Vui lòng tải lại");
      await tx.auditEvent.create({
        data: {
          userId: user!.id,
          resourceId: bookingId,
          action: "booking:update",
        },
      });
      return tx.booking.findUniqueOrThrow({ where: { id: bookingId } });
    });
  });
  app.post("/bookings/:id/accept", async (req) => {
    const { user } = await principal(db, req, "booking:accept");
    const bookingId = id.parse((req.params as { id: string }).id);
    return db.$transaction(async (tx) => {
      const current = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!current) throw new HttpError(404, "Không tìm thấy booking");
      if (current.status === "ACCEPTED") return current;
      if (current.status !== "PENDING")
        throw new HttpError(409, "Chỉ xác nhận booking đang chờ");
      bookingFields.parse({
        name: current.name,
        email: current.email,
        phone: current.phone,
        adults: current.adults,
        kids: current.kids,
        note: current.note,
        start_time: current.start_time,
        end_time: current.end_time,
      });
      await checkTime(current.start_time, current.end_time, false);
      if (current.start_time <= new Date())
        throw new HttpError(409, "Booking đã qua giờ tham quan");
      const changed = await tx.booking.updateMany({
        where: {
          id: bookingId,
          status: "PENDING",
          updatedAt: current.updatedAt,
        },
        data: { status: "ACCEPTED" },
      });
      if (changed.count !== 1)
        throw new HttpError(409, "Booking vừa được thay đổi. Vui lòng tải lại");
      await tx.emailOutbox.create({
        data: {
          eventKey: `booking:${bookingId}:accepted`,
          payload: {
            kind: "booking",
            email: current.email,
            code: current.code,
            start: current.start_time.toISOString(),
            adults: current.adults,
            kids: current.kids,
            accepted: true,
          },
        },
      });
      await tx.auditEvent.create({
        data: {
          userId: user!.id,
          resourceId: bookingId,
          action: "booking:accept",
        },
      });
      return tx.booking.findUniqueOrThrow({ where: { id: bookingId } });
    });
  });
  app.post("/uploads", async (req) => {
    const { session } = await principal(db, req, "contact:create");
    await rateLimit(db, `upload:${clientBucket(req)}`, 20);
    const data = z
      .object({
        name: z.string().min(1).max(200),
        size: z
          .number()
          .int()
          .min(1)
          .max(5 * 1024 * 1024),
      })
      .strict()
      .parse(req.body);
    const upload = await db.upload.create({
      data: {
        ...data,
        subjectId: session.id,
        expiresAt: new Date(Date.now() + 2 * 3600000),
      },
    });
    return { id: upload.id };
  });
  app.put("/uploads/:id/:part", async (req) => {
    const { session } = await principal(db, req, "contact:create");
    const params = z
      .object({ id, part: z.coerce.number().int().min(0).max(2) })
      .parse(req.params);
    const upload = await db.upload.findUnique({ where: { id: params.id } });
    if (
      !upload ||
      upload.subjectId !== session.id ||
      upload.expiresAt <= new Date()
    )
      throw new HttpError(403, "Phiên tải CV đã hết hạn. Vui lòng chọn lại CV");
    const { content } = z
      .object({ content: z.string().max(3 * 1024 * 1024) })
      .strict()
      .parse(req.body);
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(content))
      throw new HttpError(400, "Dữ liệu CV không hợp lệ");
    const bytes = Buffer.from(content, "base64"),
      expected = Math.min(
        2 * 1024 * 1024,
        upload.size - params.part * 2 * 1024 * 1024,
      );
    if (expected <= 0 || bytes.length !== expected)
      throw new HttpError(400, "Phần tải CV không hợp lệ");
    const key = `${upload.id}:${params.part}`,
      contentHash = hash(content);
    const previous = await db.uploadPart.findUnique({ where: { key } });
    if (previous) {
      if (previous.contentHash !== contentHash)
        throw new HttpError(409, "CV đã thay đổi");
      return { ok: true };
    }
    const storageKey = randomUUID();
    await mkdir(config.uploadDir, { recursive: true, mode: 0o700 });
    await writeFile(join(config.uploadDir, storageKey), bytes, {
      flag: "wx",
      mode: 0o600,
    });
    try {
      await db.uploadPart.create({
        data: {
          key,
          uploadId: upload.id,
          part: params.part,
          storageKey,
          contentHash,
        },
      });
    } catch (error) {
      await unlink(join(config.uploadDir, storageKey));
      const existing = await db.uploadPart.findUnique({ where: { key } });
      if (!existing || existing.contentHash !== contentHash) throw error;
    }
    return { ok: true };
  });
  app.post("/contacts", async (req) => {
    const { session } = await principal(db, req, "contact:create");
    await rateLimit(db, `contact:${clientBucket(req)}`, 10);
    const body = z
      .object({
        data: contactFields,
        requestKey,
        uploadId: id.optional(),
        file: z
          .object({
            name: z.string().min(1).max(200),
            content: z.string().max(7 * 1024 * 1024),
          })
          .strict()
          .optional(),
      })
      .strict()
      .parse(req.body);
    let incomingFile = body.file;
    if (body.uploadId) {
      if (body.file) throw new HttpError(400, "Chỉ dùng một CV");
      const upload = await db.upload.findUnique({
        where: { id: body.uploadId },
      });
      if (
        !upload ||
        upload.subjectId !== session.id ||
        upload.expiresAt <= new Date()
      )
        throw new HttpError(403, "Phiên tải CV đã hết hạn");
      const parts = await db.uploadPart.findMany({
        where: { uploadId: upload.id },
        orderBy: { part: "asc" },
      });
      if (parts.length !== Math.ceil(upload.size / (2 * 1024 * 1024)))
        throw new HttpError(400, "CV chưa tải xong. Vui lòng thử lại");
      const bytes = Buffer.concat(
        await Promise.all(
          parts.map((p) => readFile(join(config.uploadDir, p.storageKey))),
        ),
      );
      if (bytes.length !== upload.size)
        throw new HttpError(400, "CV không đầy đủ");
      incomingFile = { name: upload.name, content: bytes.toString("base64") };
    }
    if (incomingFile && !body.data.position)
      throw new HttpError(400, "Nhập vị trí ứng tuyển");
    if (!incomingFile && body.data.position)
      throw new HttpError(400, "Vui lòng đính kèm CV");
    let storageKey: string | undefined;
    let fileData:
      | { storageKey: string; originalName: string; size: number; mime: string }
      | undefined;
    if (incomingFile) {
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(incomingFile.content))
        throw new HttpError(400, "File không hợp lệ");
      const bytes = Buffer.from(incomingFile.content, "base64");
      if (!bytes.length || bytes.length > 5 * 1024 * 1024)
        throw new HttpError(413, "CV tối đa 5 MB");
      const detected = await fileTypeFromBuffer(bytes);
      const allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!detected || !allowed.includes(detected.mime))
        throw new HttpError(415, "CV cần là PDF hoặc Word (.docx)");
      storageKey = randomUUID();
      await mkdir(config.uploadDir, { recursive: true, mode: 0o700 });
      await writeFile(join(config.uploadDir, storageKey), bytes, {
        flag: "wx",
        mode: 0o600,
      });
      fileData = {
        storageKey,
        originalName:
          incomingFile.name
            .replace(/[\r\n\x00]/g, "")
            .split(/[\\/]/)
            .pop() || "CV",
        size: bytes.length,
        mime: detected.mime,
      };
    }
    try {
      const recordId = await once(
        session.id,
        "contact",
        body.requestKey,
        body,
        async (tx) => {
          const file = fileData
            ? await tx.fileAsset.create({ data: fileData })
            : null;
          const contact = await tx.contact.create({
            data: {
              ...body.data,
              kind: file ? "APPLICATION" : "CONTACT",
              fileId: file?.id,
            },
          });
          await tx.emailOutbox.create({
            data: {
              eventKey: `contact:${contact.id}:received`,
              payload: { kind: "contact", recordId: contact.id },
            },
          });
          return contact.id;
        },
      );
      // A concurrent/retried submission can return the previous record: remove only this request's unused upload.
      if (
        storageKey &&
        !(await db.fileAsset.findUnique({ where: { storageKey } }))
      )
        await unlink(join(config.uploadDir, storageKey));
      return { id: recordId, status: "RECEIVED", delivery: "QUEUED" };
    } catch (error) {
      if (
        storageKey &&
        !(await db.fileAsset.findUnique({ where: { storageKey } }))
      )
        await unlink(join(config.uploadDir, storageKey)).catch(() => {});
      throw error;
    }
  });
  app.get("/contacts", async (req) => {
    await principal(db, req, "contact:read");
    const { page } = z
      .object({ page: z.coerce.number().int().min(1).max(10000).default(1) })
      .parse(req.query);
    const items = await db.contact.findMany({
      take: 25,
      skip: (page - 1) * 25,
      orderBy: { createdAt: "desc" },
    });
    const delivery = await db.emailOutbox.findMany({
      where: { eventKey: { in: items.map((c) => `contact:${c.id}:received`) } },
      select: {
        id: true,
        eventKey: true,
        status: true,
        attempts: true,
        lastError: true,
      },
    });
    return {
      items: items.map((c) => ({
        ...c,
        delivery: delivery.find(
          (e) => e.eventKey === `contact:${c.id}:received`,
        ),
      })),
      total: await db.contact.count(),
    };
  });
  app.get("/files/:id", async (req, reply) => {
    const { user } = await principal(db, req, "file:read");
    const asset = await db.fileAsset.findUnique({
      where: { id: id.parse((req.params as { id: string }).id) },
    });
    if (!asset) throw new HttpError(404, "Không tìm thấy CV");
    await db.auditEvent.create({
      data: { userId: user!.id, resourceId: asset.id, action: "file:read" },
    });
    return reply
      .header("Content-Type", asset.mime)
      .header(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodeURIComponent(asset.originalName)}`,
      )
      .header("Cache-Control", "no-store")
      .header("X-Content-Type-Options", "nosniff")
      .send(await readFile(join(config.uploadDir, asset.storageKey)));
  });
  app.get("/outbox", async (req) => {
    await principal(db, req, "outbox:read");
    return db.emailOutbox.findMany({
      where: { status: { in: ["FAILED", "UNKNOWN", "PENDING"] } },
      take: 100,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        eventKey: true,
        status: true,
        attempts: true,
        lastError: true,
        createdAt: true,
      },
    });
  });
  app.post("/outbox/:id/retry", async (req) => {
    const { user } = await principal(db, req, "outbox:retry");
    const eventId = id.parse((req.params as { id: string }).id);
    const event = await db.emailOutbox.findUnique({ where: { id: eventId } });
    if (!event || !["FAILED", "UNKNOWN"].includes(event.status))
      throw new HttpError(409, "Email không ở trạng thái cần gửi lại");
    const { reconciled } = z
      .object({ reconciled: z.boolean() })
      .strict()
      .parse(req.body);
    if (event.status === "UNKNOWN" && !reconciled)
      throw new HttpError(400, "Cần đối soát delivery trước khi gửi lại");
    await db.$transaction(async (tx) => {
      const changed = await tx.emailOutbox.updateMany({
        where: { id: eventId, status: event.status, attempts: event.attempts },
        data: {
          status: "PENDING",
          attempts: 0,
          nextAttemptAt: new Date(),
          lockedUntil: null,
        },
      });
      if (changed.count !== 1)
        throw new HttpError(409, "Email vừa được xử lý. Vui lòng tải lại");
      await tx.auditEvent.create({
        data: { userId: user!.id, resourceId: eventId, action: "outbox:retry" },
      });
    });
    return { ok: true };
  });
  return app;
}
