import { redirect } from "next/navigation";
import { positivePage } from "@/lib/content";

import { INewsSkeleton } from "@/types/contentful";
import { POSTS_PER_PAGE } from "@/constants/contentful";

import { getBlogPostsByCreatedAtService } from "@/lib/contentful";

import NewCard from "@/components/Cards/NewCard";
import CustomPagination from "@/components/common/Pagination";
import MainContainer from "@/components/Containers/MainContainer";
import NewsBanner from "@/components/Sections/NewsAndActivities/NewsBanner";

import BannerImage from "@/../public/assets/backgrounds/news/bg1.png";
import BG2 from "@/../public/assets/backgrounds/news/bg2.png";

interface INewsAndActivitiesPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 10;

const NewsAndActivitiesPage = async ({
  searchParams,
}: INewsAndActivitiesPageProps) => {
  const currentPage = positivePage((await searchParams)?.page);

  const results = await getBlogPostsByCreatedAtService(
    currentPage,
    POSTS_PER_PAGE,
  );

  const newestPost = await getBlogPostsByCreatedAtService(1, 1);

  const totalPosts = results.total;
  const totalPages = Math.ceil((totalPosts || 0) / POSTS_PER_PAGE);

  if (currentPage > Math.max(1, totalPages))
    redirect(`/tin-tuc-va-hoat-dong?page=${Math.max(1, totalPages)}`);
  return (
    <div className="flex flex-col">
      <MainContainer background={BannerImage.src}>
        <NewsBanner post={newestPost.items[0]} />
      </MainContainer>

      <MainContainer background={BG2.src}>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-start w-full pb-8">
            <p className="font-bold text-3xl lg:text-5xl">TIN TỨC MỚI NHẤT</p>
          </div>
          <div className="w-full flex flex-col lg:grid lg:grid-cols-3 gap-8">
            {results.items.map((item, index) => (
              <NewCard
                key={index}
                title={item?.fields?.title}
                description={item?.fields?.description}
                link={`/tin-tuc-va-hoat-dong/${item?.fields?.slug}`}
                coverImage={item?.fields?.coverImage}
              />
            ))}
          </div>
          <CustomPagination
            currentPage={currentPage}
            totalPosts={totalPosts}
            postsPerPage={POSTS_PER_PAGE}
          />
        </div>
      </MainContainer>
    </div>
  );
};

export default NewsAndActivitiesPage;
