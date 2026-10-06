"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./atom/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./atom/dialog";
import { Label } from "./atom/label";
import { Input } from "./atom/input";
import { useToast } from "./atom/use-toast";
import { cn } from "@/lib/utils";
import { createBooking, getSlots } from "@/actions/public-booking";
import { bookingFields, calendarDays, zooDate } from "../../shared/booking";
const schema = bookingFields.omit({ start_time: true, end_time: true });
type Fields = z.input<typeof schema>;
type Slot = { start: string; start_time: string };
type Props = {
  className: string;
  trigger: ReactNode;
  title: string;
  description: string;
  address: string;
};
export const BookingWidget: FC<Props> = ({
  className,
  trigger,
  title,
  address,
  description,
}) => {
  const prefix = useId();
  const [open, setOpen] = useState(false),
    [date, setDate] = useState(() =>
      zooDate().add(1, "day").format("YYYY-MM-DD"),
    );
  const [month, setMonth] = useState(() => date.slice(0, 7)),
    [slots, setSlots] = useState<Slot[]>([]);
  const [duration, setDuration] = useState(90),
    [selected, setSelected] = useState<Slot>();
  const [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [reload, setReload] = useState(0);
  const key = useRef<string | undefined>(undefined),
    signature = useRef("");
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { adults: 1, kids: 0, note: "" },
  });
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    setError("");
    setSelected(undefined);
    setSlots([]);
    getSlots(date)
      .then((r) => {
        if (!r.ok) throw new Error(r.error);
        if (active) {
          setSlots(r.slots);
          setDuration(r.durationMinutes);
        }
      })
      .catch((e) => {
        if (active)
          setError(
            e.message || "Chưa tải được suất tham quan. Vui lòng thử lại",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, date, reload]);
  const submit = handleSubmit(async (fields) => {
    if (!selected) return;
    setError("");
    const data = {
      ...schema.parse(fields),
      start_time: new Date(selected.start_time),
      end_time: new Date(+new Date(selected.start_time) + duration * 60000),
    };
    const current = JSON.stringify(data);
    if (current !== signature.current) {
      key.current = crypto.randomUUID();
      signature.current = current;
    }
    try {
      const result = await createBooking({ data, requestKey: key.current! });
      if (!result.ok) throw new Error(result.error);
      toast({
        title: `Đã tiếp nhận yêu cầu ${result.code}`,
        description: `${zooDate(selected.start_time).format("HH:mm DD/MM/YYYY")} — ZooDoo sẽ liên hệ xác nhận. Email đang chờ gửi.`,
      });
      setOpen(false);
      reset();
      key.current = undefined;
      signature.current = "";
    } catch (e) {
      setError(
        (e as Error).message ||
          "Chưa gửi được yêu cầu. Thông tin vẫn được giữ để thử lại",
      );
    }
  });
  const fields = [
    { name: "name", label: "Họ và tên", type: "text", autoComplete: "name" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "phone", label: "Số điện thoại", type: "tel", autoComplete: "tel" },
    { name: "adults", label: "Người lớn", type: "number", min: 1 },
    { name: "kids", label: "Trẻ em", type: "number", min: 0 },
    { name: "note", label: "Ghi chú (nếu có)", type: "text" },
  ] as const;
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isSubmitting) {
          setOpen(v);
          if (!v) setSelected(undefined);
        }
      }}
    >
      <DialogTrigger asChild className={className}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-3xl max-h-[90dvh] overflow-y-auto overscroll-contain bg-white p-5 sm:p-8">
        <DialogTitle className="text-xl sm:text-2xl">{title}</DialogTitle>
        <DialogDescription className="text-base">
          Đặt trước ít nhất 18 giờ. Thời gian theo giờ Việt Nam; yêu cầu cần
          được ZooDoo xác nhận.
        </DialogDescription>
        <p className="text-sm text-gray-600">{address}</p>
        <details className="text-sm text-gray-600">
          <summary className="cursor-pointer py-2">Lưu ý khi tham quan</summary>
          <p className="whitespace-pre-wrap">{description}</p>
        </details>
        {error && (
          <div role="alert" className="text-destructive">
            <p>{error}</p>
            {!selected && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setReload((n) => n + 1)}
              >
                Thử tải lại
              </Button>
            )}
          </div>
        )}
        {!selected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section aria-label="Chọn ngày tham quan">
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Tháng trước"
                  onClick={() =>
                    setMonth(
                      dayjs(`${month}-01`)
                        .subtract(1, "month")
                        .format("YYYY-MM"),
                    )
                  }
                >
                  <ChevronLeftIcon />
                </Button>
                <h2 className="font-semibold" aria-live="polite">
                  Tháng {dayjs(`${month}-01`).format("MM/YYYY")}
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Tháng sau"
                  onClick={() =>
                    setMonth(
                      dayjs(`${month}-01`).add(1, "month").format("YYYY-MM"),
                    )
                  }
                >
                  <ChevronRightIcon />
                </Button>
              </div>
              <div
                className="grid grid-cols-7 text-center text-sm pt-4"
                aria-hidden="true"
              >
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2 pt-2">
                {calendarDays(month).map((d) => (
                  <button
                    type="button"
                    key={d}
                    aria-label={`Ngày ${dayjs(d).format("DD/MM/YYYY")}`}
                    aria-pressed={date === d}
                    disabled={d < zooDate().format("YYYY-MM-DD")}
                    onClick={() => {
                      setDate(d);
                      setMonth(d.slice(0, 7));
                    }}
                    className={cn(
                      "min-h-11 min-w-0 rounded-md disabled:opacity-35 hover:bg-gray-100",
                      d.slice(0, 7) !== month && "text-gray-500",
                      d === date &&
                        "bg-green-default text-white hover:bg-green-default",
                    )}
                  >
                    {Number(d.slice(-2))}
                  </button>
                ))}
              </div>
            </section>
            <section aria-busy={loading}>
              <h2 className="font-semibold mb-4">
                Suất ngày {dayjs(date).format("DD/MM/YYYY")}
              </h2>
              {loading ? (
                <p role="status">Đang tải suất tham quan…</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {slots.map((s) => (
                    <Button
                      key={s.start_time}
                      type="button"
                      variant="outline"
                      onClick={() => setSelected(s)}
                    >
                      {s.start}
                    </Button>
                  ))}
                </div>
              )}
              {!loading && !error && !slots.length && (
                <p>
                  Hiện không có suất phù hợp cho ngày này. Vui lòng chọn ngày
                  khác.
                </p>
              )}
            </section>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <h2 className="font-semibold">
              {zooDate(selected.start_time).format("HH:mm — DD/MM/YYYY")} (giờ
              Việt Nam)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f) => {
                const name = f.name;
                const fieldId = `${prefix}-${name}`;
                return (
                  <div
                    key={name}
                    className={name === "note" ? "sm:col-span-2" : ""}
                  >
                    <Label htmlFor={fieldId}>{f.label}</Label>
                    <Input
                      id={fieldId}
                      type={f.type}
                      autoComplete={
                        "autoComplete" in f ? f.autoComplete : undefined
                      }
                      min={"min" in f ? f.min : undefined}
                      step={f.type === "number" ? 1 : undefined}
                      required={name !== "note"}
                      disabled={isSubmitting}
                      aria-invalid={!!errors[name]}
                      aria-describedby={
                        errors[name] ? `${fieldId}-error` : undefined
                      }
                      {...register(name, {
                        valueAsNumber: f.type === "number",
                      })}
                    />
                    {errors[name] && (
                      <p
                        id={`${fieldId}-error`}
                        className="text-destructive text-sm mt-1"
                      >
                        {errors[name]?.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => setSelected(undefined)}
              >
                Đổi ngày/giờ
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi…" : "Gửi yêu cầu đặt vé"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
