import React, { FC } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { IHiringJobFields } from "@/types/contentful";

import { getHiringJobs, getHiringJobBySlug } from "@/lib/contentful";

import HiringCard from "@/components/Cards/HiringCard";
import BackButton from "@/components/Buttons/BackButton";
import MainContainer from "@/components/Containers/MainContainer";
import EmployerInfo from "@/components/Sections/Hiring/EmployerInfo";
import HiringBody from "@/components/Sections/Hiring/HiringBody";

interface IHiringDetailsProps {
  job: {
    fields: IHiringJobFields;
  };
}

const HiringDetails: FC<IHiringDetailsProps> = (job) => {
  const {
    jobTitle,
    jobDescription,
    jobRequirement,
    jobSalary,
    employmentStatus,
    jobBenefit,
    expiredDate,
  } = job.job.fields;

  const expiredDateFormatted = new Date(expiredDate).toLocaleDateString(
    "vi-VN",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="flex flex-col py-8">
      <h1 className="font-bold text-2xl lg:text-4xl">{jobTitle}</h1>
      <div className="flex flex-col space-y-4 py-4">
        <div className="flex flex-row space-x-2">
          <Image
            src={"/assets/icons/hiring/MapPinLine.svg"}
            alt="Article"
            layout="fixed"
            width={24}
            height={24}
          />
          <div className="flex flex-wrap text-md lg:text-lg space-x-2">
            <p>Địa điểm: </p>
            <p className="font-bold">
              4H6P+VG6, ĐT723, Xã Đạ Nhim, Lạc Dương, Lâm Đồng
            </p>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <Image
            src={"/assets/icons/hiring/Database.svg"}
            alt="salary"
            layout="fixed"
            width={24}
            height={24}
          />
          <div className="flex flex-wrap text-md lg:text-lg space-x-2">
            <p>Mức lương: </p>
            <p className="font-bold">{jobSalary} </p>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <Image
            src={"/assets/icons/hiring/Clock.svg"}
            alt="Article"
            layout="fixed"
            width={24}
            height={24}
          />
          <div className="flex flex-wrap text-md lg:text-lg space-x-2">
            <p>Hình thức: </p>
            <p className="font-bold">{employmentStatus}</p>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <Image
            src={"/assets/icons/hiring/BookmarkSimple.svg"}
            alt="Article"
            layout="fixed"
            width={24}
            height={424}
          />
          <div className="flex flex-wrap text-md lg:text-lg space-x-2">
            <p>Hạn nộp hồ sơ: </p>
            <p className="font-bold">{expiredDateFormatted}</p>
          </div>
        </div>
      </div>

      <div className="border mb-6" />
      <div className=" flex-col justify-start items-start gap-8 inline-flex">
        <div className=" flex-col justify-start items-start gap-4 flex">
          <div className="  text-2xl font-bold ] leading-9">
            Mô tả công việc
          </div>
          <div className="list text-gray-600 text-lg lg:text-xl font-medium  leading-loose">
            <HiringBody content={jobDescription} />
          </div>
        </div>
        <div className="list flex-col justify-start items-start gap-4 flex">
          <div className=" text-2xl font-bold  leading-9">
            Yêu cầu công việc
          </div>
          <div className="list text-gray-600 text-lg lg:text-xl font-medium  leading-loose">
            <HiringBody content={jobRequirement} />
          </div>
        </div>
        <div className="list flex-col justify-start items-start gap-4 flex text-lg lg:text-xl">
          <div className="font-bold text-2xl leading-9">Quyền lợi</div>
          <div className="list text-gray-600 text-lg lg:text-xl font-medium  leading-loose">
            <HiringBody content={jobBenefit} />
          </div>
        </div>
      </div>
    </div>
  );
};

const HiringDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const hiringJob = await getHiringJobBySlug(slug);
  const hiringJobs = await getHiringJobs();

  if (!hiringJob) {
    return notFound();
  }
  return (
    <div>
      <MainContainer>
        <div className="flex flex-col lg:grid lg:grid-cols-3 pt-20 min-h-screen text-[#111827]">
          <div className="col-span-2 lg:mr-8 flex flex-col">
            <div className="w-full">
              <Image
                className="w-full"
                src={"/assets/images/animals/hiring.png"}
                alt="Article"
                layout="responsive"
                width={1920}
                height={1080}
              />
            </div>
            <HiringDetails job={hiringJob} />

            <div className="py-10">
              <BackButton color="#000" />
            </div>
          </div>
          <div className="col-span-1">
            <EmployerInfo />
          </div>
        </div>
      </MainContainer>

      <MainContainer>
        <div className="flex flex-col -mt-[140px] lg:-mt-[100px] w-full">
          <div className="flex flex-row items-center justify-start py-10">
            <div className="flex items-center">
              <Image
                src={"/assets/images/section-icons/icon6.png"}
                alt="ZooDoo logo"
                width={50}
                height={50}
              />
            </div>
            <p className="font-bold text-4xl text-text-default lg:w-[600px] text-start pl-4">
              Các vị trí khác
            </p>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 py-4 lg:py-16">
            {hiringJobs.items.map((item: any) => {
              return (
                <div key={item.fields.slug}>
                  <HiringCard job={item.fields} />
                </div>
              );
            })}
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default HiringDetailPage;

export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getHiringJobBySlug(slug);
  return job
    ? {
        title: job.fields.jobTitle,
        alternates: { canonical: `/tuyen-dung/${slug}` },
      }
    : { title: "Không tìm thấy vị trí", robots: { index: false } };
}
