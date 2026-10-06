"use server";
import { redirect } from "next/navigation";
import { privateApi, ApiError } from "@/server/private-api";
import { saveStaffSession, type Identity } from "@/server/auth";
export async function login(formData: FormData) {
  let destination = "/admin";
  try {
    const session = await privateApi<{ token: string; expiresAt: string }>(
      "/sessions/login",
      {
        method: "POST",
        data: {
          email: formData.get("email"),
          password: formData.get("password"),
        },
      },
    );
    const user = await privateApi<Identity>("/sessions/me", {
      token: session.token,
    });
    destination = user.permissions.includes("booking:read")
      ? "/admin"
      : user.permissions.includes("contact:read")
        ? "/admin/ho-so"
        : user.permissions.includes("outbox:read")
          ? "/admin/email"
          : "/admin";
    await saveStaffSession(session);
  } catch (e) {
    return {
      error:
        e instanceof ApiError
          ? e.message
          : "Chưa đăng nhập được. Vui lòng thử lại",
    };
  }
  redirect(destination);
}
