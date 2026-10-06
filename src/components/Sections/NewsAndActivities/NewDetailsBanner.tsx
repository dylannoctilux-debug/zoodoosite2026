import { imageUrl } from "@/lib/content";
import Image from "next/image";
import { FC } from "react";

import { INewsFields } from "@/types/contentful";

import BackButton from "@/components/Buttons/BackButton";

import FacebookButton from "@/components/SocialShare/Facebook";

interface INewDetailsBannerProps {
  post: {
    fields: INewsFields;
  };
}

const NewDetailsBanner: FC<INewDetailsBannerProps> = ({ post }) => {
  const { title, slug, description, date } = post.fields;

  return (
    <div className="pt-32 lg:pt-44">
      <div className="flex flex-col lg:grid lg:grid-cols-2">
        <div className="lg:col-span-1  lg:mr-16 flex flex-col justify-between">
          <div>
            <div className="pb-8">
              <BackButton />
            </div>
            <h1 className="text-3xl lg:text-5xl text-white font-bold leading-tight">
              {title}
            </h1>
            <div className="block lg:hidden py-4 text-white text-base text-end font-medium"></div>
          </div>
          <div className="hidden lg:flex lg:flex-col space-y-4">
            <div className="text-white text-base font-medium">
              {new Date(date).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex flex-row space-x-6">
              <div className="flex items-end text-white font-normal text-base">
                Share
              </div>
              <FacebookButton
                url={`https://zoodoo.vn/tin-tuc-va-hoat-dong/${slug}`}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center lg:col-span-1">
          <Image
            src={imageUrl(
              post.fields.coverImage && "fields" in post.fields.coverImage
                ? post.fields.coverImage.fields?.file?.url
                : undefined,
            )}
            layout="responsive"
            width={400}
            height={400}
            className="rounded-lg"
            alt={title}
            priority
          />
        </div>
        <div className="flex flex-col lg:hidden py-8">
          <div className="flex flex-row space-x-6">
            <div className="flex items-end text-white font-normal text-base">
              Share
            </div>
            <Image
              src="/assets/socials/facebook.png"
              width={40}
              height={40}
              alt="facebook"
            />
            <Image
              src="/assets/socials/insta.png"
              width={40}
              height={40}
              alt="instagram"
            />
            <Image
              src="/assets/socials/tiktok.png"
              width={40}
              height={40}
              alt="tiktok"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDetailsBanner;
