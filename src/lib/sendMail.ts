export interface SubmissionResult {
  id: string;
  status: string;
  delivery: string;
}
async function send(body: BodyInit, json = false): Promise<SubmissionResult> {
  let response: Response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      body,
      headers: json ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new Error("Không có kết nối. Thông tin vẫn được giữ để bạn thử lại");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      result.error || "Chưa gửi được thông tin. Vui lòng thử lại",
    );
  return result;
}
export function sendMail(data: Record<string, unknown>, requestKey: string) {
  return send(JSON.stringify({ data, requestKey }), true);
}
const uploads = new Map<string, string>();
async function upload(data: unknown) {
  const response = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(result.error || "Chưa tải được CV. Vui lòng thử lại");
  return result;
}
export async function sendMailHiring(
  data: {
    name: string;
    email: string;
    mobile: string;
    position: string;
    cv: File;
  },
  requestKey: string,
) {
  let uploadId = uploads.get(requestKey);
  if (!uploadId) {
    uploadId = (await upload({ name: data.cv.name, size: data.cv.size }))
      .id as string;
    uploads.set(requestKey, uploadId);
  }
  for (
    let offset = 0, part = 0;
    offset < data.cv.size;
    offset += 2 * 1024 * 1024, part++
  ) {
    const bytes = new Uint8Array(
      await data.cv.slice(offset, offset + 2 * 1024 * 1024).arrayBuffer(),
    );
    let binary = "";
    for (let i = 0; i < bytes.length; i += 32768)
      binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
    await upload({ uploadId, part, content: btoa(binary) });
  }
  const { cv, ...fields } = data;
  const result = await send(
    JSON.stringify({ data: fields, requestKey, uploadId }),
    true,
  );
  uploads.delete(requestKey);
  return result;
}
