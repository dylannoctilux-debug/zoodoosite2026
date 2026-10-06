import { requireStaff } from "@/server/auth";
import { privateApi, ApiError } from "@/server/private-api";
import { NextResponse } from "next/server";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await requireStaff("file:read"),
      { id } = await params;
    const result = await privateApi<Response>(
      `/files/${encodeURIComponent(id)}`,
      { token, binary: true },
    );
    return new Response(result.body, {
      headers: {
        "Content-Type":
          result.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition":
          result.headers.get("content-disposition") || "attachment",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    if (e instanceof ApiError)
      return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
