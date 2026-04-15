import Image from "next/image";
import Link from "next/link";

import FollowUs from "@/components/common/FollowUs";

const FooterMobile = () => {
  return (
    <footer className="bg-[#5a3e2b] block lg:hidden">
      <div className="mx-auto w-full max-w-screen-xl py-6 lg:py-8">
        <div className="flex flex-col pt-8">
          <div className=" w-full flex items-center justify-center">
            <a href={"/"} className="flex items-center">
              <Image
                src="/assets/images/logos/logo-zoodoo-white-big.png"
                alt="ZooDoo logo"
                width={160}
                height={160}
              />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-6 m-6">
            <div className="col-span-1 flex flex-col items-center justify-center">
              <h2 className="mb-6 text-xl font-bold uppercase text-[#c8a97a] tracking-wide">
                VỀ ZOODOO
              </h2>
              <ul className="font-medium flex flex-col justify-center items-center">
                <li className="mb-4">
                  <Link href="/ve-zoodoo" className="text-[#f7f3ee] hover:text-[#c8a97a] transition-colors">
                    Về chúng tôi
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/tin-tuc-va-hoat-dong"
                    className="text-[#f7f3ee] hover:text-[#c8a97a] transition-colors"
                  >
                    Tin tức & hoạt động
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/tin-tuc-va-hoat-dong"
                    className="text-[#f7f3ee] hover:text-[#c8a97a] transition-colors"
                  >
                    Trải nghiệm ZooDoo
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/ghe-tham-zoodoo" className="text-[#f7f3ee] hover:text-[#c8a97a] transition-colors">
                    Ghé thăm ZooDoo
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-start">
              <h2 className="mb-6 text-xl font-bold uppercase text-[#c8a97a] tracking-wide">
                Liên hệ
              </h2>
              <ul className="font-medium flex flex-col justify-center items-center">
                <li className="mb-4">
                  <a href="tel:0979110007" className="text-[#f7f3ee] hover:text-[#c8a97a] transition-colors">
                    0979 11 00 07
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="mailto:hello@zoodoodalat.com"
                    className="text-[#f7f3ee] hover:text-[#c8a97a] transition-colors"
                  >
                    hello@zoodoodalat.com
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://maps.app.goo.gl/eSTLDVf8wjaMukXMA"
                  >
                    <p className="text-center text-[#f7f3ee] hover:text-[#c8a97a] transition-colors">
                      Quốc lộ 27C, tiểu khu 94A, Đạ Nhim, Lạc Dương, Lâm Đồng{" "}
                    </p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center">
            <FollowUs />
          </div>
        </div>

        <hr className="my-6 border-[#7a5e45] sm:mx-auto lg:my-8" />
        <div className="flex flex-col items-center justify-center ">
          <span className="text-sm text-[#f7f3ee]/60 text-center ">
            © 2023 ZooDoo . All Rights Reserved.
          </span>
          <a
            href="https://e9.digital/"
            className="text-sm text-[#c8a97a] text-center hover:text-[#e8d5b0] transition-colors"
          >
            Proudly built by E9
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterMobile;
