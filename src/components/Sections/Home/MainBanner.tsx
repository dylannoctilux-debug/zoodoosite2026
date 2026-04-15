"use client";
import { motion } from "framer-motion";
import Booking from "@/components/Buttons/CTAButton/Booking";
import BannerImage from "../../../../public/assets/images/banner.jpg";

const MainBanner = () => {
  return (
    <div
      className="bg-cover bg-no-repeat bg-center text-white object-cover h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url(${BannerImage.src})`,
      }}
    >
      {/* Gradient overlay — Forest Green left → transparent */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003b1b]/70 via-[#003b1b]/30 to-transparent" />

      <div className="relative z-10 flex flex-col items-start justify-center w-full max-w-7xl h-1/2 2xl:h-full py-44 2xl:py-0 px-10 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start justify-center w-full max-w-7xl h-1/2 2xl:h-full py-44"
        >
          <div className="flex flex-col">
            {/* Label badge */}
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#ffc703] text-[#6e5400]">
              Vườn thú kiểu Úc
            </span>
            <p className="text-4xl lg:text-6xl 2xl:text-[72px] 2xl:leading-tight font-extrabold w-9/12 xl:w-7/12 leading-tight tracking-tight">
              VƯỜN THÚ THÂN THIỆN CHUẨN ÚC ĐẦU TIÊN
            </p>
            <p className="text-4xl lg:text-6xl 2xl:text-[72px] 2xl:leading-tight font-extrabold leading-tight tracking-tight">
              TẠI VIỆT NAM
            </p>
            <p className="mt-6 text-lg lg:text-xl text-white/80 font-light max-w-lg leading-relaxed">
              Khám phá khu bảo tồn thiên nhiên phong cách Úc độc bản giữa lòng cao nguyên Đà Lạt.
            </p>
            <div className="py-8 flex flex-wrap gap-4">
              <Booking text="ĐẶT VÉ NGAY" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MainBanner;
