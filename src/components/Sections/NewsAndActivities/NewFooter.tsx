"use client";
import { usePathname } from "next/navigation";
import FacebookButton from "@/components/SocialShare/Facebook";
import BackButton from "@/components/Buttons/BackButton";
export default function NewFooter() {
  const path = usePathname();
  return (
    <div className="flex flex-col pt-10 w-full">
      <div className="flex justify-end gap-4">
        <span>Chia sẻ</span>
        <FacebookButton url={`https://zoodoo.vn${path}`} />
      </div>
      <BackButton color="#000000" />
    </div>
  );
}
