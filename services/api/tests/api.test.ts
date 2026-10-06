import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID, randomBytes } from "node:crypto";
import { resolve, join } from "node:path";
import { mkdir, rm, readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt-ts";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import type { Transporter } from "nodemailer";
import { createApp } from "../src/app";
import { deliverOne } from "../src/outbox";
import { zooDate, zooInstant } from "../../../shared/booking";

let repl: MongoMemoryReplSet,
  db: PrismaClient,
  app: ReturnType<typeof createApp>,
  guest: string,
  staff: string,
  readOnly: string;
const fixturePassword = randomBytes(24).toString("base64url");
const serviceToken = randomBytes(32).toString("hex"),
  uploadDir = resolve(".test-data/uploads");
const headers = (token?: string) => ({
  authorization: `Bearer ${serviceToken}`,
  "x-session-token": token || guest,
  "x-client-address": "fixture-visitor",
});
let bookingId: string, contactId: string, fileId: string;
before(async () => {
  await mkdir(uploadDir, { recursive: true });
  let uri: string;
  const external = process.env.TEST_MONGODB_URI;
  if (external) {
    const parsed = new URL(external);
    if (
      process.env.CI !== "true" ||
      parsed.hostname !== "zoodoo-test-db" ||
      parsed.pathname !== "/zoodoo_test"
    )
      throw new Error("Chỉ cho phép database fixture trong network CI riêng");
    const admin = new PrismaClient({
      datasources: {
        db: {
          url: "mongodb://zoodoo-test-db:27017/admin?directConnection=true",
        },
      },
    });
    try {
      await admin.$runCommandRaw({
        replSetInitiate: {
          _id: "rs0",
          members: [{ _id: 0, host: "zoodoo-test-db:27017" }],
        },
      });
      let ready = false;
      for (let i = 0; i < 60; i++) {
        const hello = await admin.$runCommandRaw({ hello: 1 });
        if (hello.isWritablePrimary) {
          ready = true;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (!ready) throw new Error("CI replica set chưa sẵn sàng");
    } finally {
      await admin.$disconnect();
    }
    uri = external;
  } else {
    repl = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: "wiredTiger" },
      binary: { version: "7.0.24" },
    });
    uri = repl.getUri("zoodoo_test");
  }
  execFileSync(
    process.execPath,
    [
      resolve("services/api/node_modules/prisma/build/index.js"),
      "db",
      "push",
      "--schema",
      resolve("services/api/schema.prisma"),
      "--skip-generate",
    ],
    { env: { ...process.env, MONGODB_URI: uri }, stdio: "pipe" },
  );
  db = new PrismaClient({ datasources: { db: { url: uri } } });
  await db.bookingPolicy.create({
    data: {
      key: "default",
      leadHours: 18,
      durationMinutes: 90,
      firstHour: 9,
      lastHour: 16,
    },
  });
  await db.user.create({
    data: {
      email: "admin@example.test",
      password: hashSync(fixturePassword, 10),
      firstName: "Fixture",
      lastName: "Admin",
      permissions: [
        "slots:read",
        "booking:create",
        "booking:read",
        "booking:update",
        "booking:accept",
        "contact:create",
        "contact:read",
        "file:read",
        "outbox:read",
        "outbox:retry",
      ],
    },
  });
  await db.user.create({
    data: {
      email: "reader@example.test",
      password: hashSync(fixturePassword, 10),
      firstName: "Fixture",
      lastName: "Reader",
      permissions: ["booking:read"],
    },
  });
  app = createApp(db, { serviceToken, uploadDir });
  guest = (
    await app.inject({
      method: "POST",
      url: "/sessions/guest",
      headers: { authorization: `Bearer ${serviceToken}` },
    })
  ).json().token;
  staff = (
    await app.inject({
      method: "POST",
      url: "/sessions/login",
      headers: headers(),
      payload: { email: "admin@example.test", password: fixturePassword },
    })
  ).json().token;
  readOnly = (
    await app.inject({
      method: "POST",
      url: "/sessions/login",
      headers: headers(),
      payload: { email: "reader@example.test", password: fixturePassword },
    })
  ).json().token;
});
after(async () => {
  await app?.close();
  await db?.$disconnect();
  await repl?.stop();
  await rm(resolve(".test-data"), { recursive: true, force: true });
});
const booking = () => {
  const start = zooInstant(
    zooDate().add(3, "day").format("YYYY-MM-DD"),
    "09:00",
  );
  return {
    name: "Fixture visitor",
    email: "visitor@example.test",
    phone: "0900000000",
    adults: 1,
    kids: 0,
    note: "",
    start_time: start.toISOString(),
    end_time: new Date(+start + 90 * 60000).toISOString(),
  };
};
test("Every API request requires service identity; guest cannot read or mutate admin resources", async () => {
  for (const url of ["/health", "/bookings", "/contacts", "/outbox"]) {
    assert.equal((await app.inject({ url })).statusCode, 401);
  }
  assert.equal(
    (
      await app.inject({
        url: "/bookings?startRange=2026-10-01&endRange=2026-11-01",
        headers: headers(),
      })
    ).statusCode,
    403,
  );
  assert.equal(
    (
      await app.inject({
        method: "PATCH",
        url: "/bookings/000000000000000000000000",
        headers: headers(),
        payload: { name: "unauthorized" },
      })
    ).statusCode,
    403,
  );
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/bookings/000000000000000000000000/accept",
        headers: headers(),
        payload: {},
      })
    ).statusCode,
    403,
  );
  assert.equal(await db.booking.count(), 0);
});
test("Runtime booking validation rejects forged status, negative counts, invalid times and past slots", async () => {
  for (const data of [
    { ...booking(), status: "ACCEPTED" },
    { ...booking(), adults: -1 },
    { ...booking(), kids: 1.2 },
    { ...booking(), end_time: "2020-01-01T00:00:00Z" },
    {
      ...booking(),
      start_time: "2020-01-01T02:00:00Z",
      end_time: "2020-01-01T03:30:00Z",
    },
  ])
    assert.equal(
      (
        await app.inject({
          method: "POST",
          url: "/bookings",
          headers: headers(),
          payload: { data, requestKey: randomUUID() },
        })
      ).statusCode,
      400,
    );
  assert.equal(await db.booking.count(), 0);
});
test("Concurrent retries create one booking and durable notification events", async () => {
  const payload = { data: booking(), requestKey: randomUUID() };
  const responses = await Promise.all(
    [1, 2, 3].map(() =>
      app.inject({
        method: "POST",
        url: "/bookings",
        headers: headers(),
        payload,
      }),
    ),
  );
  for (const response of responses)
    assert.equal(response.statusCode, 200, response.body);
  bookingId = responses[0].json().id;
  assert.equal(new Set(responses.map((r) => r.json().id)).size, 1);
  assert.equal(await db.booking.count(), 1);
  assert.equal(await db.emailOutbox.count(), 2);
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/bookings",
        headers: headers(),
        payload: { ...payload, data: { ...payload.data, name: "changed" } },
      })
    ).statusCode,
    409,
  );
});
test("Read permission does not imply update/accept; acceptance emits once", async () => {
  assert.equal(
    (
      await app.inject({
        url: `/bookings/${bookingId}`,
        headers: headers(readOnly),
      })
    ).statusCode,
    200,
  );
  assert.equal(
    (
      await app.inject({
        method: "PATCH",
        url: `/bookings/${bookingId}`,
        headers: headers(readOnly),
        payload: { name: "wrong" },
      })
    ).statusCode,
    403,
  );
  for (let i = 0; i < 2; i++)
    assert.equal(
      (
        await app.inject({
          method: "POST",
          url: `/bookings/${bookingId}/accept`,
          headers: headers(staff),
          payload: {},
        })
      ).statusCode,
      200,
    );
  assert.equal(
    await db.emailOutbox.count({
      where: { eventKey: `booking:${bookingId}:accepted` },
    }),
    1,
  );
  assert.equal(
    (
      await app.inject({
        method: "PATCH",
        url: `/bookings/${bookingId}`,
        headers: headers(staff),
        payload: { end_time: "2020-01-01" },
      })
    ).statusCode,
    400,
  );
});
test("Deleted user, revoked session and malformed token are denied", async () => {
  const reader = await db.user.findUniqueOrThrow({
    where: { email: "reader@example.test" },
  });
  await db.user.update({
    where: { id: reader.id },
    data: { deletedAt: new Date() },
  });
  assert.equal(
    (
      await app.inject({
        url: `/bookings/${bookingId}`,
        headers: headers(readOnly),
      })
    ).statusCode,
    401,
  );
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/sessions/login",
        headers: headers(),
        payload: { email: reader.email, password: fixturePassword },
      })
    ).statusCode,
    401,
  );
  assert.equal(
    (
      await app.inject({
        url: "/sessions/me",
        headers: headers("broken-cookie"),
      })
    ).statusCode,
    401,
  );
  const token = (
    await app.inject({
      method: "POST",
      url: "/sessions/guest",
      headers: headers(),
    })
  ).json().token;
  await app.inject({
    method: "POST",
    url: "/sessions/logout",
    headers: headers(token),
  });
  assert.equal(
    (await app.inject({ url: "/sessions/me", headers: headers(token) }))
      .statusCode,
    401,
  );
});
test("CV is sniffed, persists across API restart and cannot be downloaded by guests", async () => {
  const payload = {
    data: {
      name: "Applicant",
      email: "candidate@example.test",
      mobile: "0900000000",
      position: "Fixture job",
    },
    requestKey: randomUUID(),
    file: {
      name: "cv.pdf",
      content: Buffer.from("not a pdf").toString("base64"),
    },
  };
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/contacts",
        headers: headers(),
        payload,
      })
    ).statusCode,
    415,
  );
  const bytes = Buffer.from("%PDF-1.7\nFixture CV\n%%EOF");
  payload.file.content = bytes.toString("base64");
  const response = await app.inject({
    method: "POST",
    url: "/contacts",
    headers: headers(),
    payload,
  });
  assert.equal(response.statusCode, 200, response.body);
  contactId = response.json().id;
  const record = await db.contact.findUniqueOrThrow({
    where: { id: contactId },
  });
  fileId = record.fileId!;
  await app.close();
  app = createApp(db, { serviceToken, uploadDir });
  assert.equal(
    (await app.inject({ url: `/files/${fileId}`, headers: headers() }))
      .statusCode,
    403,
  );
  const file = await app.inject({
    url: `/files/${fileId}`,
    headers: headers(staff),
  });
  assert.equal(file.statusCode, 200);
  assert.deepEqual(file.rawPayload, bytes);
  assert.equal(file.headers["cache-control"], "no-store");
  const retry = await app.inject({
    method: "POST",
    url: "/contacts",
    headers: headers(),
    payload,
  });
  assert.equal(retry.json().id, contactId);
  assert.equal(await db.contact.count(), 1);
});
test("5 MB CV uploads work in parts below Vercel request limits, with ownership checks", async () => {
  const bytes = Buffer.alloc(5 * 1024 * 1024, 32);
  Buffer.from("%PDF-1.7\n").copy(bytes);
  const upload = (
    await app.inject({
      method: "POST",
      url: "/uploads",
      headers: headers(),
      payload: { name: "large.pdf", size: bytes.length },
    })
  ).json();
  assert.ok(upload.id);
  const otherGuest = (
    await app.inject({
      method: "POST",
      url: "/sessions/guest",
      headers: headers(),
    })
  ).json().token;
  assert.equal(
    (
      await app.inject({
        method: "PUT",
        url: `/uploads/${upload.id}/0`,
        headers: headers(otherGuest),
        payload: { content: "AA==" },
      })
    ).statusCode,
    403,
  );
  for (let part = 0; part < 3; part++) {
    const content = bytes
      .subarray(part * 2 * 1024 * 1024, (part + 1) * 2 * 1024 * 1024)
      .toString("base64");
    const r = await app.inject({
      method: "PUT",
      url: `/uploads/${upload.id}/${part}`,
      headers: headers(),
      payload: { content },
    });
    assert.equal(r.statusCode, 200, r.body);
  }
  const r = await app.inject({
    method: "POST",
    url: "/contacts",
    headers: headers(),
    payload: {
      data: {
        name: "Applicant large",
        email: "large@example.test",
        mobile: "0900000000",
        position: "Fixture job",
      },
      requestKey: randomUUID(),
      uploadId: upload.id,
    },
  });
  assert.equal(r.statusCode, 200, r.body);
  const c = await db.contact.findUniqueOrThrow({ where: { id: r.json().id } }),
    f = await db.fileAsset.findUniqueOrThrow({ where: { id: c.fileId! } });
  assert.deepEqual(await readFile(join(uploadDir, f.storageKey)), bytes);
});
test("SMTP failure keeps database state; timeout is held for reconciliation", async () => {
  const broken = {
    sendMail: async () => {
      throw Object.assign(new Error("fixture smtp error"), {
        code: "ECONNECTION",
      });
    },
  } as unknown as Transporter;
  assert.equal(
    await deliverOne(
      db,
      broken,
      uploadDir,
      "mail@example.test",
      "owner@example.test",
    ),
    true,
  );
  const pending = await db.emailOutbox.findFirstOrThrow({
    where: { attempts: 1 },
  });
  assert.equal(pending.status, "PENDING");
  assert.equal(pending.lastError, "ECONNECTION");
  assert.equal(await db.booking.count(), 1);
  await db.emailOutbox.update({
    where: { id: pending.id },
    data: { nextAttemptAt: new Date(0) },
  });
  const timeout = {
    sendMail: async () => {
      throw Object.assign(new Error("fixture timeout"), { code: "ETIMEDOUT" });
    },
  } as unknown as Transporter;
  await deliverOne(
    db,
    timeout,
    uploadDir,
    "mail@example.test",
    "owner@example.test",
  );
  assert.equal(
    (await db.emailOutbox.findUniqueOrThrow({ where: { id: pending.id } }))
      .status,
    "UNKNOWN",
  );
});

test("Database closures and policy determine slots; malformed dates are rejected", async () => {
  const date = zooDate().add(4, "day").format("YYYY-MM-DD"),
    start = zooInstant(date, "10:00");
  await db.slotClosure.create({
    data: { startTime: start, reason: "Fixture closure" },
  });
  const response = await app.inject({
    url: `/slots?date=${date}`,
    headers: headers(),
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().slots.length, 7);
  assert.ok(
    !response.json().slots.some((s: { start: string }) => s.start === "10:00"),
  );
  assert.equal(
    (await app.inject({ url: "/slots?date=2026-02-30", headers: headers() }))
      .statusCode,
    400,
  );
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/bookings",
        headers: headers(),
        payload: {
          requestKey: randomUUID(),
          data: {
            ...booking(),
            start_time: start.toISOString(),
            end_time: new Date(+start + 90 * 60000).toISOString(),
          },
        },
      })
    ).statusCode,
    409,
  );
});
test("Abandoned SMTP delivery needs reconciliation and cannot be retried by guests", async () => {
  const event = await db.emailOutbox.create({
    data: {
      eventKey: `fixture:${randomUUID()}`,
      payload: { kind: "booking" },
      status: "PROCESSING",
      nextAttemptAt: new Date(0),
      lockedUntil: new Date(0),
    },
  });
  let sent = false;
  await deliverOne(
    db,
    {
      sendMail: async () => {
        sent = true;
      },
    } as unknown as Transporter,
    uploadDir,
    "mail@example.test",
    "owner@example.test",
  );
  assert.equal(sent, false);
  assert.equal(
    (await db.emailOutbox.findUniqueOrThrow({ where: { id: event.id } }))
      .status,
    "UNKNOWN",
  );
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: `/outbox/${event.id}/retry`,
        headers: headers(),
        payload: { reconciled: true },
      })
    ).statusCode,
    403,
  );
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: `/outbox/${event.id}/retry`,
        headers: headers(staff),
        payload: { reconciled: false },
      })
    ).statusCode,
    400,
  );
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: `/outbox/${event.id}/retry`,
        headers: headers(staff),
        payload: { reconciled: true },
      })
    ).statusCode,
    200,
  );
  assert.equal(
    (await db.emailOutbox.findUniqueOrThrow({ where: { id: event.id } }))
      .status,
    "PENDING",
  );
});
