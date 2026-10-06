import { richText, imageUrl } from "@/lib/content";
import { notFound } from "next/navigation";

import { POSTS_PER_PAGE } from "@/constants/contentful";

import MainContainer from "@/components/Containers/MainContainer";
import NewsBody from "@/components/Sections/NewsAndActivities/NewsBody";
import SimilarNews from "@/components/Sections/NewsAndActivities/SimilarNews";
import NewDetailsBanner from "@/components/Sections/NewsAndActivities/NewDetailsBanner";

import BannerImage from "@/../public/assets/backgrounds/news/bg3.png";

import { INewsItem, INewsSkeleton } from "@/types/contentful";
import {
  getBlogPostsByCreatedAtService,
  getBlogPostBySlug,
} from "@/lib/contentful";

export const dynamic = "force-dynamic";

const NewsAndActivitiesPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug);
  // get newest posts
  const newestPosts = await getBlogPostsByCreatedAtService(0, POSTS_PER_PAGE);

  if (!article) {
    return notFound();
  }
  return (
    <div className="flex flex-col">
      <MainContainer background={BannerImage.src}>
        <NewDetailsBanner post={article} />
      </MainContainer>
      <MainContainer className="pt-6 lg:pt-20">
        <NewsBody post={article} newestPosts={newestPosts} />
      </MainContainer>
      <MainContainer>
        <SimilarNews similarNews={newestPosts} />
      </MainContainer>
    </div>
  );
};

export default NewsAndActivitiesPage;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug);
  if (!article)
    return { title: "Không tìm thấy bài viết", robots: { index: false } };
  const { title, description, coverImage } = article.fields;
  return {
    title,
    description: richText(description).slice(0, 160),
    alternates: { canonical: `/tin-tuc-va-hoat-dong/${slug}` },
    openGraph: {
      title,
      description: richText(description).slice(0, 160),
      url: `/tin-tuc-va-hoat-dong/${slug}`,
      type: "article",
      locale: "vi_VN",
      images: [
        imageUrl(
          coverImage && "fields" in coverImage
            ? coverImage.fields?.file?.url
            : undefined,
        ),
      ],
    },
  };
}
