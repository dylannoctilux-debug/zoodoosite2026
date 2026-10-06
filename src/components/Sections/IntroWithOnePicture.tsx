import Image from "next/image";
import { FC } from "react";

import SectionTitle from "../common/SectionTitle";

interface IIntroWithOnePictureProps {
  icon: string;
  title: string;
  description: string;
  picture: string;
}

const IntroWithOnePicture: FC<IIntroWithOnePictureProps> = ({
  icon,
  title,
  description,
  picture,
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <SectionTitle icon={icon} title={title} description={description} />
      <div className="w-full md:max-w-xl lg:max-w-3xl xl:max-w-4xl h-[300px] md:h-[500px] xl:h-[700px] relative">
        <Image
          src={picture}
          alt="ZooDoo logo"
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

export default IntroWithOnePicture;
