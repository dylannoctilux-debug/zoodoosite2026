"use client";
import { useState } from "react";
import { retryEmail } from "@/actions/outbox";
export default function RetryEmail({
  id,
  unknown,
}: {
  id: string;
  unknown: boolean;
}) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  return (
    <form
      className="mt-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        setError("");
        try {
          const result = await retryEmail(id, form.get("reconciled") === "on");
          if (!result.ok) setError(result.error);
          else setDone(true);
        } catch {
          setError("Chưa gửi lại được email. Vui lòng thử lại");
        } finally {
          setPending(false);
        }
      }}
    >
      {unknown && (
        <label className="flex gap-3 items-start">
          <input
            type="checkbox"
            name="reconciled"
            required
            disabled={pending || done}
          />
          <span>
            Đã kiểm tra log của dịch vụ email và xác nhận thư này chưa được gửi.
          </span>
        </label>
      )}
      <button
        type="submit"
        disabled={pending || done}
        className="rounded bg-green-default text-white px-5 py-3 mt-3 disabled:opacity-60"
      >
        {done
          ? "Đã đưa vào hàng đợi"
          : pending
            ? "Đang xử lý…"
            : "Gửi lại email"}
      </button>
      {error && (
        <p role="alert" className="text-red-800 mt-2">
          {error}
        </p>
      )}
    </form>
  );
}
