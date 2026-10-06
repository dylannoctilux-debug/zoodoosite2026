import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { z } from "zod";

dayjs.extend(utc);
dayjs.extend(timezone);
export const ZOO_TIMEZONE = "Asia/Ho_Chi_Minh";
export const BookingStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  CANCELLED: "CANCELLED",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export interface Booking {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  adults: number;
  kids: number;
  status: BookingStatus;
  start_time: Date;
  end_time: Date;
  createdAt: Date;
  updatedAt: Date;
}
export const bookingFields = z
  .object({
    name: z.string().trim().min(1, "Nhập họ tên").max(120),
    email: z.string().trim().toLowerCase().email("Email không hợp lệ").max(254),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d ()-]{6,25}$/, "Số điện thoại không hợp lệ"),
    adults: z.number().int().min(1, "Cần ít nhất một người lớn").max(10000),
    kids: z.number().int().min(0).max(10000),
    note: z.string().trim().max(3000).default(""),
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
  })
  .strict();
export const UpdateBookingSchema = bookingFields.extend({
  status: z.enum(["PENDING", "ACCEPTED", "CANCELLED"]),
});
export type TUpdateBookingSchema = z.infer<typeof UpdateBookingSchema>;
export function zooDate(value: string | Date = new Date()) {
  return dayjs(value).tz(ZOO_TIMEZONE);
}
export function zooInstant(date: string, time: string) {
  return dayjs.tz(`${date} ${time}`, "YYYY-MM-DD HH:mm", ZOO_TIMEZONE).toDate();
}
export function calendarDays(month: string) {
  const first = dayjs(`${month}-01`);
  const start = first.subtract((first.day() + 6) % 7, "day");
  const count =
    Math.ceil(
      (first.endOf("month").startOf("day").diff(start, "day") + 1) / 7,
    ) * 7;
  return Array.from({ length: count }, (_, i) =>
    start.add(i, "day").format("YYYY-MM-DD"),
  );
}
export interface BookingPolicy {
  leadHours: number;
  durationMinutes: number;
  firstHour: number;
  lastHour: number;
}
export function slotTimes(
  date: string,
  policy: BookingPolicy,
  now = new Date(),
) {
  const validDate =
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    dayjs(`${date}T00:00:00`).format("YYYY-MM-DD") === date;
  if (!validDate) throw new Error("Ngày không hợp lệ");
  return Array.from(
    { length: policy.lastHour - policy.firstHour + 1 },
    (_, i) => {
      const hour = policy.firstHour + i;
      const label = `${String(hour).padStart(2, "0")}:00`;
      return {
        start: label,
        start_time: zooInstant(date, label).toISOString(),
      };
    },
  ).filter(
    (slot) =>
      new Date(slot.start_time).getTime() >=
      now.getTime() + policy.leadHours * 3600000,
  );
}
export function validateVisit(
  start: Date,
  end: Date,
  policy: BookingPolicy,
  now = new Date(),
  requireLead = true,
) {
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    end <= start
  )
    throw new Error("Khoảng thời gian không hợp lệ");
  const local = zooDate(start);
  if (
    local.hour() < policy.firstHour ||
    local.hour() > policy.lastHour ||
    local.minute() ||
    local.second() ||
    local.millisecond()
  )
    throw new Error("Chọn đúng suất tham quan");
  if (end.getTime() - start.getTime() !== policy.durationMinutes * 60000)
    throw new Error("Thời lượng suất không hợp lệ");
  if (
    requireLead &&
    start.getTime() < now.getTime() + policy.leadHours * 3600000
  )
    throw new Error(`Vui lòng đặt trước ít nhất ${policy.leadHours} giờ`);
}
