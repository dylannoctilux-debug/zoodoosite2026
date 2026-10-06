import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { config, secret } from "./config";
import { createApp } from "./app";
import { cleanUploads } from "./cleanup";
import { ensureReady } from "./readiness";
import { deliverOne } from "./outbox";

const settings = config();
const db = new PrismaClient({
  datasources: { db: { url: secret("MONGODB_URI") } },
});
try {
  await db.$connect();
  await ensureReady(db);
} catch {
  console.error(
    "API chưa sẵn sàng: kiểm tra DB, schema/index và policy qua API operations.",
  );
  await db.$disconnect();
  process.exit(1);
}
const transport = nodemailer.createTransport({
  host: secret("EMAIL_SMTP_HOST"),
  port: Number(process.env.EMAIL_SMTP_PORT || 587),
  secure: process.env.EMAIL_SMTP_PORT === "465",
  requireTLS: process.env.EMAIL_SMTP_PORT !== "465",
  auth: {
    user: secret("EMAIL_SMTP_USER"),
    pass: secret("EMAIL_SMTP_PASSWORD"),
  },
  connectionTimeout: 15000,
  socketTimeout: 30000,
});
const from = secret("EMAIL_FROM"),
  owner = secret("OWNER_EMAIL");
const app = createApp(db, settings);
let busy = false;
const timer = setInterval(async () => {
  if (busy) return;
  busy = true;
  try {
    await deliverOne(db, transport, settings.uploadDir, from, owner);
    await cleanUploads(db, settings.uploadDir);
  } catch {
    app.log.error("Outbox processing unavailable");
  } finally {
    busy = false;
  }
}, 5000);
app.addHook("onClose", async () => {
  clearInterval(timer);
  transport.close();
  await db.$disconnect();
});
for (const signal of ["SIGTERM", "SIGINT"] as const)
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
await app.listen({ host: "0.0.0.0", port: settings.port });
