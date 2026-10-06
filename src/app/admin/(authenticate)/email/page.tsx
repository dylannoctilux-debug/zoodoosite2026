import { requireStaff, identity } from "@/server/auth";
import { privateApi } from "@/server/private-api";
import RetryEmail from "./retry";
const states: Record<string, string> = {
  PENDING: "Đang chờ gửi",
  FAILED: "Gửi thất bại",
  UNKNOWN: "Chưa rõ kết quả gửi",
};
export default async function EmailPage() {
  const token = await requireStaff("outbox:read"),
    user = await identity();
  const events = await privateApi<
    {
      id: string;
      eventKey: string;
      status: string;
      attempts: number;
      lastError?: string;
    }[]
  >("/outbox", { token });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trạng thái email</h1>
      <p className="mb-6">
        Tối đa 100 email gần nhất đang chờ hoặc cần xử lý. Thư chưa rõ kết quả
        gửi cần đối soát trước để tránh gửi trùng.
      </p>
      {!events.length && <p>Không có email cần xử lý.</p>}
      <div className="space-y-4">
        {events.map((e) => (
          <article key={e.id} className="border rounded p-5 break-words">
            <h2 className="font-bold">{states[e.status]}</h2>
            <p className="text-sm mt-2">Mã sự kiện: {e.eventKey}</p>
            <p>
              Số lần thử: {e.attempts}
              {e.lastError ? ` · Mã lỗi: ${e.lastError}` : ""}
            </p>
            {user?.permissions.includes("outbox:retry") &&
              ["FAILED", "UNKNOWN"].includes(e.status) && (
                <RetryEmail id={e.id} unknown={e.status === "UNKNOWN"} />
              )}
          </article>
        ))}
      </div>
    </div>
  );
}
