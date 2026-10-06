"use client";
import clsx from "clsx";
import React, { FC, Suspense } from "react";

import { motion, Variants, useReducedMotion } from "framer-motion";

interface IAnimalsIntroProps {
  background?: string;
  className?: string;
  children: React.ReactNode;
  animationProps?: any;
}

const cardVariants: Variants = {
  offscreen: {
    y: 100,
    scale: 0.7,
    opacity: 0.7,
  },
  onscreen: {
    y: 50,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 1,
      delay: 1,
    },
    scale: 1,
    opacity: 1,
  },
};

const RevealContainer: FC<IAnimalsIntroProps> = ({
  background,
  children,
  className,
  animationProps,
}: IAnimalsIntroProps) => {
  const reduced = useReducedMotion();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <motion.section
        className={clsx(
          "bg-cover bg-no-repeat h-full flex flex-col justify-start items-center mt-[-30px] px-10 lg:px-0",
          className,
        )}
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <motion.div
          key="section"
          initial={false}
          whileInView={reduced ? undefined : "onscreen"}
          viewport={{ once: true, amount: 0.8 }}
          variants={cardVariants}
          className="flex flex-col items-center justify-center lg:max-w-7xl space-y-20  pb-32 pt-20 max-w-4xl"
        >
          {children}
        </motion.div>
      </motion.section>
    </Suspense>
  );
};

export default RevealContainer;
