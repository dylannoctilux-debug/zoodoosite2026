"use client";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/atom/dialog";
export function NavMobile() {
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  const transparent = path === "/" && !scrolled;
  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 lg:hidden ${transparent ? "text-white" : "bg-white text-green-default shadow-sm"}`}
    >
      <Link href="/" aria-label="ZooDoo — Trang chủ">
        <Image
          src={`/assets/images/logos/logo-zoodoo-${transparent ? "white" : "green"}.png`}
          alt="ZooDoo"
          width={100}
          height={70}
        />
      </Link>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Mở menu"
            className="min-h-11 min-w-11 flex items-center justify-center"
          >
            <Menu size={30} />
          </button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="left-0 top-0 translate-x-0 translate-y-0 max-w-none h-dvh rounded-none bg-green-default text-white border-0 pt-24 overflow-y-auto"
        >
          <DialogTitle className="sr-only">Menu điều hướng ZooDoo</DialogTitle>
          <nav
            aria-label="Điều hướng chính"
            className="flex flex-col gap-4 text-xl"
          >
            {[
              ["/ve-zoodoo", "Về chúng tôi"],
              ["/ghe-tham-zoodoo", "Ghé thăm ZooDoo"],
              ["/trai-nghiem-zoodoo", "Trải nghiệm ở ZooDoo"],
              ["/tin-tuc-va-hoat-dong", "Tin tức và hoạt động"],
              ["/lien-he-zoodoo", "Liên hệ"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-6 py-3"
              >
                {label}
              </Link>
            ))}
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}
