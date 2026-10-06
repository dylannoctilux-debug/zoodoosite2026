import { logout } from "@/actions/session";
import Link from "next/link";
export function Sidebar({ permissions }: { permissions: string[] }) {
  const links = [
    { permission: "booking:read", href: "/admin", label: "Lịch đặt vé" },
    {
      permission: "contact:read",
      href: "/admin/ho-so",
      label: "Liên hệ và hồ sơ",
    },
    {
      permission: "outbox:read",
      href: "/admin/email",
      label: "Trạng thái email",
    },
  ];
  return (
    <aside className="border-b lg:border-r bg-gray-50 lg:min-h-screen">
      <Link
        href={
          links.find((l) => permissions.includes(l.permission))?.href ||
          "/admin"
        }
        className="block p-6 font-bold text-lg"
      >
        ZooDoo
      </Link>
      <nav
        aria-label="Quản trị"
        className="flex flex-wrap gap-2 p-4 lg:flex-col"
      >
        {links
          .filter((l) => permissions.includes(l.permission))
          .map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded px-3 py-3 hover:bg-gray-200"
            >
              {l.label}
            </Link>
          ))}
        <form action={logout}>
          <button type="submit" className="px-3 py-3">
            Đăng xuất
          </button>
        </form>
      </nav>
    </aside>
  );
}
