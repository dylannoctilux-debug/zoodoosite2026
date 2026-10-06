import React from "react";
import Image from "next/image";

interface ImageGrid33Props {
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
}

const ImageGrid33: React.FC<ImageGrid33Props> = ({
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <div className="w-full aspect-square relative grid grid-rows-2 gap-2">
        <div className="grid grid-cols-2 gap-2 ">
          <div className="relative h-full">
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
          <div className="relative h-full">
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
        <div className="relative h-full">
          <Image
            src={image3}
            alt="ZooDoo animal image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      </div>
      <div className="w-full aspect-square relative grid grid-rows-2 gap-2">
        <div className="relative h-full">
          <Image
            src={image4}
            alt="ZooDoo animal image"
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
              src={image5}
              alt="ZooDoo animal image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <div className="relative h-full">
            <Image
              src={image6}
              alt="ZooDoo animal image"
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

export default ImageGrid33;
