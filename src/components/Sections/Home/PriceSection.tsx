"use client";
import Image from "next/image";

import CTAButton from "@/components/Buttons/CTAButton/CTAButton";
import MainContainer from "@/components/Containers/MainContainer";

import BG2 from "../../../../public/assets/backgrounds/home/home-bg2.png";

import AnimalsImage2 from "../../../../public/assets/images/animals/animals2.png";
import BookingButton from "@/components/Buttons/CTAButton/BookingButton";

interface IPriceSectionProps {
  svg: string;
  title: string;
  description: string;
  picture: string;
}

const priceData = [
  {
    height: "CHIỀU CAO TỪ 120CM TRỞ LÊN",
    price: "150 000",
  },
  {
    height: "CHIỀU CAO TỪ 90CM - 120CM",
    price: "75 000",
  },
  {
    height: "CHIỀU CAO DƯỚI 90CM",
    price: "0",
  },
];

const PricesAndNotice = () => {
  const renderPrice = (height: string, price: string) => {
    return (
      <div className="flex flex-row pt-4">
        <div className="w-10 h-6 bg-[#ffc703] rounded-[4px] mr-4 mt-1 lg:mt-2.5" />
        <div className="flex flex-col items-start justify-start space-y-4 w-full">
          <p className="text-[#131e19] font-normal uppercase text-lg lg:text-[30px]">
            {height}
          </p>
          {price === "0" ? (
            <p className="text-[#003b1b] text-xl lg:text-2xl font-bold">
              Miễn phí
            </p>
          ) : (
            <div className="flex flex-row space-x-2">
              <p className="text-[#003b1b] text-xl lg:text-2xl font-bold">
                {price}
              </p>
              <p className="text-[#131e19] text-xl lg:text-2xl">VNĐ/người</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start justify-start space-y-6 w-full">
      <p className="text-text-default font-semibold text-lg">
        Giá vé tính theo chiều cao:
      </p>
      {priceData.map((item, index) => (
        <div key={index}>{renderPrice(item.height, item.price)}</div>
      ))}
      <div className="py-2">
        <BookingButton text="Đặt vé" bgColor="orange" className="px-16" />
      </div>
      <p className="text-[#131e19] font-semibold text-lg">Lưu ý:</p>
      <p className="text-[#404941] font-normal">
        - Giá vé cho một chuyến tham quan 90 - 110 phút.
      </p>
      <p className="text-[#404941] font-normal">
        - Trẻ em phải được đi kèm với cha mẹ hoặc người giám hộ.
      </p>
      <p className="text-[#404941] font-normal">
        - Người lớn chịu trách nhiệm với các con trẻ của mình.
      </p>
    </div>
  );
};

const PriceSection = () => {
  return (
    <MainContainer background={BG2.src}>
      <div className="flex flex-col items-center justify-center max-w-7xl space-y-20 pb-28 pt-10">
        <div className="flex flex-col items-center lg:items-start justify-center space-y-6 w-full">
          <div className="flex items-center">
            <Image
              src="/assets/images/section-icons/icon3.png"
              alt="ZooDoo logo"
              width={60}
              height={60}
            />
          </div>
          <div className="font-bold text-3xl lg:text-4xl lg:text-[48px] text-[#003b1b] uppercase">
            Giá vé tham quan
          </div>
          <div className="w-full lg:w-4/5 text-[#131e19] text-center lg:text-start py-4 font-normal text-lg leading-[27px]">
            Các hoạt động tham quan vườn thú mang đến cho bạn một trải nghiệm
            thú vị và gần gũi với thế giới động vật. Bạn sẽ được tương tác với
            các sinh vật đáng yêu, mà còn có thể biết thêm nhiều kiến thức mới
            về môi trường sống của các loài vật này. Bạn có thể vừa tương tác,
            vừa cho ăn và chụp ảnh với các bạn thú đáng yêu khi đến đây tham
            quan.
          </div>
          <div className="flex flex-col space-y-10 lg:grid lg:grid-cols-2 lg:gap-2 w-full">
            <PricesAndNotice />
            <div className="w-full aspect-square relative">
              <Image
                src={AnimalsImage2.src}
                alt="ZooDoo logo"
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default PriceSection;
