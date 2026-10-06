import "server-only";
import { readFileSync } from "node:fs";
import { createClient } from "contentful";
import { cache } from "react";
import {
  IHiringJobSkeleton,
  INewsSkeleton,
  INewsItem,
} from "@/types/contentful";
import { richDocument, validSlug } from "./content";
function client() {
  const read = (name: string) =>
    process.env[`${name}_FILE`]
      ? readFileSync(process.env[`${name}_FILE`]!, "utf8").trim()
      : process.env[name];
  const space = read("CONTENTFUL_SPACE_ID"),
    accessToken = read("CONTENTFUL_ACCESS_TOKEN");
  if (!space || !accessToken)
    throw new Error("Thiếu cấu hình Contentful phía server");
  return createClient({ space, accessToken, timeout: 10000, retryLimit: 1 });
}
function news(item: INewsItem): INewsItem {
  if (
    !validSlug(item.fields.slug) ||
    typeof item.fields.title !== "string" ||
    !item.fields.title.trim()
  )
    throw new Error("Bài viết CMS thiếu tiêu đề hoặc slug hợp lệ");
  return {
    ...item,
    fields: {
      ...item.fields,
      date: Number.isFinite(Date.parse(item.fields.date))
        ? item.fields.date
        : item.sys.createdAt,
      content: richDocument(item.fields.content),
      description: richDocument(item.fields.description),
    },
  };
}
export async function getBlogPostsByCreatedAtService(
  page: number,
  limit: number,
) {
  const result = await client().getEntries<INewsSkeleton>({
    content_type: "news",
    order: ["-sys.createdAt"],
    skip: (Math.max(1, page) - 1) * limit,
    limit,
  });
  return { ...result, items: result.items.map(news) };
}
export async function getHiringJobs() {
  return client().getEntries<IHiringJobSkeleton>({
    content_type: "hiring",
    order: ["-sys.createdAt"],
    limit: 100,
  });
}
export const getHiringJobBySlug = cache(async (slug: string) => {
  if (!validSlug(slug)) return undefined;
  const r = await client().getEntries<IHiringJobSkeleton>({
    content_type: "hiring",
    "fields.slug": slug,
    limit: 1,
  });
  return r.items[0];
});
export const getBlogPostBySlug = cache(async (slug: string) => {
  if (!validSlug(slug)) return undefined;
  const r = await client().getEntries<INewsSkeleton>({
    content_type: "news",
    "fields.slug": slug,
    limit: 1,
  });
  return r.items[0] ? news(r.items[0]) : undefined;
});
export async function allSlugs(content_type: "news" | "hiring") {
  const items: { slug: string; updated: string }[] = [];
  let skip = 0;
  while (true) {
    const r = await client().getEntries({
      content_type,
      select: ["fields.slug", "sys.updatedAt"],
      limit: 100,
      skip,
    });
    for (const item of r.items) {
      if (validSlug(item.fields.slug))
        items.push({ slug: item.fields.slug, updated: item.sys.updatedAt });
    }
    skip += r.items.length;
    if (!r.items.length || skip >= r.total) break;
  }
  return items;
}
