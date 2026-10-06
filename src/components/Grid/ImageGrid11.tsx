import { FC } from "react";
import Image from "next/image";

interface ImageGrid11Props {
  image1: string;
  image2: string;
}

const ImageGrid11: FC<ImageGrid11Props> = ({ image1, image2 }) => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full h-32 md:h-40 lg:h-56">
      <div className="w-full relative h-full">
        <Image
          src={image1}
          alt="ZooDoo animal image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <div className="w-full relative ">
        <Image
          src={image2}
          alt="ZooDoo animal image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default ImageGrid11;
