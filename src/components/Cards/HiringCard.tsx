"use client";
import Image from "next/image";

import NewImage from "@/../public/assets/images/news/new1.png";
import clsx from "clsx";
import { FC } from "react";

interface IHiringCardProps {
  job: any;
}

const HiringCard: FC<IHiringCardProps> = ({ job }) => {
  return (
    <a
      className="bg-gray-light border-none rounded-lg shadow hover:opacity-80 w-full"
      href={`/tuyen-dung/${job.slug}`}
    >
      <div className="relative pb-64 lg:pb-80 overflow-hidden rounded-t-lg">
        <Image
          className="absolute inset-0 object-cover w-full h-full"
          src={NewImage.src}
          alt="Article"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5 flex flex-col bg-gray-light rounded-b-lg">
        <div>
          <h5 className="mb-3 text-text-default font-bold text-xl lg:text-3xl text-start">
            Tuyển nhân viên Zookeeper
          </h5>
        </div>
        <div className="flex flex-row gap-x-1">
          <p className="text-lg font-bold text-gray-700  line-clamp-2 text-start">
            Hạn nộp hồ sơ:
          </p>
          <p className="text-lg font-normal text-gray-700  line-clamp-2 text-start">
            30/11/2023
          </p>
        </div>
        <div className="flex flex-wrap text-md lg:text-lg space-x-2">
          <p className="text-lg font-[700] text-gray-700  line-clamp-2 text-start w-24">
            Yêu cầu:
          </p>
          <p className="text-lg font-normal text-gray-700  line-clamp-2 text-start ">
            Phải yêu thương và thích chăm sóc động vật.
          </p>
        </div>
        <div
          className={clsx(
            "inline-flex items-center justify-start py-3 border border-transparent bg-transparent mt-3",
          )}
        >
          <span
            className={clsx("pr-2 uppercase  text-[20px] text-green-default")}
          >
            XEM CHI TIẾT
          </span>
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.2045 13.2046C0.765166 13.6439 0.765166 14.3561 1.2045 14.7955C1.64384 15.2348 2.35616 15.2348 2.79549 14.7955L8.79545 8.7955C9.23105 8.35999 9.2354 7.65522 8.8052 7.21437L2.95128 1.21437C2.51738 0.769645 1.80513 0.76087 1.36041 1.19478C0.915691 1.62867 0.906917 2.34092 1.34081 2.78565L6.41874 7.99027L1.2045 13.2046Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default HiringCard;
