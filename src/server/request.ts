import "server-only";
import { ApiError } from "./private-api";
export function sameOrigin(request: Request) {
  // Browser Host stays bound to the requested deployment, including Vercel previews.
  // Request.url can use an internal proxy hostname and must not define the CSRF origin.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || new URL(request.url).host;
  let parsed: URL;
  try {
    parsed = new URL(origin || "");
  } catch {
    throw new ApiError(403, "Nguồn yêu cầu không hợp lệ");
  }
  if (
    !origin ||
    !["http:", "https:"].includes(parsed.protocol) ||
    parsed.host !== host.toLowerCase()
  )
    throw new ApiError(403, "Nguồn yêu cầu không hợp lệ");
}
export async function limitedBody(request: Request, max: number) {
  if (Number(request.headers.get("content-length") || 0) > max)
    throw new ApiError(413, "File hoặc nội dung quá lớn");
  if (!request.body) throw new ApiError(400, "Thiếu nội dung");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > max) {
        await reader.cancel();
        throw new ApiError(413, "File hoặc nội dung quá lớn");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
