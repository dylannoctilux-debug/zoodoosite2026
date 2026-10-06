import { NextResponse } from "next/server";
import { guestToken } from "@/server/auth";
import { privateApi, ApiError } from "@/server/private-api";
import { limitedBody, sameOrigin } from "@/server/request";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const type = request.headers.get("content-type") || "";
    if (
      !type.startsWith("application/json") &&
      !type.startsWith("multipart/form-data")
    )
      throw new ApiError(415, "Định dạng nội dung không hỗ trợ");
    const token = await guestToken();
    const bytes = await limitedBody(request, 5 * 1024 * 1024 + 65536);
    let payload;
    if (type.startsWith("application/json")) {
      try {
        payload = JSON.parse(bytes.toString("utf8"));
      } catch {
        throw new ApiError(400, "Nội dung không hợp lệ");
      }
    } else {
      let form: FormData;
      try {
        form = await new Response(bytes, {
          headers: { "Content-Type": type },
        }).formData();
      } catch {
        throw new ApiError(400, "Hồ sơ không hợp lệ");
      }
      const cv = form.get("cv");
      if (!(cv instanceof File) || !cv.size)
        throw new ApiError(400, "Vui lòng đính kèm CV");
      if (cv.size > 5 * 1024 * 1024) throw new ApiError(413, "CV tối đa 5 MB");
      payload = {
        requestKey: form.get("requestKey"),
        data: {
          name: form.get("name"),
          email: form.get("email"),
          mobile: form.get("mobile"),
          position: form.get("position"),
        },
        file: {
          name: cv.name,
          content: Buffer.from(await cv.arrayBuffer()).toString("base64"),
        },
      };
    }
    return NextResponse.json(
      await privateApi("/contacts", { method: "POST", token, data: payload }),
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof ApiError
            ? error.message
            : "Chưa gửi được thông tin. Vui lòng thử lại",
      },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}
