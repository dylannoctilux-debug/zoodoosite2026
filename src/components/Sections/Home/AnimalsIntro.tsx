"use client";
import Image from "next/image";

import CTAButton from "@/components/Buttons/CTAButton/CTAButton";
import MainContainer from "@/components/Containers/MainContainer";
import ImageGrid13 from "@/components/Grid/ImageGrid13";

import BG2 from "../../../../public/assets/backgrounds/home/home-bg2.png";

interface IAnimalsIntroProps {
  svg: string;
  title: string;
  description: string;
  picture: string;
}

const AnimalsIntro = () => {
  return (
    <div className="flex flex-col items-center lg:items-start justify-center space-y-6 w-full">
      <div className="flex items-center">
        <Image
          src="/assets/images/section-icons/icon5.png"
          alt="ZooDoo logo"
          width={60}
          height={60}
        />
      </div>
      <h2 className="font-bold  text-3xl lg:text-4xl lg:text-[48px] text-text-default uppercase lg:text-start text-center">
        Các loài động vật tại ZooDoo
      </h2>
      <div className="w-full lg:w-4/5 py-4 text-lg lg:text-xl text-text-default leading-loose lg:text-start text-center">
        Tại ZooDoo Dalat, bạn sẽ có cơ hội khám phá và tương tác với một loạt
        các loài động vật phong phú. Hãy đắm mình trong không gian xanh mát và
        gần gũi với thiên nhiên, và chiêm ngưỡng sự đa dạng của thế giới động
        vật
      </div>
      <ImageGrid13
        image1="/assets/images/animals/alpaca-cut.png"
        image2="/assets/images/animals/racoon-cut.png"
        image3="/assets/images/animals/wallaby-cut.png"
        image4="/assets/images/animals/capybara-cut.png"
      />{" "}
      <div className="w-full flex flex-row items-center justify-center py-6">
        <a
          href="/trai-nghiem-zoodoo"
          className="rounded-full bg-green-default text-white px-12 py-3 font-semibold"
        >
          Xem thêm
        </a>
      </div>
    </div>
  );
};

const AnimalsIntroSection = () => {
  return (
    <MainContainer background={BG2.src}>
      <AnimalsIntro />
    </MainContainer>
  );
};

export default AnimalsIntroSection;
