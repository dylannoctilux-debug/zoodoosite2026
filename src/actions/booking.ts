"use server";
import { requireStaff } from "@/server/auth";
import { privateApi, ApiError } from "@/server/private-api";
import type { Booking, TUpdateBookingSchema } from "../../shared/booking";
function bookingDates(b: Booking): Booking {
  return {
    ...b,
    start_time: new Date(b.start_time),
    end_time: new Date(b.end_time),
    createdAt: new Date(b.createdAt),
    updatedAt: new Date(b.updatedAt),
  };
}
async function attempt<T>(
  operation: () => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    return { ok: true, data: await operation() };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, error: error.message };
    throw error;
  }
}
export async function getBookings(range: {
  startRange: string;
  endRange: string;
}) {
  return attempt(async () => {
    const token = await requireStaff("booking:read");
    return (
      await privateApi<Booking[]>(`/bookings?${new URLSearchParams(range)}`, {
        token,
      })
    ).map(bookingDates);
  });
}
export async function getBooking({ id }: { id: string }) {
  return bookingDates(
    await privateApi<Booking>(`/bookings/${encodeURIComponent(id)}`, {
      token: await requireStaff("booking:read"),
    }),
  );
}
export async function updateBooking({
  id,
  data,
}: {
  id: string;
  data: Partial<TUpdateBookingSchema>;
}) {
  return attempt(async () =>
    bookingDates(
      await privateApi<Booking>(`/bookings/${encodeURIComponent(id)}`, {
        method: "PATCH",
        data,
        token: await requireStaff("booking:update"),
      }),
    ),
  );
}
export async function acceptBooking({ id }: { id: string }) {
  return attempt(async () =>
    bookingDates(
      await privateApi<Booking>(`/bookings/${encodeURIComponent(id)}/accept`, {
        method: "POST",
        token: await requireStaff("booking:accept"),
      }),
    ),
  );
}
