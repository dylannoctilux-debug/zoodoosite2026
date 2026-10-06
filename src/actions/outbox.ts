"use server";
import { requireStaff } from "@/server/auth";
import { ApiError, privateApi } from "@/server/private-api";
import { revalidatePath } from "next/cache";
export async function retryEmail(id: string, reconciled: boolean) {
  try {
    await privateApi(`/outbox/${encodeURIComponent(id)}/retry`, {
      method: "POST",
      data: { reconciled },
      token: await requireStaff("outbox:retry"),
    });
    revalidatePath("/admin/email");
    return { ok: true as const };
  } catch (error) {
    if (error instanceof ApiError)
      return { ok: false as const, error: error.message };
    throw error;
  }
}
