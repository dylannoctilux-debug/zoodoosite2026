"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { identity, staffToken } from "@/server/auth";
import { privateApi, ApiError } from "@/server/private-api";
export async function getSession() {
  return identity();
}
export async function logout() {
  const token = await staffToken();
  if (token) {
    try {
      await privateApi("/sessions/logout", { method: "POST", token });
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
    }
  }
  (await cookies()).delete("auth_session");
  redirect("/admin/login");
}
