import { requireStaff, identity } from "@/server/auth";
import { Sidebar } from "@/components/sidebar";
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaff();
  const user = await identity();
  return (
    <div className="grid lg:grid-cols-5">
      <Sidebar permissions={user?.permissions || []} />
      <div className="min-w-0 lg:col-span-4">{children}</div>
    </div>
  );
}
