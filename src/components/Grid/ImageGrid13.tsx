import { FC } from "react";
import Image from "next/image";

interface ImageGrid13Props {
  image1: string;
  image2: string;
  image3: string;
  image4: string;
}

const ImageGrid13: FC<ImageGrid13Props> = ({
  image1,
  image2,
  image3,
  image4,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <div className="w-full aspect-square relative">
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
      <div className="w-full aspect-square relative grid grid-rows-2 gap-2">
        <div className="relative h-full">
          <Image
            src={image2}
            alt="ZooDoo animals image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <div className="relative h-full">
            <Image
              src={image3}
              alt="ZooDoo animals image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <div className="relative h-full">
            <Image
              src={image4}
              alt="ZooDoo animals image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGrid13;
