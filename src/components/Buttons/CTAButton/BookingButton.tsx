"use client";
import clsx from "clsx";
import React, { FC } from "react";
import Image from "next/image";

import RightChevron from "../../../../public/assets/icons/chevron-forward-outline.svg";

const ZOODOO_PHONE_NUMBER = "0979110007";

interface IBookingButtonProps {
  bgColor: "green" | "orange";
  text: string;
  className?: string;
  withIcon?: boolean;
  uppercase?: boolean;
}

const BookingButton: FC<IBookingButtonProps> = ({
  bgColor = "green",
  text,
  className,
  withIcon = true,
  uppercase = true,
}) => {
  return (
    <a
      className={clsx(
        "inline-flex rounded-full items-center justify-center px-8 py-3 border border-transparent text-base font-bold hover:scale-105 transition-transform",
        bgColor === "green"
          ? "bg-[#003b1b] text-white hover:bg-[#2e6a41]"
          : "bg-[#ffc703] text-[#6e5400] hover:bg-[#f5bf00]",
        className
      )}
      href={`tel:${ZOODOO_PHONE_NUMBER}`}
    >
      <span className={clsx("pr-2", uppercase && "uppercase")}>
        {text}
      </span>
      {withIcon && <Image priority src={RightChevron} alt="next svg" />}
    </a>
  );
};

export default BookingButton;
