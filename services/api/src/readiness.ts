import type { PrismaClient } from "@prisma/client";
export async function ensureReady(db: PrismaClient) {
  await db.bookingPolicy.findUniqueOrThrow({ where: { key: "default" } });
  for (const [collection, field] of [
    ["Session", "tokenHash"],
    ["Submission", "key"],
    ["EmailOutbox", "eventKey"],
    ["UploadPart", "key"],
  ]) {
    const result = await db.$runCommandRaw({
      listIndexes: collection,
      cursor: {},
    });
    const indexes = (
      result.cursor as {
        firstBatch?: { unique?: boolean; key?: Record<string, unknown> }[];
      }
    )?.firstBatch;
    if (!indexes?.some((index) => index.unique && index.key?.[field] === 1))
      throw new Error(
        "Database cần schema/index đã kiểm chứng trước khi khởi động API",
      );
  }
}
