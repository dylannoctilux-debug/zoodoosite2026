import { createHash, timingSafeEqual, randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import type { FastifyRequest } from "fastify";

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function serviceAuthorized(value: unknown, token: string) {
  if (typeof value !== "string") return false;
  const given = Buffer.from(value),
    expected = Buffer.from(`Bearer ${token}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
export async function createSession(db: PrismaClient, userId?: string) {
  const token = randomBytes(32).toString("base64url");
  const session = await db.session.create({
    data: {
      tokenHash: hash(token),
      userId,
      kind: userId ? "STAFF" : "GUEST",
      expiresAt: new Date(Date.now() + (userId ? 8 : 2) * 3600000),
    },
  });
  return { token, expiresAt: session.expiresAt };
}
export async function principal(
  db: PrismaClient,
  req: FastifyRequest,
  permission?: string,
) {
  const token = req.headers["x-session-token"];
  if (typeof token !== "string" || token.length > 200)
    throw new HttpError(401, "Vui lòng đăng nhập lại");
  const session = await db.session.findUnique({
    where: { tokenHash: hash(token) },
  });
  if (!session || session.revokedAt || session.expiresAt <= new Date())
    throw new HttpError(401, "Phiên đã hết hạn");
  const user = session.userId
    ? await db.user.findUnique({ where: { id: session.userId } })
    : null;
  if (session.kind === "STAFF" && (!user || user.deletedAt))
    throw new HttpError(401, "Tài khoản không còn hoạt động");
  const guestPermissions = ["slots:read", "booking:create", "contact:create"];
  const permissions =
    user?.permissions || (session.kind === "GUEST" ? guestPermissions : []);
  if (permission && !permissions.includes(permission))
    throw new HttpError(403, "Bạn không có quyền thực hiện thao tác này");
  return { session, user, permissions };
}
export async function rateLimit(
  db: PrismaClient,
  bucket: string,
  limit: number,
  minutes = 10,
) {
  const period = Math.floor(Date.now() / (minutes * 60000));
  const key = `${bucket}:${period}`;
  let result;
  try {
    result = await db.rateBucket.upsert({
      where: { key },
      create: {
        key,
        count: 1,
        expiresAt: new Date((period + 2) * minutes * 60000),
      },
      update: { count: { increment: 1 } },
    });
  } catch (error) {
    if ((error as { code?: string }).code !== "P2002") throw error;
    result = await db.rateBucket.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
  }
  if (result.count > limit)
    throw new HttpError(429, "Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau");
}
export const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ]!,
  );
