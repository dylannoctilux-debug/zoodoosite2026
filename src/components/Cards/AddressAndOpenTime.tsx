import Image from "next/image";
import AddressSvg from "../../../public/assets/icons/address.svg";
import OpenHourseSvg from "../../../public/assets/icons/open-hours.svg";

const data = [
  {
    title: "Địa chỉ",
    content: "Đường 32, Thảo Điền, Quận 2, TP. Hồ Chí Minh",
  },
  {
    title: "Giờ mở cửa",
    content: "9:00 - 17:00",
  },
];

const AddressAndOpenTime = () => {
  return (
    <div className="flex flex-col items-start lg:flex-row lg:items-center justify-center gap-y-2 lg:gap-y-0 lg:divide-x-2 divide-gray-default ">
      <div className="flex flex-row items-center lg:pr-12">
        <Image
          priority
          src={AddressSvg}
          alt="ZooDoo address"
          className="pl-4"
        />
        <div className="ml-4">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-700">
            Địa chỉ
          </h2>
          <p className="text-xl lg:text-2xl text-gray-500">
            Quốc lộ 27C, tiểu khu 94A, Đạ Nhim
          </p>
          <p className="text-xl lg:text-2xl text-gray-500">
            Lạc Dương, Lâm Đồng
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <Image
          priority
          src={OpenHourseSvg}
          alt="ZooDoo address"
          className="pl-4"
        />
        <div className="ml-4">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-700">
            Giờ hoạt động
          </h2>
          <p className="text-xl lg:text-2xl text-gray-500">
            Mở cửa tất cả các ngày trong tuần
          </p>
          <p className="text-xl lg:text-2xl text-gray-500">
            9 giờ sáng - 6 giờ chiều
          </p>
          <p className="text-xl lg:text-2xl text-gray-500">
            Giờ nhận khách cuối: 4 giờ chiều
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressAndOpenTime;
