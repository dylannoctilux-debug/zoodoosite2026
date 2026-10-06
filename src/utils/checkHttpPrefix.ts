import { imageUrl } from "@/lib/content";
export const checkHttpContentfulPrefix = (url: string | undefined) => {
  return imageUrl(url);
};
