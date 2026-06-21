import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Trophy,
  Users,
  TrendingUp,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  Volume2,
  VolumeX
} from "lucide-react";
import Footer from "../components/Footer";

// Assets
import goldConfetti from "../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import excellenceEllipse from "../assets/Talent league/ui ux/excellence_ellipse.png";
import trophyWireframe from "../assets/Talent league/ui ux/trophy.png";
import navyGradient from "../assets/Talent league/ui ux/png.1.png";
import testimonialVideo from "../assets/Talent league/ui ux/video.mp4";
import awardBadge from "../assets/Talent league/ui ux/futuristic-glowing-polygonal-best-award-badge-concept.png";
import internshipLogo from "../assets/Talent league/ui ux/internship_experience_logo.png";
import growthLogo from "../assets/Talent league/ui ux/growth_logo.png";
import excellenceWinners from "../assets/Talent league/ui ux/excellence_winners.png";
import { challengeAudio } from "../utils/audioManager";
import ChallengeModal from "../components/competitions/ChallengeModal";

const VideoModal = ({ isOpen, onClose, videoSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 animate-fade-in">
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <video
          src={videoSrc}
          controls
          autoPlay
          className="w-full h-full object-contain"
        />
      </div>
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      ></div>
    </div>
  );
};

const TestimonialCard = ({ name, role, image, text, rating, onWatch }) => {
  return (
    <div className="w-[360px] h-[502px] bg-[#111111] border border-[#FFC73C]/14 rounded-[18px] p-0 flex flex-col relative overflow-hidden shadow-[0_12px_32px_0_rgba(0,0,0,0.6)] group transition-all duration-300 mx-auto">
      {/* Top Image Section */}
      <div className="relative h-[290px] w-full overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        {/* Gradient Mask to blend with background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col px-6 pb-6 flex-grow -mt-4 z-10">
        {/* Name, Role and Stars */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <h4 className="text-[28px] font-bold text-white leading-none mb-1">{name}</h4>
            <p className="text-[14px] text-white/60 font-medium">{role}</p>
          </div>
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < rating ? "#FFC73C" : "none"}
                stroke={i < rating ? "#FFC73C" : "#666"}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Text */}
        <p className="text-[17px] text-[#FFC73C] font-medium leading-[1.4] text-center px-2 mb-8 italic">
          "{text}"
        </p>

        {/* Watch Now Button */}
        <div className="mt-auto flex justify-center">
          <button
            onClick={onWatch}
            className="flex items-center gap-2 bg-gradient-to-r from-white to-[#FFC732] text-black px-6 py-2 rounded-lg font-bold shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-none hover:bg-[#FFB300] hover:text-white active:bg-[#FFB300] active:text-white active:scale-95 transition-all"
          >
            <Play size={16} className="fill-current" />
            <span className="text-[14px]">Watch now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const JourneyCard = ({ icon, title, description }) => {
  const isImageIcon = typeof icon === 'string';

  return (
    <div className="bg-[#111111] border-[1.16px] border-white/10 rounded-[20px] p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 min-h-[162px] justify-center group">
      <div className="mb-2 w-10 h-10 flex items-center justify-center">
        {isImageIcon ? (
          <img src={icon} alt="" className="w-full h-full object-contain" />
        ) : (
          React.createElement(icon, { size: 40, className: "text-[#FFB300]" })
        )}
      </div>
      <h4 className="text-[20px] font-bold text-white tracking-tight leading-none">{title}</h4>
      <p className="text-[14px] text-gray-400 leading-relaxed font-normal">{description}</p>
    </div>
  );
};

const CompetitionTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = challengeAudio.subscribe(setIsPlaying);
    challengeAudio.play();
    return unsubscribe;
  }, []);

  const toggleMusic = () => {
    challengeAudio.toggle();
  };

  useEffect(() => {
    if (activeVideo) {
      challengeAudio.forcePause();
    } else {
      challengeAudio.forceResume();
    }
  }, [activeVideo]);

  const testimonials = [
    {
      name: "John Doe",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      text: "Trackpi helped me turn my ideas into real-world projects and land opportunities I never imagined.",
      rating: 5
    },
    {
      name: "Jane Smith",
      role: "Product Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
      text: "Trackpi helped me turn my ideas into real-world projects and land opportunities I never imagined.",
      rating: 5
    },
    {
      name: "Arun Mathew",
      role: "Video Editor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      text: "Trackpi helped me turn my ideas into real-world projects and land opportunities I never imagined.",
      rating: 5
    },
    {
      name: "John Doe",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      text: "Trackpi helped me turn my ideas into real-world projects and land opportunities I never imagined.",
      rating: 5
    },
    {
      name: "Jane Smith",
      role: "Product Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
      text: "Trackpi helped me turn my ideas into real-world projects and land opportunities I never imagined.",
      rating: 5
    },
    {
      name: "Arun Mathew",
      role: "Video Editor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      text: "Trackpi helped me turn my ideas into real-world projects and land opportunities I never imagined.",
      rating: 5
    }
  ];

  const journeySteps = [
    { icon: Globe, title: "Application", description: "Thousands applied globally." },
    { icon: Trophy, title: "Challenge", description: "Only top performers cleared the TrackPi challenge." },
    { icon: internshipLogo, title: "Internship Experience", description: "Work on real products with a collaborative team." },
    { icon: growthLogo, title: "Growth", description: "95% recommend TrackPi to future interns." }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-yellow-500/30 selection:text-yellow-500 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-20 text-center overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, #000d1a 0%, #000000 70%)' }}>
        {/* Neon Navy Gradient Background */}
        <img
          src={navyGradient}
          alt=""
          style={{
            position: 'absolute',
            width: '1634px',
            height: '390px',
            top: '0px',
            left: '-120px',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 1,
            objectFit: 'cover',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
          }}
        />

        {/* Back Navigation */}
        <div className="absolute top-10 left-6 md:left-20 z-50">
          <Link
            to="/competition/ui-ux"
            className="flex items-center justify-center w-12 h-12 rounded-full border border-yellow-500/20 bg-black/40 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/40 transition-all group shadow-[0_0_20px_rgba(234,179,8,0.1)]"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Music Toggle */}
        <div className="absolute top-10 right-6 md:right-20 z-50">
          <button
            onClick={toggleMusic}
            className="flex items-center justify-center w-12 h-12 rounded-full border border-yellow-500/20 bg-black/40 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/40 transition-all group shadow-[0_0_20px_rgba(234,179,8,0.1)]"
          >
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-yellow-500/10 blur-[150px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 blur-[120px] -z-10"></div>
        <img
          src={excellenceEllipse}
          alt=""
          className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none -z-10"
        />
        <img
          src={trophyWireframe}
          alt=""
          style={{
            position: 'absolute',
            width: '160px',
            height: '212px',
            top: '-30px',
            left: '180px',
            opacity: 0.6,
            transform: 'rotate(-5deg)',
            pointerEvents: 'none',
            zIndex: 1,
            filter: 'brightness(1.5) contrast(1.1) drop-shadow(0 0 15px rgba(0, 102, 255, 0.5))'
          }}
        />
        <img
          src={trophyWireframe}
          alt=""
          style={{
            position: 'absolute',
            width: '280px',
            height: '368px',
            top: '100px',
            right: '20px',
            opacity: 0.9,
            transform: 'rotate(5deg)',
            pointerEvents: 'none',
            zIndex: 1,
            filter: 'brightness(1.5) contrast(1.1) drop-shadow(0 0 25px rgba(0, 102, 255, 0.6))'
          }}
        />

        <div className="relative z-10 w-full max-w-[841px] mx-auto flex flex-col items-center gap-[19px] transition-all">
          <h1 className="text-4xl md:text-[60px] font-russo tracking-[-1px] text-white leading-[1.13] text-center">
            What <span className="text-[#FFC732] text-shadow-glow">Our Interns</span> Say
          </h1>
          <p className="text-white text-[32px] font-raleway font-normal tracking-[-1px] leading-[1.13] max-w-[841px] text-center">
            Real experiences and reviews from TrackPi Internship alumni.
          </p>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        videoSrc={activeVideo}
      />

      {/* Main Content Background Glow */}
      <div className="absolute top-[800px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-[#FFB300]/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Testimonials Grid */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-20 pb-16">
        {/* Removed badge from here - moving to Journey section */}

        {/* Decorative Trophy near first testimonial card */}
        <div className="absolute -bottom-56 -left-10 lg:-left-20 w-[180px] lg:w-[350px] z-0 pointer-events-none animate-float opacity-70">
          <img
            src={trophyWireframe}
            alt="Trophy"
            className="w-full h-auto drop-shadow-[0_0_60px_rgba(255,179,0,0.5)] rotate-[12deg]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              {...t}
              onWatch={() => setActiveVideo(testimonialVideo)}
            />
          ))}
        </div>
      </section>

      {/* Intern Journey Section */}
      <section className="relative px-6 lg:px-20 pt-16 pb-32 bg-transparent overflow-hidden">
        {/* Confetti Background */}
        <img
          src={goldConfetti}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80 mix-blend-screen"
          style={{ zIndex: 0, filter: 'brightness(1.5)' }}
        />

        {/* Award Badge behind journey cards */}
        <div
          className="absolute z-0 pointer-events-none opacity-90"
          style={{
            width: '280px',
            height: '244px',
            top: '-40px',
            right: '10%',
            transform: 'rotate(-8deg)',
            filter: 'brightness(1.5)'
          }}
        >
          <img
            src={awardBadge}
            alt="Award Badge"
            className="w-full h-full object-contain"
          />
        </div>


        <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-24">
          <h2 className="text-[40px] md:text-[60px] font-russo text-center leading-[1.13] tracking-[-1px]" style={{ filter: 'drop-shadow(0px 4px 4px rgba(255, 255, 255, 0.3))' }}>
            <span className="text-[#FFB300]">Our Intern</span> <span className="text-white">Journey</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {journeySteps.map((step, i) => (
              <JourneyCard key={i} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* Become Our Next Intern Section */}
      <section className="px-6 lg:px-20 pt-16 pb-32 relative overflow-hidden bg-transparent">
        {/* Subtle Scattered Confetti */}
        <img
          src={goldConfetti}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-20 mix-blend-screen"
          style={{ zIndex: 0, filter: 'brightness(1.2)' }}
        />

        {/* Subtle Yellow Ambient Glow */}
        <div
          className="absolute bottom-0 right-0 w-1/2 h-full pointer-events-none opacity-15 -z-10"
          style={{
            background: 'radial-gradient(circle at bottom right, rgba(255, 179, 0, 0.4) 0%, transparent 60%)',
            filter: 'blur(100px)'
          }}
        ></div>


        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 flex flex-col items-start lg:items-start text-left lg:text-left gap-8">
            <h2 className="font-russo text-[#FFB300] leading-[1.13] tracking-[-1px] text-shadow-glow whitespace-nowrap" style={{ fontSize: '60px' }}>
              Become Our Next Intern
            </h2>

            <p className="text-white opacity-90 text-left" style={{
              fontSize: '24px',
              lineHeight: '1.05',
              fontWeight: '400',
              letterSpacing: '0px',
              maxWidth: '713px',
              fontFamily: "'Cabinet Grotesk', sans-serif"
            }}>
              Step into an internship experience designed to accelerate your creative career. Learn from mentors, work on real projects, build a job-ready portfolio, and join a growing community of talented designers and editors just like you. Whether you’re a UI/UX designer, graphic designer, or video editor — your journey starts here.
            </p>

            <button
              onClick={() => setShowChallengeModal(true)}
              className="relative overflow-hidden group transition-all duration-300 active:scale-95"
              style={{
                width: '268px',
                height: '52px',
                backgroundColor: '#1E1901',
                borderRadius: '10px',
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(#1E1901, #1E1901), linear-gradient(to bottom, #FFB300, #996B00)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '17px 35px',
                boxShadow: 'inset 0 0 15px rgba(255, 179, 0, 0.1), 0px 4px 10px rgba(0, 0, 0, 0.5)',
                marginTop: '16px'
              }}
            >
              {/* Noise Texture Overlay Mockup */}
              <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>

              <span
                className="font-bold whitespace-nowrap"
                style={{
                  fontSize: '18px',
                  color: '#FFB300'
                }}
              >
                Join Our Internship Challenge
              </span>
            </button>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 relative flex justify-center lg:justify-end lg:translate-x-12">
            <div className="relative w-full max-w-[550px]">
              <img
                src={excellenceWinners}
                alt="Winners Illustration"
                className="w-full h-auto relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ChallengeModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Raleway:wght@400&display=swap');
        
        .font-russo {
          font-family: 'Russo One', sans-serif;
        }

        .font-raleway {
          font-family: 'Raleway', sans-serif;
        }

        .text-shadow-glow {
          text-shadow: 0px 4px 4px rgba(255, 255, 255, 0.3);
        }

        .animate-fade-in {
            animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CompetitionTestimonials;
