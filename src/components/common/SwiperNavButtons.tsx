import React from "react";
import { useSwiper } from "swiper/react";

export const SwiperNavButtons = () => {
  const swiper = useSwiper();

  return (
    <div className="swiper-nav-btns w-full flex flex-row justify-center items-center space-x-8">
      <button
        type="button"
        aria-label="Ảnh trước"
        className="custom-swiper-prev"
        onClick={() => swiper.slidePrev()}
      />
      <button
        type="button"
        aria-label="Ảnh sau"
        className="custom-swiper-next"
        onClick={() => swiper.slideNext()}
      />
    </div>
  );
};
