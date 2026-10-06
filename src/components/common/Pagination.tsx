"use client";
import { useRouter } from "next/navigation";
import Pagination from "rc-pagination";
export default function CustomPagination({
  currentPage,
  totalPosts,
  postsPerPage,
}: {
  currentPage: number;
  totalPosts: number;
  postsPerPage: number;
}) {
  const router = useRouter(),
    totalPages = Math.ceil(totalPosts / postsPerPage);
  if (totalPages < 2) return null;
  const change = (page: number) =>
    router.push(`/tin-tuc-va-hoat-dong?page=${page}`);
  return (
    <nav
      aria-label="Phân trang tin tức"
      className="py-8 flex flex-wrap gap-2 justify-center"
    >
      <button
        type="button"
        aria-label="Trang đầu"
        disabled={currentPage === 1}
        onClick={() => change(1)}
        className="skip-to-start min-h-11 min-w-11"
      />
      <Pagination
        current={currentPage}
        pageSize={postsPerPage}
        total={totalPosts}
        onChange={change}
        showLessItems
        locale={{
          items_per_page: "bài/trang",
          jump_to: "Đến trang",
          jump_to_confirm: "Xác nhận",
          page: "Trang",
          prev_page: "Trang trước",
          next_page: "Trang sau",
          prev_5: "Lùi 5 trang",
          next_5: "Tiến 5 trang",
          prev_3: "Lùi 3 trang",
          next_3: "Tiến 3 trang",
        }}
      />
      <button
        type="button"
        aria-label="Trang cuối"
        disabled={currentPage === totalPages}
        onClick={() => change(totalPages)}
        className="skip-to-end min-h-11 min-w-11"
      />
    </nav>
  );
}
