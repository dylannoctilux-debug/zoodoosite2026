import Image from "next/image";
import Link from "next/link";
import type { INewsFields } from "@/types/contentful";
import { richText, imageUrl } from "@/lib/content";
export default function NewsBanner({
  post,
}: {
  post?: { fields: INewsFields };
}) {
  if (!post)
    return (
      <div className="py-32">
        <h1 className="text-3xl font-bold">Tin tức và hoạt động</h1>
        <p className="mt-4">
          Chưa có bài viết được đăng. Vui lòng quay lại sau.
        </p>
      </div>
    );
  const { title, slug, description, coverImage } = post.fields;
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 py-16 pt-44 gap-8">
      <div className="lg:col-span-3">
        <h1 className="text-3xl lg:text-5xl text-text-title font-bold leading-tight">
          {title}
        </h1>
        <p className="text-lg text-text-gray py-4">{richText(description)}</p>
        <Link
          href={`/tin-tuc-va-hoat-dong/${slug}`}
          className="inline-block text-green-default font-semibold py-3"
        >
          Xem thêm
        </Link>
      </div>
      <div className="lg:col-span-2 relative aspect-square">
        <Image
          src={imageUrl(
            coverImage && "fields" in coverImage
              ? coverImage.fields?.file?.url
              : undefined,
          )}
          fill
          sizes="(max-width: 1023px) 90vw, 40vw"
          className="rounded-lg object-cover"
          alt={title}
          priority
        />
      </div>
    </div>
  );
}
