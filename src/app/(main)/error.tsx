"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-40">
      <h1 className="text-3xl font-bold mb-4">Chưa tải được nội dung</h1>
      <p className="mb-6">
        Kết nối đang gián đoạn. Bạn có thể thử tải lại nội dung sau.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-green-default px-6 py-3 text-white"
      >
        Thử lại
      </button>
    </div>
  );
}
