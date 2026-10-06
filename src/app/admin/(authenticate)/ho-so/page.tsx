import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaff, identity } from "@/server/auth";
import { privateApi } from "@/server/private-api";
import { positivePage } from "@/lib/content";
const deliveryNames: Record<string, string> = {
  PENDING: "Đang chờ gửi",
  PROCESSING: "Đang gửi",
  SENT: "Đã gửi",
  FAILED: "Gửi thất bại",
  UNKNOWN: "Cần đối soát",
};
export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = positivePage((await searchParams).page),
    token = await requireStaff("contact:read"),
    user = await identity();
  const result = await privateApi<{
    items: {
      id: string;
      kind: string;
      name: string;
      email: string;
      mobile: string;
      position?: string;
      company?: string;
      note?: string;
      fileId?: string;
      delivery?: { status: string };
    }[];
    total: number;
  }>(`/contacts?page=${page}`, { token });
  const pages = Math.max(1, Math.ceil(result.total / 25));
  if (page > pages) redirect(`/admin/ho-so?page=${pages}`);
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Liên hệ và hồ sơ ({result.total})
      </h1>
      {!result.items.length && <p>Chưa có hồ sơ.</p>}
      <div className="space-y-6">
        {result.items.map((c) => (
          <article key={c.id} className="rounded-lg border p-5 break-words">
            <h2 className="text-lg font-bold">
              {c.name} — {c.kind === "APPLICATION" ? c.position : c.company}
            </h2>
            <p>
              {c.email} · {c.mobile}
            </p>
            <p className="whitespace-pre-wrap">{c.note}</p>
            <p className="text-sm mt-2">
              Mã: {c.id} · Email:{" "}
              {deliveryNames[c.delivery?.status || ""] || "Chưa có trạng thái"}
            </p>
            {c.fileId && user?.permissions.includes("file:read") && (
              <Link
                href={`/api/files/${c.fileId}`}
                className="inline-block py-3 text-green-default underline"
              >
                Tải CV
              </Link>
            )}
          </article>
        ))}
      </div>
      {pages > 1 && (
        <nav aria-label="Trang hồ sơ" className="flex items-center gap-6 mt-6">
          {page > 1 && (
            <Link
              href={`/admin/ho-so?page=${page - 1}`}
              className="p-3 underline"
            >
              Trang trước
            </Link>
          )}
          <span>
            {page}/{pages}
          </span>
          {page < pages && (
            <Link
              href={`/admin/ho-so?page=${page + 1}`}
              className="p-3 underline"
            >
              Trang sau
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
