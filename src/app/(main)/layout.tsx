import Script from "next/script";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";

import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import MessengerChat from "../../components/Facebook/MessengerChat";

import ZaloChat from "../../components/Zalo/ZaloChat";
import FooterMobile from "../../components/Footer/FooterMobile";
import GoogleAnalytics from "../../components/Analytic/GoogleAnalytics";
import FacebookAnalytics from "../../components/Analytic/FacebookAnalytics";

import "../globals.css";
import { Toaster } from "../../components/atom/toaster";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-headline",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "ZooDoo - VƯỜN THÚ THÂN THIỆN CHUẨN ÚC ĐẦU TIÊN TẠI VIỆT NAM",
  icons: {
    icon: [
      {
        url: "/assets/images/logo-zoodoo-green.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/assets/images/logo-zoodoo-white.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  description:
    "Chào mừng bạn đến với ZooDoo, điểm đến kỳ diệu của động vật hoang dã độc đáo tại Việt Nam! Hòa mình vào những môi trường đa dạng của các loài kangaroo, koala và những sinh vật biểu tượng khác của Australia. Tại ZooDoo, chúng tôi hòa quyện niềm phấn khởi khám phá với sự hứng thú của việc học, mang đến trải nghiệm khó quên cho du khách. Cam kết của chúng tôi đối với bảo tồn động vật hoang dã nằm tại trái tim mọi hoạt động. Hãy cùng tham gia hành trình vượt qua giới giải trí, tạo nên một liên kết sâu sắc giữa bạn và những động vật hoang dã tuyệt vời của chúng tôi. Khám phá ZooDoo, nơi trái tim hoang dã của Việt Nam đập mạnh hơn bao giờ hết.",
  openGraph: {
    type: "website",
    locale: "vn_VN",
    url: "https://www.zoodoo.vn/",
    title: "ZooDoo - VƯỜN THÚ THÂN THIỆN CHUẨN ÚC ĐẦU TIÊN TẠI VIỆT NAM",
    description:
      "Chào mừng bạn đến với ZooDoo, điểm đến kỳ diệu của động vật hoang dã độc đáo tại Việt Nam! Hòa mình vào những môi trường đa dạng của các loài kangaroo, koala và những sinh vật biểu tượng khác của Australia. Tại ZooDoo, chúng tôi hòa quyện niềm phấn khởi khám phá với sự hứng thú của việc học, mang đến trải nghiệm khó quên cho du khách. Cam kết của chúng tôi đối với bảo tồn động vật hoang dã nằm tại trái tim mọi hoạt động. Hãy cùng tham gia hành trình vượt qua giới giải trí, tạo nên một liên kết sâu sắc giữa bạn và những động vật hoang dã tuyệt vời của chúng tôi. Khám phá ZooDoo, nơi trái tim hoang dã của Việt Nam đập mạnh hơn bao giờ hết.",
    images: [
      {
        url: "/assets/images/logo-zoodoo-white.png",
        width: 1200,
        height: 630,
        alt: "Og Image Alt",
      },
    ],
  },
  twitter: {
    site: "@zoodoo",
  },
  metadataBase: new URL("https://www.zoodoodalat.com/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${plusJakarta.variable} ${beVietnam.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <GoogleAnalytics />
        <FacebookAnalytics />

        <Script src="https://sp.zalo.me/plugins/sdk.js" />
      </head>
      <body
        className={`${beVietnam.className} flex flex-col w-screen bg-[#f0fdf4] justify-between min-h-screen lg:pl-0 overflow-x-hidden relative`}
      >
        <Header />
        <MessengerChat />
        {children}
        <Footer />
        <FooterMobile />
        <ZaloChat />
        <Toaster />
      </body>
    </html>
  );
}
