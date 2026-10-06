import Image from "next/image";

import { getHiringJobs } from "@/lib/contentful";

import MainContainer from "@/components/Containers/MainContainer";
import ZoodooMap from "@/components/Map/ZoodooMap";
import Hiring from "@/components/Sections/AboutUs/Hiring";
import FollowUs from "@/components/common/FollowUs";
import SectionTitle from "@/components/common/SectionTitle";

import BG1 from "../../../../public/assets/backgrounds/ve-zoodoo/bg1.png";
import BG2 from "../../../../public/assets/backgrounds/ve-zoodoo/bg2.png";
import Animal2Image from "../../../../public/assets/images/animals/animals2.png";
import Icon3 from "../../../../public/assets/images/section-icons/icon3.png";
import Icon5 from "../../../../public/assets/images/section-icons/icon5.png";

import EmailIcon from "../../../../public/assets/icons/contact/Envelope.png";
import MapPinIcon from "../../../../public/assets/icons/contact/MapPinLine.png";
import PhoneIcon from "../../../../public/assets/icons/contact/PhoneCall.png";
import CTAButton from "@/components/Buttons/CTAButton/CTAButton";

export const dynamic = "force-dynamic";
export const revalidate = 10;

const AboutUs = async () => {
  const hiringJobs = await getHiringJobs();
  return (
    <div className="flex flex-col pt-24">
      <MainContainer>
        <SectionTitle
          level="h1"
          icon={Icon5.src}
          title={"Tổng Quan về ZooDoo Đà Lạt"}
        />
        <div className="flex flex-col justify-center items-center gap-6 max-w-4xl py-8 lg:px-0">
          <p className="text-center font-medium text-lg lg:text-xl ">
            Thành lập vào năm 2015, ZooDoo Đà Lạt là một công viên động vật nằm
            tại thành phố Đà Lạt, một điểm đến du lịch nổi tiếng ở Việt Nam.
            Được thiết kế theo mô hình thân thiện tiêu chuẩn Úc duy nhất tại
            Việt Nam, công viên mang đến một trải nghiệm thú vị và hấp dẫn cho
            du khách mọi lứa tuổi.
          </p>
          <p className="text-center font-medium text-lg lg:text-xl">
            Với diện tích rộng lớn, ZooDoo Đà Lạt là nơi bảo tồn nhiều loài động
            vật quý hiếm được đưa về từ nước Úc xa xôi như ngựa lùn Pony, chim
            vành khuyên, cừu alpacas, chuột lang nước, và chuột túi (kangaroo)
            và nhiều loài khác. Chúng tôi đã thiết kế các khu vực động vật để mô
            phỏng môi trường sống tự nhiên của chúng, mang đến cho du khách một
            cái nhìn gần gũi về cuộc sống động vật.
          </p>
          <p className="text-center font-medium text-lg lg:text-xl">
            Ngoài việc khám phá các khu vực động vật, ZooDoo Đà Lạt còn có một
            quán cafe nhỏ xinh và khu cắm trại giữa đồi thông bạt ngàn đầy thơ
            mộng. Quán cafe ZooDoo Đà Lạt có tầm “view” nhìn ra thung lũng trong
            sương mờ, là nơi lý tưởng để bạn có thể thưởng thức các món ăn nhẹ
            và thư giãn giữa thiên nhiên trong xanh của Đà Lạt.
          </p>
          <p className="text-center font-medium text-lg lg:text-xl">
            Công viên cũng có các tiện ích và dịch vụ khác như nhà hàng, quầy
            thức ăn nhanh và cửa hàng quà lưu niệm. Du khách có thể thưởng thức
            các món ăn ngon và thức uống trong khi thư giãn sau khi khám phá
            công viên.
          </p>
        </div>
        <div className="w-full h-[300px] md:h-[500px] relative">
          <Image
            src={"/assets/images/zoodoo-intro.png"}
            alt="ZooDoo logo"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      </MainContainer>
      <MainContainer background={BG1.src}>
        <div className="flex flex-col items-center justify-center lg:grid lg:grid-cols-2 w-full gap-16">
          <div className="flex flex-col gap-6">
            <div className="hidden lg:block">
              <SectionTitle
                icon={Icon5.src}
                title={"TẦM NHÌN VÀ NHIỆM VỤ"}
                align="left"
              />
            </div>
            <div className="block lg:hidden">
              <SectionTitle icon={Icon5.src} title={"TẦM NHÌN VÀ NHIỆM VỤ"} />
            </div>

            <p className="text-center lg:text-start font-medium text-lg  lg:px-0">
              Một trải nghiệm đặc biệt tại ZooDoo là bạn có thể tham gia vào
              hoạt động cho các bạn thú ăn. Điều này cho phép bạn tham gia trực
              tiếp vào quá trình chuẩn bị và cung cấp thức ăn cho các loài động
              vật.
            </p>
            <p className="text-center lg:text-start font-medium text-lg  lg:px-0">
              Một trải nghiệm đặc biệt tại ZooDoo là bạn có thể tham gia vào
              hoạt động cho các bạn thú ăn. Điều này cho phép bạn tham gia trực
              tiếp vào quá trình chuẩn bị và cung cấp thức ăn cho các loài động
              vật.Một trải nghiệm đặc biệt tại ZooDoo là bạn có thể tham gia vào
              hoạt động cho các bạn thú ăn. Điều này cho phép bạn tham gia trực
              tiếp vào quá trình chuẩn bị và cung cấp thức ăn cho các loài động
              vật. Một trải nghiệm đặc biệt tại ZooDoo.
            </p>
          </div>

          <div className="">
            <Image
              src={Animal2Image.src}
              alt="ZooDoo logo"
              width={600}
              height={600}
            />
          </div>
        </div>
      </MainContainer>
      <MainContainer>
        <div className="flex flex-col gap-32">
          <div className="flex flex-col lg:grid lg:grid-cols-2 w-full gap-16 justify-center items-center">
            <div className="flex flex-col gap-6">
              <div className="hidden lg:block">
                <SectionTitle
                  icon={Icon3.src}
                  title={"LIÊN HỆ  VỚI CHÚNG TÔI"}
                  align="left"
                />
              </div>
              <div className="block lg:hidden">
                <SectionTitle
                  icon={Icon3.src}
                  title={"LIÊN HỆ  VỚI CHÚNG TÔI"}
                />
              </div>

              <div className="flex flex-col py-6 gap-4 justify-center items-center lg:justify-between lg:items-start">
                <div className="flex flex-col py-6 gap-4">
                  <div className="flex flex-row justify-start items-center">
                    <Image
                      src={PhoneIcon.src}
                      alt="Phone Icon"
                      width={30}
                      height={30}
                    />
                    <span className="ml-2 text-xl lg:text-2xl">
                      0979 11 00 07
                    </span>
                  </div>
                  <a
                    className="flex flex-row justify-start items-center"
                    href={"mailto:hello@zoodoodalat.com"}
                  >
                    <Image
                      src={EmailIcon.src}
                      alt="Mail Icon"
                      width={30}
                      height={30}
                    />
                    <span className="ml-2 text-xl lg:text-2xl">
                      hello@zoodoodalat.com{" "}
                    </span>
                  </a>
                  <div className="flex flex-row justify-start items-center">
                    <Image
                      src={MapPinIcon.src}
                      alt="Map Icon"
                      width={30}
                      height={30}
                    />
                    <span className="ml-2 text-xl lg:text-2xl">
                      Quốc lộ 27C, tiểu khu 94A, Đạ Nhim, Lạc Dương, Lâm Đồng
                    </span>
                  </div>
                </div>
                <FollowUs
                  color="text-text-black"
                  title="Theo dõi chúng tôi tại"
                />
              </div>
            </div>
            <div className="lg:pt-16">
              <div className="hidden lg:block">
                <ZoodooMap />
              </div>
              <div className="block lg:hidden mt-[-20px]">
                <ZoodooMap width="330" height="330" />
              </div>
            </div>
          </div>

          <div className="px-3 lg:px-0">
            <div
              className="w-full h-44 lg:h-64 bg-cover bg-center flex flex-col items-center  justify-center rounded-lg"
              style={{
                backgroundImage: `url(${BG2.src})`,
              }}
            >
              <a
                href="/lien-he-zoodoo"
                target="_self"
                rel="noopener noreferrer"
              >
                <CTAButton
                  text="LIÊN HỆ HỢP TÁC"
                  bgColor="green"
                  withIcon={false}
                />
              </a>
            </div>
          </div>
        </div>
      </MainContainer>

      <div className="-mt-24">
        <Hiring hiringJobs={hiringJobs} />
      </div>
    </div>
  );
};

export default AboutUs;
