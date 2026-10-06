import type { MetadataRoute } from "next";
import { allSlugs } from "@/lib/contentful";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new URL(process.env.SITE_URL || "https://zoodoo.vn").origin;
  const [news, jobs] = await Promise.all([
    allSlugs("news"),
    allSlugs("hiring"),
  ]);
  return [
    { url: base },
    ...[
      "ghe-tham-zoodoo",
      "lien-he-zoodoo",
      "tin-tuc-va-hoat-dong",
      "trai-nghiem-zoodoo",
      "ve-zoodoo",
    ].map((path) => ({ url: `${base}/${path}` })),
    ...news.map((p) => ({
      url: `${base}/tin-tuc-va-hoat-dong/${encodeURIComponent(p.slug)}`,
      lastModified: new Date(p.updated),
    })),
    ...jobs.map((p) => ({
      url: `${base}/tuyen-dung/${encodeURIComponent(p.slug)}`,
      lastModified: new Date(p.updated),
    })),
  ];
}
