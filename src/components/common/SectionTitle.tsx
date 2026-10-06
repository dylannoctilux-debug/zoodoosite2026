import clsx from "clsx";
import Image from "next/image";
import { FC } from "react";

interface ISectionTitleProps {
  icon?: string;
  title: string;
  description?: string;
  level?: "h1" | "h2";
  align?: "center" | "left";
}

const SectionTitle: FC<ISectionTitleProps> = ({
  icon,
  title,
  description,
  align = "center",
  level: Heading = "h2",
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col justify-center space-y-4 lg:space-y-6 w-full",
        align === "center" ? "items-center" : "items-start",
      )}
    >
      {icon && (
        <div className="flex items-center">
          <Image src={icon} alt="ZooDoo logo" width={80} height={80} />
        </div>
      )}
      <Heading
        className={clsx(
          "font-bold text-3xl leading-normal md:text-4xl md:leading-normal lg:text-[48px] lg:leading-snug text-green-default uppercase py-2 font-[var(--font-headline)]",
          align === "center" ? "text-center" : " text-start",
        )}
      >
        {title}
      </Heading>
      {description && (
        <div
          className={clsx(
            "text-lg lg:text-xl text-black lg:w-[750px] leading-loose",
            align === "center" ? "text-center mx-8 lg:mx-24" : "text-start",
          )}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default SectionTitle;
