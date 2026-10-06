import Image from "next/image";
export default function FacebookButton({ url }: { url: string }) {
  return (
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chia sẻ bài viết trên Facebook"
    >
      <Image src="/assets/socials/facebook.png" width={40} height={40} alt="" />
    </a>
  );
}
