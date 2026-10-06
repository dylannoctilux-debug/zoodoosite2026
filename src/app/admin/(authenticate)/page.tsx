import { Calendar } from "@/components/calendar";
import { requireStaff, identity } from "@/server/auth";
export default async function AdminHomePage() {
  await requireStaff("booking:read");
  const user = await identity();
  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Lịch đặt vé</h1>
      <Calendar canUpdate={user?.permissions.includes("booking:update")} />
    </div>
  );
}
