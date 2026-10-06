import type { PrismaClient } from "@prisma/client";
import type { Transporter } from "nodemailer";
import { renderToStaticMarkup } from "react-dom/server";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import BookingReceiveEmail from "./emails/new-booking.template";
import BookingConfirmEmail from "./emails/confirm-booking.email";
import { escapeHtml } from "./security";
import { zooDate } from "../../../shared/booking";

export async function deliverOne(
  db: PrismaClient,
  transport: Transporter,
  uploadDir: string,
  from: string,
  owner: string,
) {
  const now = new Date();
  const event = await db.emailOutbox.findFirst({
    where: {
      nextAttemptAt: { lte: now },
      OR: [
        { status: "PENDING" },
        { status: "PROCESSING", lockedUntil: { lt: now } },
      ],
    },
    orderBy: [{ nextAttemptAt: "asc" }, { createdAt: "asc" }],
  });
  if (!event) return false;
  if (event.status === "PROCESSING") {
    await db.emailOutbox.updateMany({
      where: { id: event.id, status: "PROCESSING", lockedUntil: { lt: now } },
      data: {
        status: "UNKNOWN",
        lastError: "STALE_DELIVERY",
        lockedUntil: null,
      },
    });
    return true;
  }
  const leaseId = randomUUID();
  const claim = await db.emailOutbox.updateMany({
    where: {
      id: event.id,
      status: event.status,
      OR: event.leaseId
        ? [{ leaseId: event.leaseId }]
        : [{ leaseId: null }, { leaseId: { isSet: false } }],
    },
    data: {
      status: "PROCESSING",
      leaseId,
      lockedUntil: new Date(+now + 120000),
      attempts: { increment: 1 },
    },
  });
  if (!claim.count) return true;
  try {
    const payload = event.payload as Record<string, any>;
    let message: Record<string, any>;
    if (payload.kind === "booking") {
      const template = payload.accepted
        ? BookingConfirmEmail
        : BookingReceiveEmail;
      const html =
        "<!doctype html>" +
        renderToStaticMarkup(
          template({
            preview: payload.accepted
              ? "Booking đã xác nhận"
              : "Booking đã được tiếp nhận",
            time: zooDate(payload.start).format("HH:mm DD-MM-YYYY"),
            adults: payload.adults,
            kids: payload.kids,
            validationCode: payload.code,
          }),
        );
      message = {
        to: payload.staff ? owner : payload.email,
        subject: payload.accepted
          ? "ZooDoo — Booking đã xác nhận"
          : "ZooDoo — Đã tiếp nhận yêu cầu đặt vé",
        html,
      };
    } else {
      const record = await db.contact.findUniqueOrThrow({
        where: { id: payload.recordId },
      });
      const file = record.fileId
        ? await db.fileAsset.findUniqueOrThrow({ where: { id: record.fileId } })
        : null;
      const html =
        `<h1>${record.kind === "APPLICATION" ? "Hồ sơ ứng tuyển" : "Liên hệ hợp tác"}</h1><p>Mã tiếp nhận: ${escapeHtml(record.id)}</p>` +
        Object.entries(record)
          .filter(([key]) =>
            [
              "name",
              "email",
              "mobile",
              "company",
              "jobTitle",
              "position",
              "note",
            ].includes(key),
          )
          .map(
            ([key, value]) =>
              `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</p>`,
          )
          .join("");
      message = {
        to: owner,
        replyTo: record.email,
        subject: `ZooDoo — ${record.kind === "APPLICATION" ? "Hồ sơ ứng tuyển" : "Liên hệ mới"}`,
        html,
        attachments: file
          ? [
              {
                filename: file.originalName,
                path: join(uploadDir, file.storageKey),
                contentType: file.mime,
              },
            ]
          : [],
      };
    }
    const sent = await transport.sendMail({
      ...message,
      from,
      messageId: `<${event.id}@zoodoo.vn>`,
    });
    if (sent.rejected?.length)
      throw Object.assign(new Error("Partial mail delivery"), {
        code: "EPARTIAL",
      });
    await db.emailOutbox.updateMany({
      where: { id: event.id, leaseId },
      data: {
        status: "SENT",
        sentAt: new Date(),
        messageId: sent.messageId,
        lastError: null,
        lockedUntil: null,
      },
    });
  } catch (error) {
    const code = String((error as { code?: string }).code || "SEND_FAILED");
    // SMTP timeouts/partial acceptance may already have delivered a message: require reconciliation before retry.
    const ambiguous = ["ETIMEDOUT", "EPARTIAL", "ESOCKET"].includes(code);
    const attempts = event.attempts + 1;
    await db.emailOutbox.updateMany({
      where: { id: event.id, leaseId },
      data: {
        status: ambiguous ? "UNKNOWN" : attempts >= 6 ? "FAILED" : "PENDING",
        lastError: code,
        nextAttemptAt: new Date(
          Date.now() + Math.min(3600, 30 * 2 ** attempts) * 1000,
        ),
        lockedUntil: null,
      },
    });
  }
  return true;
}
