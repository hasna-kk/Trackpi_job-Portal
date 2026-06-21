
import { motion, useAnimation, useMotionValue, animate, useMotionValueEvent, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

// 🔹 import icons
import apply from "../../assets/howToHire/apply.png";
import connect from "../../assets/howToHire/connect.png";
import hrInterview from "../../assets/howToHire/hrInterview.png";
import salesInterview from "../../assets/howToHire/salesInterview.png";
import walkin from "../../assets/howToHire/walkin.png";
import placed from "../../assets/howToHire/placed.png";

// 📌 Sizes
const circleDesktop = 650;
const circleMobile = 380;

const steps = [
  { image: apply, label: "Apply for job", angle: 160 },
  { image: connect, label: "HR will connect you soon", angle: 90 },
  { image: hrInterview, label: "HR Level interview", angle: 15 },
  { image: salesInterview, label: "Sales Level interview", angle: -50 },
  { image: walkin, label: "Walk in interview", angle: -130 },
];

/**
 * Helper to calculate SVG path for an arc
 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians),
  };
}



export default function HowToGetHired() {
  const [size, setSize] = useState(circleDesktop);

  // 📱 Responsive size
  useEffect(() => {
    const updateSize = () => {
      setSize(window.innerWidth < 768 ? circleMobile : circleDesktop);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const radius = size / 2;
  const strokeWidth = size < 500 ? 14 : 20;
  const normalizedRadius = radius - strokeWidth;

  // Arc Definition
  const startAngle = 90;
  const endAngle = -200;
  const totalSweep = Math.abs(endAngle - startAngle); // 290

  return (
    <AnimationContent
      size={size}
      radius={radius}
      normalizedRadius={normalizedRadius}
      strokeWidth={strokeWidth}
      startAngle={startAngle}
      totalSweep={totalSweep}
      steps={steps}
    />
  );
}



function AnimationContent({ size, radius, normalizedRadius, strokeWidth, startAngle, totalSweep, steps }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(1);

  // Single source of truth for progress (0 to 1)
  const progress = useMotionValue(0);

  // Map progress (0-1) to circle fraction (0-0.8ish)
  const pathLength = useTransform(progress, [0, 1], [0, totalSweep / 360]);

  // Transform progress to Arrow Position and Rotation
  const arrowAngle = useTransform(progress, (p) => startAngle - (totalSweep * p));
  
  const arrowX = useTransform(arrowAngle, (angle) => {
    const rad = (angle * Math.PI) / 180.0;
    return radius + normalizedRadius * Math.cos(rad);
  });
  
  const arrowY = useTransform(arrowAngle, (angle) => {
    const rad = (angle * Math.PI) / 180.0;
    return radius - normalizedRadius * Math.sin(rad);
  });
  
  const arrowRotate = useTransform(arrowAngle, (angle) => 90 - angle);

  useEffect(() => {
    if (!startAnimation) return;

    let isCancelled = false;

    // Animation sequence
    const sequence = async () => {
      while (!isCancelled) {
        // Reset
        setIsCompleted(false);
        progress.set(0);
        setCurrentHighlightIndex(1); // Connect (Start)

        const checkpoints = [
          { target: 75 / 290, index: 2 },  // HR
          { target: 140 / 290, index: 3 }, // Sales
          { target: 220 / 290, index: 4 }, // Walkin
          { target: 1, index: 0 }          // Apply
        ];

        // Wait a bit before starting
        await new Promise(r => setTimeout(r, 200));
        if (isCancelled) return;

        for (const step of checkpoints) {
          if (isCancelled) return;
          // Fast fill
          await animate(progress, step.target, {
            duration: 0.22,
            ease: "easeInOut"
          });

          if (isCancelled) return;

          // Highlight the reached step
          setCurrentHighlightIndex(step.index);

          // Pause
          await new Promise(resolve => setTimeout(resolve, 450));
        }

        if (isCancelled) return;

        // Completion phase
        setIsCompleted(true);

        // Wait before repeating
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
    };

    sequence();

    return () => {
      isCancelled = true;
    };
  }, [progress, startAnimation]);

  return (
    <motion.section
      className="py-8 md:py-12 bg-white flex flex-col items-center overflow-hidden min-h-[420px] md:min-h-[600px] font-cabinet"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onAnimationComplete={() => setStartAnimation(true)}
      onViewportLeave={() => {
        setStartAnimation(false);
        setIsCompleted(false);
        progress.set(0);
        setCurrentHighlightIndex(1);
      }}
    >

      {/* TITLE */}
      <h2 className="text-3xl md:text-5xl font-bold mb-16 md:mb-24 text-center">
        How to <span className="text-[#FFB300]">get Hire</span>
      </h2>

      <div
        className="relative"
        style={{ width: size, height: size }}
      >

        {/* Base Circle */}
        <svg
          width={size}
          height={size}
          className="absolute top-0 left-0 -rotate-90"
        >
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="#E6E6E6"
            strokeWidth={strokeWidth}
          />

          {/* Progress Arc - Driven by MotionValue */}
          {!isCompleted && (
            <motion.circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke="#FFB300"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ pathLength }}
            />
          )}

        </svg>

        {/* 🎯 CENTER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#FFB300] -z-10"
            initial={{ scale: 0 }}
            animate={isCompleted ? { scale: 1 } : { scale: 0 }}
            style={{ width: '100%', height: '100%' }}
          />

          <motion.img
            src={placed}
            alt="Placed"
            className="w-28 md:w-64 drop-shadow"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{
              opacity: isCompleted ? 1 : 0.5,
              scale: isCompleted ? [0.9, 1.1, 1] : 0.9,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.p
            className="mt-2 text-xl md:text-3xl font-bold"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{
              opacity: isCompleted ? 1 : 0.5,
              scale: isCompleted ? [0.9, 1.1, 1] : 0.9,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Placed
          </motion.p>
        </div>

        {/* 🏹 ARROW HEAD HEAD */}
        {!isCompleted && (
          <motion.div
            className="absolute w-8 h-8 flex items-center justify-center z-20 pointer-events-none"
            style={{
              left: arrowX,
              top: arrowY,
              rotate: arrowRotate,
              x: "-50%",
              y: "-50%"
            }}
          >
            {/* Double Chevron SVG */}
            <div className="flex gap-[-4px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="-ml-3">
                <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* 📌 STEPS */}
        {steps.map((step, index) => {
          const rad = (step.angle * Math.PI) / 180;
          const x = normalizedRadius * Math.cos(rad);
          const y = normalizedRadius * Math.sin(rad);

          let isActive = index === currentHighlightIndex;

          return (
            <motion.div
              key={index}
              className="absolute flex flex-col items-center text-center z-30"
              style={{
                left: radius + x,
                top: radius - y,
                translate: "-50% -50%",
                width: size < 500 ? 140 : 280,
              }}
              animate={{
                opacity: isCompleted ? 0.3 : 1,
                scale: isActive && !isCompleted ? 1.1 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={step.image}
                alt={step.label}
                className="w-24 h-24 md:w-48 md:h-48 object-contain object-bottom"
              />
              <p
                className={`mt-2 text-sm md:text-lg font-bold leading-tight ${isActive ? "text-black" : "text-gray-400"
                  }`}
              >
                {step.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
