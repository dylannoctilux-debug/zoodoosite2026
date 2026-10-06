"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Chưa mở được trang quản trị</h1>
      <p className="my-4">Kiểm tra quyền của tài khoản hoặc thử tải lại.</p>
      <button
        onClick={reset}
        className="bg-green-default text-white rounded px-5 py-3"
      >
        Thử lại
      </button>
    </div>
  );
}
