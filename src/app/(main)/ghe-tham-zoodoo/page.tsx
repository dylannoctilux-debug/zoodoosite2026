"use client";
import Image from "next/image";

import MainContainer from "@/components/Containers/MainContainer";
import ZoodooMap from "@/components/Map/ZoodooMap";
import SectionTitle from "@/components/common/SectionTitle";

import BG1 from "@/../public/assets/backgrounds/ghe-tham-zoodoo/bg1.png";
import BG2 from "@/../public/assets/backgrounds/ghe-tham-zoodoo/bg2.png";
import BG3 from "@/../public/assets/backgrounds/ghe-tham-zoodoo/bg3.png";
import BG4 from "@/../public/assets/backgrounds/ghe-tham-zoodoo/bg4.png";
import PriceSection from "@/components/Cards/PriceCards";
import ZooDooRules from "@/components/common/ZooDooRules";

import { ADULT_PRICE, CHILD_PRICE, BABY_PRICE } from "@/constants/price";

interface IBusInfoProps {
  title: string;
  time: string;
  place: string;
}

const BusInfo = ({
  title = "Chuyến đi",
  time = "9h30",
  place = "Từ BigC Đà Lạt , Cổng Hồ Thị Mậu",
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <p className="font-semibold text-xl lg:text-2xl text-[#4B5563]">
        {title}
      </p>
      <p className="font-semibold text-2xl lg:text-4xl">{time}</p>
      <p className="font-semibold text-xl lg:text-2xl text-[#6B7280] text-center">
        {place}
      </p>
    </div>
  );
};

const PricingInfo = () => {
  return (
    <div className="w-full bg-[#F9FAFB] my-8 rounded-2xl">
      <div className="w-full flex flex-col  divide-y lg:divide-y-0  lg:grid lg:grid-cols-3 lg:divide-x lg:m-8">
        <div className="flex flex-col items-center justify-center py-4 lg:py-0  lg:col-span-1 lg:gap-y-4">
          <p className="text-center font-normal text-xl lg:text-2xl">
            Chiều cao từ 120cm trở lên
          </p>
          <div className="text-center flex flex-col lg:flex-row items-center justify-center">
            <p className="font-bold text-xl lg:text-2xl pr-2">{ADULT_PRICE}</p>
            <p className="font-medium text-xl lg:text-2xl ">VND/ 1 Chiều</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-4 lg:py-0  lg:col-span-1 lg:gap-y-4">
          <p className="text-center font-normal text-xl lg:text-2xl">
            Chiều cao từ 90cm - 120cm
          </p>
          <div className="text-center flex flex-col lg:flex-row items-center justify-center">
            <p className="font-bold text-xl lg:text-2xl pr-2">{CHILD_PRICE}</p>
            <p className="font-medium text-xl lg:text-2xl ">VND/ 1 Chiều</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-4 lg:py-0 lg:col-span-1 lg:gap-y-4">
          <p className="text-center font-normal text-xl lg:text-2xl">
            Chiều cao dưới 90cm
          </p>
          <div className="text-center flex flex-row items-center justify-center">
            <p className="font-bold text-xl lg:text-2xl pr-2">{BABY_PRICE}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VisitUs = () => {
  return (
    <div className="flex flex-col pt-24">
      <MainContainer>
        <SectionTitle
          level="h1"
          icon={"/assets/images/section-icons/icon3.png"}
          title={"ĐẾN ZOODOO DALAT"}
        />
        <div className="text-xl lg:text-2xl text-black lg:w-[750px] leading-loose text-center mx-4 lg:mx-24">
          ZooDoo Đà Lạt nằm trên quốc lộ 27C, cách trung tâm Đà Lạt 35km về phía
          Nha Trang.
        </div>
        <div className="flex flex-col justify-center items-center gap-6 max-w-7xl py-8">
          <div className="hidden lg:block rounded-md">
            <ZoodooMap width="800" height="500" borderRadius="10px" />
          </div>
          <div className="block lg:hidden rounded-md">
            <ZoodooMap width="330" height="330" borderRadius="10px" />
          </div>
        </div>
      </MainContainer>

      <MainContainer background={BG1.src}>
        <SectionTitle
          icon={"/assets/images/section-icons/icon9.png"}
          title={"Giờ hoạt động"}
        />
        <div className="flex flex-col justify-center items-center gap-6  lg:px-0 max-w-lg lg:max-w-7xl py-8 pt-0">
          <p className="text-center font-medium text-xl lg:text-2xl -mt-10">
            Mở cửa các ngày trong tuần
          </p>
          <p className="text-center text-3xl lg:text-5xl pb-6">
            9 giờ sáng - 6 giờ chiều
          </p>
          {/* <div className="py-8">
            <a
              href="/assets/pdf/zoo-rules.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download ZooDoo Rules"
            >
              <CTAButton
                bgColor="orange"
                text="Gợi ý kế hoạch tham quan"
                onClick={() => {}}
                uppercase={false}
              />
            </a>
          </div> */}

          <p className="font-bold text:2xl lg:text-4xl text-[#1F2937]">
            Khi tham gia vườn thú, hãy lưu ý các thông tin sau:
          </p>
          <p className="font-bold text-xl lg:text-2xl text-[#4B5563]">
            Hình thức tham quan
          </p>
          <p className="text-center text-base lg:text-xl leading-8 text-[#4B5563]">
            Tham quan vườn thú sẽ được thực hiện bằng cách đi bộ và có sự hướng
            dẫn từ zookeeper. Thời gian trung bình mỗi chuyến tham quan là từ 90
            đến 105 phút. Quý khách theo dõi hướng dẫn của zookeeper và tuân thủ
            nội quy và các quy tắc an toàn được thông báo.
          </p>

          <p className="font-bold text-xl lg:text-2xl text-[#4B5563]">
            Đặt vé trước
          </p>
          <p className="text-center text-base lg:text-xl leading-8 text-[#4B5563]">
            Để đảm bảo chỗ tham quan, quý khách nên đặt vé trước khi đến vườn
            thú. Việc này giúp đảm bảo rằng số lượng khách tham quan trong mỗi
            chuyến được kiểm soát và giới hạn.
          </p>
          <p className="font-bold text-xl lg:text-2xl text-[#4B5563]">
            Không mang thú cưng
          </p>
          <p className="text-center text-base lg:text-xl leading-8 text-[#4B5563]">
            Vì lý do an toàn và y tế, vui lòng không mang thú cưng vào khu vực
            ZooDoo. Điều này nhằm đảm bảo an toàn cho cả động vật trong vườn thú
            và các thú cưng của khách hàng. Nếu bạn có thú cưng, hãy xem xét các
            lựa chọn khác như chăm sóc thú cưng trong thời gian bạn tham quan.
          </p>
        </div>
      </MainContainer>

      <MainContainer background={BG2.src}>
        <SectionTitle
          icon={"/assets/images/section-icons/icon1.png"}
          title={"Hướng dẫn di chuyển"}
        />
        <div className="flex flex-col justify-center items-center px-4 lg:px-0 max-w-lg lg:max-w-7xl">
          <Image
            src="/assets/images/section-icons/icon10.png"
            width={64}
            height={64}
            alt="Di chuyển bằng xe "
          />
          <p className="font-bold text:2xl lg:text-4xl text-[#1F2937] text-center py-8">
            Phương tiện cá nhân
          </p>
          <p className="text-center leading-8 text-[#4B5563] text-xl lg:text-2xl">
            Để đến ZooDoo, từ Đà lạt đi theo quốc lộ 27C tới xã Đạ Nhim, huyện
            Lạc Dương, tỉnh Lâm Đồng.
          </p>
          <p className="text-center leading-8 text-[#4B5563] text-xl lg:text-2xl">
            Tiếp tục đi thẳng trên quốc lộ 27C khoảng 1,5 km, nhìn bên tay phải
            bạn sẽ đến ZooDoo.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center px-4 lg:px-0 max-w-lg lg:max-w-7xl">
          <Image
            src="/assets/images/section-icons/icon11.png"
            width={64}
            height={64}
            alt="Di chuyển bằng bus"
          />
          <div>
            <p className="font-bold text:2xl lg:text-4xl text-[#1F2937] text-center py-8">
              Di chuyển bằng xe bus ZooDoo
            </p>
            <p className="text-center leading-8 text-[#4B5563] text-xl lg:text-2xl">
              ZooDoo cung cấp chuyến shuttle bus hằng ngày, giúp thuận tiện hơn
              để đến ZooDoo tham quan.
            </p>
            <p className="text-center leading-8 text-[#4B5563] py-4 text-xl lg:text-2xl">
              Để đặt chỗ, vui lòng liên hệ số điện thoại:
              <a href="tel:0905333261"> 0905333261</a>
            </p>
          </div>
          <div className="w-full grid grid-cols-3 py-5">
            <div className="col-span-1">
              <BusInfo
                title="Chuyến đi"
                time="9h30"
                place="Từ BigC Đà Lạt , Cổng Hồ Thị Mậu"
              />
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <Image
                src="/assets/icons/line.png"
                width={200}
                height={64}
                alt="Di chuyển bằng bus"
              />
            </div>
            <div className="col-span-1">
              <BusInfo
                title="Chuyến về"
                time="13h00"
                place="Từ ZooDoo Đà Lạt"
              />
            </div>
          </div>
          <PricingInfo />
        </div>
      </MainContainer>

      <MainContainer background={BG3.src}>
        <SectionTitle
          icon={"/assets/images/section-icons/icon3.png"}
          title={"GIÁ VÉ THAM QUAN"}
          align="left"
        />
        <PriceSection />
      </MainContainer>

      <MainContainer background={BG4.src}>
        <SectionTitle
          icon={"/assets/images/section-icons/icon3.png"}
          title={"NỘI QUY VƯỜN THÚ"}
        />

        <div className="text-xl lg:text-2xl text-black md:w-[700px] lg:w-[850px] leading-relaxed text-center mx-12 lg:mx-24">
          Để ZooDoo phục vụ quý khách tốt nhất, cũng như bảo vệ môi trường lành
          mạnh và an toàn cho động vật và quý khách tham quan, ZooDoo có các quy
          định sau:
        </div>

        <div className="flex flex-col items-center justify-center">
          <ZooDooRules />
          <div className="lg:w-[900px] md:px-8 xl:px-0 py-8">
            <p className="text-center font-medium text-xl leading-9 lg:text-2xl text-[#4B5563]">
              ZooDoo là vườn thú thân thiện, nếu quý khách tuân thủ các quy định
              trên thì chúng ta sẽ cùng có một trải nghiệm tuyệt vời. ZooDoo
              chân thành cảm ơn sự hợp tác của quý khách và mong rằng ứng xử văn
              minh sẽ đồng hành cùng với chúng ta và các thế hệ sau.
            </p>
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default VisitUs;
