import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, privateApi } from "./private-api";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
export type Identity = {
  kind: "STAFF" | "GUEST";
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  permissions: string[];
};
export async function staffToken() {
  return (await cookies()).get("auth_session")?.value;
}
export async function identity() {
  const token = await staffToken();
  if (!token) return null;
  try {
    return await privateApi<Identity>("/sessions/me", { token });
  } catch (error) {
    if (error instanceof ApiError && [401, 403].includes(error.status))
      return null;
    throw error;
  }
}
export async function requireStaff(permission?: string) {
  const user = await identity();
  if (!user || user.kind !== "STAFF") redirect("/admin/login");
  if (permission && !user.permissions.includes(permission))
    throw new ApiError(403, "Bạn không có quyền thực hiện thao tác này");
  return (await staffToken())!;
}
export async function saveStaffSession(session: {
  token: string;
  expiresAt: string;
}) {
  (await cookies()).set("auth_session", session.token, {
    ...options,
    expires: new Date(session.expiresAt),
  });
}
// Called only from actions/route handlers, where setting a cookie is permitted.
export async function guestToken() {
  const jar = await cookies();
  const existing = jar.get("guest_session")?.value;
  if (existing) {
    try {
      const session = await privateApi<Identity>("/sessions/me", {
        token: existing,
      });
      if (session.kind === "GUEST") return existing;
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
    }
  }
  const result = await privateApi<{ token: string; expiresAt: string }>(
    "/sessions/guest",
    { method: "POST" },
  );
  jar.set("guest_session", result.token, {
    ...options,
    expires: new Date(result.expiresAt),
  });
  return result.token;
}
