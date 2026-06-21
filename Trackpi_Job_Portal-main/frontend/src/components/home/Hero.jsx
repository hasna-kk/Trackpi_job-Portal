import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import meeting from "../../assets/hero/meeting.png";
import lady from "../../assets/hero/lady.png";
import mobile from "../../assets/hero/mobile.png";

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaQuora,
  FaBloggerB,
  FaMediumM,
  FaWhatsapp
} from "react-icons/fa";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-white pt-24 pb-10 lg:pt-32 lg:pb-12 font-cabinet overflow-hidden group"
    >
      {/* ---------------- TORCH EFFECT ---------------- */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 179, 0, 0.1), transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-12">

        {/* ---------------- LEFT CONTENT ---------------- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-6 w-full text-center lg:text-left"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-[80px] font-bold leading-[1.1] text-black tracking-tight"
          >
            Unlock Your Potential With{" "}
            <span className="text-[#FFB300]">New Opportunities</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-gray-700 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 font-['Montserrat']"
          >
            Trackpi is one of the best business consulting firms in Kerala.
            We have a highly experienced team that develops strategies to promote growth and development.
            With our expert consulting services, we help businesses thrive in a competitive environment.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <button
              onClick={() => navigate("/resume-gen")}
              className="bg-[#FFB300] px-8 py-3.5 rounded-xl font-bold text-black text-lg shadow-md hover:bg-[#ffca2c] hover:shadow-lg transform active:scale-95 transition-all duration-200"
            >
              Resume generator
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="border-2 border-black px-8 py-3.5 rounded-xl font-bold text-lg text-black hover:bg-black hover:text-white transform active:scale-95 transition-all duration-200"
            >
              Browse jobs
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="pt-4 flex flex-row items-center justify-center lg:justify-start gap-2 min-w-0 flex-wrap sm:flex-nowrap"
          >
            <p className="italic font-bold text-sm md:text-base tracking-[0.14em] text-black uppercase shrink-0" style={{ fontFamily: '"Playfair Display", serif', lineHeight: '1', textShadow: '0px 2px 2px rgba(0, 0, 0, 0.45)' }}>
              "WE WON'T LET YOU STAY JOBLESS"
            </p>
            <p className="font-medium text-[10px] md:text-xs tracking-wide whitespace-nowrap pt-1 text-gray-800 shrink-0" style={{ fontFamily: "Ponnala, sans-serif" }}>
              — By Trackpi HR Department
            </p>
          </motion.div>
        </motion.div>

        {/* ---------------- RIGHT GRID ---------------- */}
        <div className="flex-1 w-full grid grid-cols-12 gap-4 lg:gap-6">

          {/* COLUMN 1: Meeting + Mobile (Span 7) */}
          <div className="col-span-12 sm:col-span-7 flex flex-col gap-4 lg:gap-6">

            {/* 1. Meeting Photo */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={imageVariants}
              className="h-[200px] sm:h-[240px] rounded-tl-[60px] overflow-hidden shadow-lg border border-gray-100 bg-white group/img"
            >
              <img
                src={meeting}
                alt="Team meeting strategy"
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* 2. Mobile Display */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={imageVariants}
              className="h-[200px] sm:h-[260px] overflow-hidden drop-shadow-xl border border-gray-100 bg-white group/img"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 80px 100%, 0 calc(100% - 80px))" }}
            >
              <img
                src={mobile}
                alt="Mobile app interface"
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>

          {/* COLUMN 2: Lady + Link (Span 5) */}
          <div className="col-span-12 sm:col-span-5 flex flex-col gap-4 lg:gap-6">

            {/* 3. Lady Photo */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={imageVariants}
              className="h-[260px] sm:h-[340px] relative rounded-tr-[60px] shadow-lg border border-gray-100 overflow-hidden bg-gradient-to-b from-[#A4B3BD] to-[#E8E6E6] group/img"
            >
              <img
                src={lady}
                alt="Professional consultant"
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              {/* Tooltip */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md w-[85%] px-4 py-3 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-[11px] font-bold text-gray-800 leading-snug">
                  Let Us Help You Find A Job That Suits You The Best!
                </p>
              </div>
            </motion.div>

            {/* 4. Link Text Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={imageVariants}
              className="h-[130px] sm:h-[160px] rounded-br-[60px] bg-[#F3F5F7] p-5 lg:p-8 flex flex-col justify-center relative overflow-hidden group/card shadow-sm border border-gray-100 transition-all hover:shadow-md hover:bg-gray-100"
            >
              <div className="relative group/link cursor-pointer select-none z-10">
                <p className="text-base lg:text-xl font-bold leading-tight text-gray-900">
                  Apply to <br />
                  <span className="text-[#FFB300]">multiple vacancies</span> <br />
                  at once <span className="text-2xl inline-block group-hover/link:translate-x-2 transition-transform">›</span>
                </p>
              </div>
              {/* Decorative Arc */}
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full border-[20px] border-white opacity-80 pointer-events-none"></div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;