import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

const Counter = ({ value, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return (
    <motion.span ref={ref}>
      {displayValue}
    </motion.span>
  );
};

const Stats = () => {
  return (
    <section className="w-full bg-white pt-10 pb-0 px-4 flex justify-center font-cabinet">
      {/* Wrapper: clip-path only on md+, simple rounded on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          relative w-full max-w-[1086px]
          bg-[#FFB300]
          text-black
          h-auto
          flex items-center justify-center
          py-8 md:py-0 md:h-[139px]
          px-6 md:px-12
          rounded-[20px] md:rounded-tr-[30px] md:rounded-bl-[30px] md:rounded-tl-none md:rounded-br-none
          shadow-lg
        "
        style={{
          clipPath: window.innerWidth >= 768
            ? "polygon(50px 0, 100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 50px)"
            : "none",
        }}
      >
        {/* CONTENT CONTAINER */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-center">

          {/* ITEM 1: 100+ */}
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-[48px] md:text-[64px] font-normal leading-tight tracking-tight">
              <Counter value={100} />+
            </h3>
            <p className="text-sm md:text-[14px] font-medium text-black">
              Number of Active Vacancies
            </p>
          </div>

          {/* Divider on mobile */}
          <div className="block md:hidden h-[1px] bg-black/10 w-3/4 mx-auto"></div>

          {/* ITEM 2: 41+ (With Live Dot) */}
          <div className="flex flex-col items-center justify-center relative text-center">
            <h3 className="text-[48px] md:text-[64px] font-normal leading-tight tracking-tight">
              <Counter value={41} />+
            </h3>
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E35353] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E35353]"></span>
              </span>
              <p className="text-sm md:text-[14px] font-medium text-black">
                Live Interviews Ongoing
              </p>
            </div>
          </div>

          {/* Divider on mobile */}
          <div className="block md:hidden h-[1px] bg-black/10 w-3/4 mx-auto"></div>

          {/* ITEM 3: 72+ */}
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-[48px] md:text-[64px] font-normal leading-tight tracking-tight">
              <Counter value={72} />+
            </h3>
            <p className="text-sm md:text-[14px] font-medium text-black">
              Placement Count
            </p>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default Stats;