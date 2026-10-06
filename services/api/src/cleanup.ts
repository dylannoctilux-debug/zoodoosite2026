import type { PrismaClient } from "@prisma/client";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
export async function cleanUploads(db: PrismaClient, dir: string) {
  const expired = await db.upload.findMany({
    where: { expiresAt: { lt: new Date() } },
    take: 10,
  });
  for (const upload of expired) {
    const parts = await db.uploadPart.findMany({
      where: { uploadId: upload.id },
    });
    for (const part of parts) {
      await unlink(join(dir, part.storageKey)).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      });
    }
    await db.$transaction([
      db.uploadPart.deleteMany({ where: { uploadId: upload.id } }),
      db.upload.delete({ where: { id: upload.id } }),
    ]);
  }
}
