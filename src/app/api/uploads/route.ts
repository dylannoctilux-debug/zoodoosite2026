import { NextResponse } from "next/server";
import { guestToken } from "@/server/auth";
import { privateApi, ApiError } from "@/server/private-api";
import { sameOrigin, limitedBody } from "@/server/request";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const token = await guestToken(),
      bytes = await limitedBody(request, 3 * 1024 * 1024 + 65536);
    let body;
    try {
      body = JSON.parse(bytes.toString("utf8"));
    } catch {
      throw new ApiError(400, "Dữ liệu CV không hợp lệ");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new ApiError(400, "Dữ liệu CV không hợp lệ");
    const path = body.uploadId
      ? `/uploads/${encodeURIComponent(body.uploadId)}/${encodeURIComponent(body.part)}`
      : "/uploads";
    const result = await privateApi(path, {
      method: body.uploadId ? "PUT" : "POST",
      token,
      data: body.uploadId
        ? { content: body.content }
        : { name: body.name, size: body.size },
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof ApiError
            ? error.message
            : "Chưa tải được CV. Vui lòng thử lại",
      },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}
