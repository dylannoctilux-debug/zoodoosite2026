import "server-only";
import { readFileSync } from "node:fs";
import { headers } from "next/headers";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function privateApi<T>(
  path: string,
  options: {
    method?: string;
    data?: unknown;
    token?: string;
    binary?: boolean;
  } = {},
): Promise<T> {
  const origin =
    process.env.PRIVATE_API_URL ||
    (process.env.NODE_ENV !== "production" ? "http://127.0.0.1:4000" : "");
  const token = process.env.API_SERVICE_TOKEN_FILE
    ? readFileSync(process.env.API_SERVICE_TOKEN_FILE, "utf8").trim()
    : process.env.API_SERVICE_TOKEN;
  if (!origin || !token)
    throw new ApiError(
      503,
      "Dịch vụ đang được cấu hình. Vui lòng thử lại sau hoặc liên hệ ZooDoo",
    );
  const incoming = await headers();
  let response: Response;
  try {
    response = await fetch(new URL(path, origin), {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.data ? { "Content-Type": "application/json" } : {}),
        ...(options.token ? { "x-session-token": options.token } : {}),
        "x-client-address":
          incoming.get("x-vercel-forwarded-for") ||
          incoming.get("x-forwarded-for")?.split(",")[0].trim() ||
          "local",
      },
      body: options.data ? JSON.stringify(options.data) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new ApiError(503, "Không thể kết nối dịch vụ. Vui lòng thử lại sau");
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.error || "Yêu cầu chưa thực hiện được",
    );
  }
  return (options.binary ? response : await response.json()) as T;
}
