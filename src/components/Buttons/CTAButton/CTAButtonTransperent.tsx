"use client";
import clsx from "clsx";
import React, { FC } from "react";
import Image from "next/image";

import RightChevron from "../../../../public/assets/icons/chevron-forward-outline.svg";

interface ICTAButtonProps {
  text: string;
  onClick: () => void;
  color?: "orange" | "green";
}

const CTAButtonTransperent: FC<ICTAButtonProps> = ({
  text,
  onClick,
  color,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-start py-3 border border-transparent bg-transparent hover:opacity-70"
      )}
    >
      <span
        className={clsx(
          "pr-2 uppercase text-2xl font-bold",
          color === "green" ? "text-[#003b1b]" : "text-[#6e5400]"
        )}
      >
        {text}
      </span>
      <svg
        width="10"
        height="16"
        viewBox="0 0 10 16"
        fill={color === "green" ? "#003b1b" : "#6e5400"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.2045 13.2046C0.765166 13.6439 0.765166 14.3561 1.2045 14.7955C1.64384 15.2348 2.35616 15.2348 2.79549 14.7955L8.79545 8.7955C9.23105 8.35999 9.2354 7.65522 8.8052 7.21437L2.95128 1.21437C2.51738 0.769645 1.80513 0.76087 1.36041 1.19478C0.915691 1.62867 0.906917 2.34092 1.34081 2.78565L6.41874 7.99027L1.2045 13.2046Z"
          fill={color === "green" ? "#003b1b" : "#6e5400"}
        />
      </svg>
    </button>
  );
};

export default CTAButtonTransperent;
