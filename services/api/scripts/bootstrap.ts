// Run once in an API operations container on the private DB network. Never expose this as an HTTP route.
import { PrismaClient } from "@prisma/client";
import { secret } from "../src/config";
const bootstrapUri = secret("MONGODB_BOOTSTRAP_URI"),
  admin = new PrismaClient({ datasources: { db: { url: bootstrapUri } } });
try {
  try {
    await admin.$runCommandRaw({ replSetGetStatus: 1 });
  } catch (error) {
    if (
      !String(error).includes("NotYetInitialized") &&
      !String(error).includes("not yet initialized")
    )
      throw new Error("Không kiểm tra được replica set");
    await admin.$runCommandRaw({
      replSetInitiate: {
        _id: "rs0",
        members: [{ _id: 0, host: "mongodb:27017" }],
      },
    });
  }
  let primary = false;
  for (let i = 0; i < 60; i++) {
    const hello = await admin.$runCommandRaw({ hello: 1 });
    if (hello.isWritablePrimary) {
      primary = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  if (!primary) throw new Error("Replica set chưa sẵn sàng");
  const url = new URL(bootstrapUri);
  url.pathname = "/zoodoo";
  url.searchParams.set("authSource", "admin");
  const db = new PrismaClient({ datasources: { db: { url: url.toString() } } });
  try {
    const name = secret("MONGODB_APP_USER");
    const existing = await db.$runCommandRaw({ usersInfo: name });
    if (Array.isArray(existing.users) && existing.users.length)
      throw new Error(
        "Tài khoản API đã tồn tại; không tự ghi đè quyền/mật khẩu",
      );
    await db.$runCommandRaw({
      createUser: name,
      pwd: secret("MONGODB_APP_PASSWORD"),
      roles: [{ role: "readWrite", db: "zoodoo" }],
    });
  } finally {
    await db.$disconnect();
  }
  console.log("Đã khởi tạo replica set và tài khoản riêng cho API.");
} catch {
  console.error(
    "Khởi tạo database chưa hoàn tất. Kiểm tra secret và trạng thái replica set trên máy chủ; không đưa URI vào log.",
  );
  process.exitCode = 1;
} finally {
  await admin.$disconnect();
}
