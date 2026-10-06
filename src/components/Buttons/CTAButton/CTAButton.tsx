"use client";
import clsx from "clsx";
import React, { FC } from "react";
import Image from "next/image";

import RightChevron from "../../../../public/assets/icons/chevron-forward-outline.svg";

interface ICTAButtonProps {
  bgColor: "green" | "orange";
  text: string;
  onClick?: () => void;
  className?: string;
  withIcon?: boolean;
  uppercase?: boolean;
}

const CTAButton: FC<ICTAButtonProps> = ({
  bgColor = "green",
  text,
  onClick,
  className,
  withIcon = true,
  uppercase = true,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex rounded-full items-center justify-center px-8 py-3 border border-transparent text-base font-bold hover:scale-105 transition-transform",
        bgColor === "green"
          ? "bg-green-default text-white hover:bg-[#2e6a41]"
          : "bg-amber-default text-amber-dark hover:bg-[#f5bf00]",
        className,
      )}
    >
      <span className={clsx("pr-2", uppercase && "uppercase")}>{text}</span>
      {withIcon && <Image priority src={RightChevron} alt="" />}
    </button>
  );
};

export default CTAButton;
