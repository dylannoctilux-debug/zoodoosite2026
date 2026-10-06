"use server";
import { guestToken } from "@/server/auth";
import { privateApi, ApiError } from "@/server/private-api";
import type { TUpdateBookingSchema } from "../../shared/booking";
export async function getSlots(date: string) {
  try {
    const r = await privateApi<{
      slots: { start: string; start_time: string }[];
      durationMinutes: number;
    }>(`/slots?${new URLSearchParams({ date })}`, {
      token: await guestToken(),
    });
    return { ok: true as const, ...r };
  } catch (e) {
    return {
      ok: false as const,
      error:
        e instanceof ApiError
          ? e.message
          : "Chưa tải được suất tham quan. Vui lòng thử lại",
    };
  }
}
export async function createBooking({
  data,
  requestKey,
}: {
  data: Omit<TUpdateBookingSchema, "status">;
  requestKey: string;
}) {
  try {
    const r = await privateApi<{
      id: string;
      code: string;
      status: string;
      delivery: string;
    }>("/bookings", {
      method: "POST",
      data: { data, requestKey },
      token: await guestToken(),
    });
    return { ok: true as const, ...r };
  } catch (e) {
    return {
      ok: false as const,
      error:
        e instanceof ApiError
          ? e.message
          : "Chưa gửi được yêu cầu. Vui lòng thử lại",
    };
  }
}
