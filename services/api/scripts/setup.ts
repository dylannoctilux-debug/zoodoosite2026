import { PrismaClient } from "@prisma/client";
import { secret } from "../src/config";

const db = new PrismaClient({
  datasources: { db: { url: secret("MONGODB_URI") } },
});
try {
  await db.bookingPolicy.upsert({
    where: { key: "default" },
    create: {
      key: "default",
      leadHours: 18,
      durationMinutes: 90,
      firstHour: 9,
      lastHour: 16,
    },
    update: {},
  });
  for (const collection of ["Session", "RateBucket"])
    await db.$runCommandRaw({
      createIndexes: collection,
      indexes: [
        {
          key: { expiresAt: 1 },
          name: "expire_records",
          expireAfterSeconds: 0,
        },
      ],
    });
  // Existing users receive no implicit privileges. An operator grants permissions to an explicitly selected account.
  const email = process.argv[2];
  if (email) {
    const user = await db.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user || user.deletedAt)
      throw new Error("Không tìm thấy tài khoản đang hoạt động");
    await db.user.update({
      where: { id: user.id },
      data: {
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
  }
  console.log(
    "Đã cấu hình lịch và indexes; quyền chỉ cấp cho tài khoản được chỉ định.",
  );
} catch {
  console.error(
    "Chưa cấu hình được database/quyền. Kiểm tra secret và tài khoản được chỉ định trên máy chủ API.",
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
