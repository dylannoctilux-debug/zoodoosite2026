import Image from "next/image";
import type { Asset, EntryFields } from "contentful";
import { richText, imageUrl } from "@/lib/content";
export default function NewCard({
  title,
  description,
  link,
  coverImage,
}: {
  title: string;
  description: EntryFields.RichText;
  link: string;
  coverImage?: Asset | { sys: unknown };
}) {
  return (
    <a
      className="bg-gray-light border-none rounded-lg shadow hover:opacity-80 min-w-0"
      href={link}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        <Image
          className="object-cover"
          src={imageUrl(
            coverImage && "fields" in coverImage
              ? coverImage.fields?.file?.url
              : undefined,
          )}
          alt={title || "Tin tức ZooDoo"}
          fill
          sizes="(max-width: 1023px) 90vw, 33vw"
        />
      </div>
      <div className="p-5 flex flex-col">
        <h3 className="mb-3 text-text-default font-bold text-xl lg:text-3xl">
          {title}
        </h3>
        <p className="text-base lg:text-lg text-gray-700 line-clamp-2">
          {richText(description)}
        </p>
        <span className="py-3 text-green-default font-semibold">
          Xem thêm →
        </span>
      </div>
    </a>
  );
}
