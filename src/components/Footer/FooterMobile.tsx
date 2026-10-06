import Image from "next/image";
import Link from "next/link";

import FollowUs from "@/components/common/FollowUs";

const FooterMobile = () => {
  return (
    <footer className="bg-brown-default block lg:hidden">
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
          <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-6 m-6">
            <div className="col-span-1 min-w-0 flex flex-col items-center justify-center">
              <h2 className="mb-6 text-xl font-bold uppercase text-gold-default tracking-wide">
                VỀ ZOODOO
              </h2>
              <ul className="font-medium min-w-0 max-w-full break-words text-center flex flex-col justify-center items-center">
                <li className="mb-4">
                  <Link
                    href="/ve-zoodoo"
                    className="text-cream-default hover:text-gold-default transition-colors"
                  >
                    Về chúng tôi
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/tin-tuc-va-hoat-dong"
                    className="text-cream-default hover:text-gold-default transition-colors"
                  >
                    Tin tức & hoạt động
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/trai-nghiem-zoodoo"
                    className="text-cream-default hover:text-gold-default transition-colors"
                  >
                    Trải nghiệm ZooDoo
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/ghe-tham-zoodoo"
                    className="text-cream-default hover:text-gold-default transition-colors"
                  >
                    Ghé thăm ZooDoo
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-1 min-w-0 flex flex-col items-center justify-start">
              <h2 className="mb-6 text-xl font-bold uppercase text-gold-default tracking-wide">
                Liên hệ
              </h2>
              <ul className="font-medium min-w-0 max-w-full break-words text-center flex flex-col justify-center items-center">
                <li className="mb-4">
                  <a
                    href="tel:0979110007"
                    className="text-cream-default hover:text-gold-default transition-colors"
                  >
                    0979 11 00 07
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="mailto:hello@zoodoodalat.com"
                    className="text-cream-default hover:text-gold-default transition-colors"
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
                    <p className="text-center text-cream-default hover:text-gold-default transition-colors">
                      Quốc lộ 27C, tiểu khu 94A, Đạ Nhim, Lạc Dương, Lâm
                      Đồng{" "}
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
          <span className="text-sm text-gold-default text-center ">
            © 2023 ZooDoo . All Rights Reserved.
          </span>
          <a
            href="https://e9.digital/"
            className="text-sm text-gold-default text-center hover:text-gold-light transition-colors"
          >
            Proudly built by E9
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterMobile;
