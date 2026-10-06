import Image from "next/image";
import Link from "next/link";

import FollowUs from "@/components/common/FollowUs";
import ZoodooMap from "@/components/Map/ZoodooMap";

const Footer = () => {
  return (
    <footer className="bg-brown-default hidden lg:block">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="grid grid-cols-8 pt-8">
          <div className="col-span-2 m-6">
            <a href={"/"} className="flex items-center">
              <Image
                src="/assets/images/logos/logo-zoodoo-white-big.png"
                alt="ZooDoo logo"
                width={160}
                height={160}
              />
            </a>
          </div>
          <div className="col-span-6 grid grid-cols-4 gap-6 my-6">
            <div className="col-span-2 flex flex-col ">
              <div className="w-full grid grid-cols-2 ">
                <div className="col-span-1">
                  <h2 className="mb-6 text-xl lg:text-[25px] font-bold uppercase text-gold-default tracking-wide">
                    VỀ ZOODOO
                  </h2>
                  <ul className="font-medium">
                    <li className="mb-4">
                      <Link
                        href="/ve-zoodoo"
                        className="text-cream-default text-base lg:text-lg hover:text-gold-default transition-colors"
                      >
                        Về chúng tôi
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        href="/tin-tuc-va-hoat-dong"
                        className="text-cream-default text-base lg:text-lg hover:text-gold-default transition-colors"
                      >
                        Tin tức & hoạt động
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        href="/trai-nghiem-zoodoo"
                        className="text-cream-default text-base lg:text-lg hover:text-gold-default transition-colors"
                      >
                        Trải nghiệm ZooDoo
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        href="/ghe-tham-zoodoo"
                        className="text-cream-default text-base lg:text-lg hover:text-gold-default transition-colors"
                      >
                        Ghé thăm ZooDoo
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-span-1">
                  <h2 className="mb-6 text-xl lg:text-[25px] font-bold uppercase text-gold-default tracking-wide">
                    Liên hệ
                  </h2>
                  <ul className="font-medium">
                    <li className="mb-4">
                      <a
                        className="text-cream-default text-base lg:text-lg hover:text-gold-default transition-colors"
                        href="tel:0979110007"
                      >
                        0979 11 00 07
                      </a>
                    </li>
                    <li className="mb-4">
                      <a
                        href="mailto:hello@zoodoodalat.com"
                        className="text-cream-default text-base lg:text-lg hover:text-gold-default transition-colors"
                      >
                        hello@zoodoodalat.com
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-cream-default text-base lg:text-lg hover:text-gold-default transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://maps.app.goo.gl/eSTLDVf8wjaMukXMA"
                      >
                        Quốc lộ 27C, tiểu khu 94A, Đạ Nhim, Lạc Dương, Lâm
                        Đồng{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <FollowUs />
            </div>

            <div className="col-span-2">
              <ZoodooMap width="460" height="460" />
            </div>
          </div>
        </div>

        <hr className="my-6 border-[#7a5e45] sm:mx-auto lg:my-8" />
        <div className="flex flex-row justify-between ">
          <a
            href="https://e9.digital/"
            className="text-base text-gold-default sm:text-center hover:text-gold-light transition-colors"
          >
            Proudly built by E9
          </a>
          <span className="text-base text-cream-default/70 sm:text-center">
            Copyright ZooDoo - Zoo&Coffee, All Rights Reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
