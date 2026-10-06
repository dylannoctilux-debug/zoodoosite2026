import { getBooking } from "@/actions/booking";
import { ChevronLeft } from "lucide-react";

import { BookingForm } from "./booking-form";
import Link from "next/link";

export default async function AdminBookingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking({ id });
  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Link href="/admin" className="flex flex-row">
        <ChevronLeft /> Go back
      </Link>

      <div className="space-y-2 mt-4">
        <h2 className="text-2xl font-bold">Booking: {booking.code}</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Edit information for customer booking
        </p>
      </div>

      <BookingForm booking={booking} />
    </div>
  );
}
