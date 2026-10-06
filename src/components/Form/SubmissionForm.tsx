"use client";
import { useId, useRef, useState } from "react";
import { sendMail, sendMailHiring } from "@/lib/sendMail";
export default function SubmissionForm({
  hiring = false,
}: {
  hiring?: boolean;
}) {
  const prefix = useId();
  const [pending, setPending] = useState(false),
    [message, setMessage] = useState(""),
    [failed, setFailed] = useState(false);
  const key = useRef<string | undefined>(undefined),
    previous = useRef("");
  const fields = [
    { name: "name", label: "Họ và tên", type: "text", autoComplete: "name" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    {
      name: "mobile",
      label: "Số điện thoại",
      type: "tel",
      autoComplete: "tel",
    },
    ...(hiring
      ? [
          {
            name: "position",
            label: "Vị trí ứng tuyển",
            type: "text",
            autoComplete: "organization-title",
          },
        ]
      : [
          {
            name: "company",
            label: "Công ty / tên doanh nghiệp",
            type: "text",
            autoComplete: "organization",
          },
          {
            name: "jobTitle",
            label: "Chức vụ",
            type: "text",
            autoComplete: "organization-title",
          },
        ]),
  ];
  return (
    <form
      method="post"
      encType={hiring ? "multipart/form-data" : undefined}
      className="w-full space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (pending) return;
        const form = event.currentTarget,
          values = new FormData(form);
        const data = Object.fromEntries(
          fields.map((f) => [f.name, String(values.get(f.name) || "")]),
        );
        if (!hiring) data.note = String(values.get("note") || "");
        const cv = values.get("cv") as File | null,
          signature =
            JSON.stringify(data) +
            (cv ? `${cv.name}:${cv.size}:${cv.lastModified}` : "");
        if (signature !== previous.current) {
          key.current = crypto.randomUUID();
          previous.current = signature;
        }
        setPending(true);
        setMessage("");
        setFailed(false);
        try {
          if (hiring && (!cv?.size || cv.size > 5 * 1024 * 1024))
            throw new Error(
              "Vui lòng chọn CV PDF hoặc Word (.docx), tối đa 5 MB",
            );
          const result = hiring
            ? await sendMailHiring(
                { ...data, cv: cv! } as {
                  name: string;
                  email: string;
                  mobile: string;
                  position: string;
                  cv: File;
                },
                key.current!,
              )
            : await sendMail(data, key.current!);
          setMessage(
            `Đã tiếp nhận ${hiring ? "hồ sơ" : "thông tin"}. Mã: ${result.id}. ZooDoo sẽ liên hệ lại; email thông báo đang chờ gửi.`,
          );
          form.reset();
          key.current = undefined;
          previous.current = "";
        } catch (e) {
          setFailed(true);
          setMessage((e as Error).message);
        } finally {
          setPending(false);
        }
      }}
    >
      {fields.map((f) => (
        <div key={f.name}>
          <label
            htmlFor={`${prefix}-${f.name}`}
            className="block mb-2 font-medium"
          >
            {f.label} *
          </label>
          <input
            id={`${prefix}-${f.name}`}
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            required
            maxLength={f.type === "email" ? 254 : 200}
            disabled={pending}
            className="w-full min-h-11 rounded-lg border border-gray-300 bg-gray-100 p-3 text-base"
          />
        </div>
      ))}
      {hiring ? (
        <div>
          <label htmlFor={`${prefix}-cv`} className="block mb-2 font-medium">
            CV của bạn *
          </label>
          <input
            id={`${prefix}-cv`}
            name="cv"
            type="file"
            accept=".pdf,.docx"
            required
            disabled={pending}
            aria-describedby={`${prefix}-cv-hint`}
            className="w-full text-base"
          />
          <p id={`${prefix}-cv-hint`} className="text-sm mt-2">
            PDF hoặc Word (.docx), tối đa 5 MB.
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor={`${prefix}-note`} className="block mb-2 font-medium">
            Tin nhắn cho ZooDoo (nếu có)
          </label>
          <textarea
            id={`${prefix}-note`}
            name="note"
            maxLength={3000}
            disabled={pending}
            className="w-full min-h-32 rounded-lg border border-gray-300 bg-gray-100 p-3 text-base"
          />
        </div>
      )}
      {message && (
        <p
          role={failed ? "alert" : "status"}
          className={failed ? "text-destructive" : "text-green-default"}
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-green-default text-white px-5 py-3 font-semibold disabled:opacity-60"
      >
        {pending ? "Đang gửi…" : hiring ? "Ứng tuyển ngay" : "Gửi thông tin"}
      </button>
    </form>
  );
}
