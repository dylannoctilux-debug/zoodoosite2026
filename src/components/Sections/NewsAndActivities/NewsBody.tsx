import Image from "next/image";
import { richDocument, imageUrl } from "@/lib/content";
import { FC, ReactNode } from "react";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import { INewsItem, INewsSkeleton } from "@/types/contentful";
import { Block, Inline } from "@contentful/rich-text-types";

import NewestPost from "./NewestPost";
import NewFooter from "./NewFooter";
import { EntryCollection } from "contentful";

interface INewBodyProps {
  post: INewsItem;
  newestPosts: EntryCollection<INewsSkeleton, undefined, string>;
}

export const renderContenfulOptions = {
  renderNode: {
    [BLOCKS.HEADING_1]: (
      node: Block | Inline,
      children: ReactNode,
    ): ReactNode => {
      return <h2 className="text-2xl font-bold text-black">{children}</h2>;
    },
    [BLOCKS.HEADING_2]: (
      node: Block | Inline,
      children: ReactNode,
    ): ReactNode => {
      return <h2 className="text-xl font-bold text-black">{children}</h2>;
    },
    [BLOCKS.HEADING_3]: (
      node: Block | Inline,
      children: ReactNode,
    ): ReactNode => {
      return <h3 className="text-lg font-bold text-black">{children}</h3>;
    },
    [BLOCKS.HEADING_4]: (
      node: Block | Inline,
      children: ReactNode,
    ): ReactNode => {
      return <h4 className="text-md font-bold text-black">{children}</h4>;
    },
    [BLOCKS.HEADING_5]: (
      node: Block | Inline,
      children: ReactNode,
    ): ReactNode => {
      return <h5 className="text-sm font-bold text-black">{children}</h5>;
    },
    [BLOCKS.HEADING_6]: (
      node: Block | Inline,
      children: ReactNode,
    ): ReactNode => {
      return <h6 className="text-xs font-bold text-black">{children}</h6>;
    },
    [BLOCKS.PARAGRAPH]: (
      node: Block | Inline,
      children: ReactNode,
    ): ReactNode => {
      return (
        <p className="text-gray-600 pl-2 text-lg lg:text-xl flex flex-col space-y-1">
          {children}
        </p>
      );
    },
    [BLOCKS.EMBEDDED_ASSET]: (
      node: Block | Inline,
      children: ReactNode,
    ): ReactNode => {
      // render the EMBEDDED_ASSET as you need
      if (!node.data?.target?.fields?.file?.details?.image) return null;
      return (
        <div className="w-full flex justify-center items-center">
          <Image
            src={imageUrl(node.data.target.fields.file.url)}
            height={node.data.target.fields.file.details.image.height}
            width={node.data.target.fields.file.details.image.width}
            alt={
              node.data.target.fields.description ||
              node.data.target.fields.title ||
              "Ảnh bài viết"
            }
            className="rounded-lg"
          />
        </div>
      );
    },
  },
};

const NewsBody: FC<INewBodyProps> = ({
  post: {
    fields: { coverImage, title, content, date, slug },
  },
  newestPosts,
}) => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 ">
      <div className="col-span-3 flex flex-col items-start pr-0 lg:pr-16">
        <div className=" contentful-container">
          {documentToReactComponents(
            richDocument(content),
            renderContenfulOptions,
          )}
        </div>
        <p className="mb-6 text-text-description ">
          Đăng ngày{" "}
          {new Date(date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <NewFooter />
      </div>
      <div className="col-span-1 flex flex-col items-start pt-16 lg:pt-0">
        <NewestPost newestPosts={newestPosts} />
      </div>
    </div>
  );
};

export default NewsBody;
