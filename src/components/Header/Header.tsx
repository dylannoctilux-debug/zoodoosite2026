"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import BookingButton from "../Buttons/CTAButton/BookingButton";
import { NavMobile } from "./NavMobile";
import Booking from "../Buttons/CTAButton/Booking";

const Header = () => {
  const [colorChange, setColorchange] = useState<boolean>(false);

  const router = usePathname();
  const isHomeScreen = router === "/";
  const shouldShowTransparent = isHomeScreen && !colorChange;

  useEffect(() => {
    const changeNavbarColor = () => {
      if (window.scrollY > 0) {
        setColorchange(true);
      } else {
        setColorchange(false);
      }
    };
    window.addEventListener("scroll", changeNavbarColor);
    return () => {
      window.removeEventListener("scroll", changeNavbarColor);
    };
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 flex items-center justify-center px-6 py-4 text-white w-full z-50 transition-all duration-300",
        shouldShowTransparent
          ? "bg-transparent"
          : "bg-green-pale/90 backdrop-blur-xl shadow-sm",
      )}
    >
      <div className="lg:flex flex-wrap justify-between items-center max-w-7xl w-full hidden">
        <div className="flex items-center">
          <Link href="/">
            {shouldShowTransparent ? (
              <Image
                src="/assets/images/logos/logo-zoodoo-white.png"
                alt="ZooDoo logo"
                width={100}
                height={100}
              />
            ) : (
              <Image
                src="/assets/images/logos/logo-zoodoo-green.png"
                alt="ZooDoo logo"
                width={100}
                height={100}
              />
            )}
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-8 flex-row justify-between items-center">
            {[
              { href: "/ve-zoodoo", label: "Về chúng tôi" },
              { href: "/ghe-tham-zoodoo", label: "Ghé Thăm ZooDoo" },
              { href: "/trai-nghiem-zoodoo", label: "Trải nghiệm ở ZooDoo" },
              { href: "/tin-tuc-va-hoat-dong", label: "Tin tức hoạt động" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "text-base font-semibold tracking-tight transition-colors duration-300 pb-1",
                    shouldShowTransparent
                      ? "text-white hover:text-amber-300 border-b-2 border-transparent hover:border-amber-300"
                      : "text-green-default hover:text-[#2e6a41] border-b-2 border-transparent hover:border-[#003b1b]",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pl-4">
              <Booking text="ĐẶT VÉ NGAY" />
            </li>
          </ul>
        </nav>
      </div>
      <NavMobile />
    </header>
  );
};

export default Header;
