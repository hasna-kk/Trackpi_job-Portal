import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import trackpiLogo from "../assets/logo.png";
import goldConfetti from "../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import evaluationIllustration from "../assets/Talent league/ui ux/businessman-staying-top-mountain-peak 1.png";
import logoutImg from "../assets/Talent league/ui ux/logout.png";
import { challengeAudio } from "../utils/audioManager";
import { Volume2, VolumeX } from "lucide-react";

const CompetitionCompleted = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Pending");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    document.title = "Evaluation Phase | TrackPi";
    const unsubscribe = challengeAudio.subscribe(setIsPlaying);
    challengeAudio.play();
    return unsubscribe;
  }, []);

  const toggleMusic = () => {
    challengeAudio.toggle();
  };

  useEffect(() => {
    const checkStatus = async () => {
      const enrollmentId = localStorage.getItem("enrollmentId");
      if (!enrollmentId) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/login`, { enrollmentId });
        if (response.data.success) {
          const { status, taskUrl } = response.data.candidate;
          if (status === "Pass") navigate("/competition/result");
          else if (status === "Fail") navigate("/competition/failed");
          else if (!taskUrl) navigate("/competition/intro");
          else setStatus(status);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching status:", err);
        navigate("/");
      }
    };
    checkStatus();
  }, [navigate]);

  const handleResultClick = async (e) => {
    e.preventDefault();
    const enrollmentId = localStorage.getItem("enrollmentId");
    if (!enrollmentId) {
      toast.error("Please log in first!");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/status/${enrollmentId}`
      );
      if (res.data.success) {
        if (res.data.status === "Pass") {
          navigate("/competition/result");
        } else if (res.data.status === "Fail") {
          navigate("/competition/failed");
        } else {
          navigate("/competition/pending");
        }
      }
    } catch (err) {
      toast.error("Could not verify status. Please try again.");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white text-black font-sans flex flex-col">
      {/* Decorative Confetti Top */}
      <img
        src={goldConfetti}
        alt=""
        className="absolute top-0 left-0 w-full h-[500px] object-cover opacity-60 pointer-events-none z-0"
        style={{
          filter: "brightness(1) contrast(1.1) saturate(1.4)",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 w-full px-12 py-6 flex justify-between items-center bg-transparent mt-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={trackpiLogo} alt="TrackPi Logo" className="h-10 cursor-pointer object-contain" />
          </Link>
        </div>

        {/* Right: Nav Links */}
        <div className="flex items-center gap-10">
          <Link
            to="/competition/ui-ux"
            className="text-[#FFB300] font-semibold text-lg hover:text-yellow-400 transition"
          >
            Competition
          </Link>
          <button
            onClick={handleResultClick}
            className="text-black font-semibold text-lg hover:text-gray-700 transition"
          >
            Result
          </button>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-black font-semibold text-lg hover:text-gray-700 transition"
          >
            Logout
          </button>

          <button
            onClick={toggleMusic}
            className="text-black hover:scale-110 transition-transform flex items-center justify-center"
          >
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-0 px-4">
        <div className="w-full max-w-[700px] flex flex-col items-center text-center relative">

          <h1
            style={{ fontFamily: "'Russo One', sans-serif" }}
            className="text-[#FFB300] font-bold text-[42px] mb-2 leading-none"
          >
            Thank you!
          </h1>

          <h2 className="text-black font-bold text-[24px] mb-1 leading-tight">
            Your work is in the evaluation phase
          </h2>

          <p
            style={{ fontFamily: "'Raleway', sans-serif" }}
            className="text-[#000000] text-[20px] mb-4 font-normal"
          >
            You can check your result with your Enrollment code
          </p>

          <div className="w-full max-w-[450px] h-[55px] bg-white border-[1px] border-[#666666] rounded-[12px] flex items-center justify-center mb-10 shadow-sm">
            <span className="font-russo text-[32px] font-bold tracking-widest text-black">
              {localStorage.getItem("enrollmentId") || "------"}
            </span>
          </div>

          <p className="text-[#FFB300] text-[18px] font-medium leading-normal mb-6 max-w-[600px]">
            Our expert panel of designers and judges are carefully<br />
            reviewing each project based on creativity, usability,<br />
            innovation, and overall user experience.
          </p>

          <div className="mb-4">
            <img
              src={evaluationIllustration}
              alt="Evaluation Phase"
              className="w-[220px] h-auto object-contain"
            />
          </div>

          <button
            onClick={() => navigate("/competition/finished")}
            style={{
              background: "linear-gradient(180deg, #FFEAB2 0%, #FFD666 100%)",
            }}
            className="w-[200px] h-[44px] border-[1.5px] border-black rounded-[10px] text-black font-bold text-[16px] hover:brightness-105 transition-all shadow-md flex items-center justify-center mb-10"
          >
            Done
          </button>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[32px] w-full max-w-[500px] p-10 flex flex-col items-center animate-pop-in text-center relative shadow-2xl overflow-hidden border border-gray-100">
            <div className="mb-6 h-[180px] overflow-hidden flex items-start justify-center w-full">
              <img
                src={logoutImg}
                alt="Logout Illustration"
                className="w-[280px] h-[350px] object-contain"
                style={{ objectPosition: 'top' }}
              />
            </div>

            <h2 className="text-black font-bold text-3xl mb-2 font-inter">
              Are you logging out?
            </h2>
            <p className="text-gray-600 text-lg mb-10 font-medium font-inter">
              You can always back at any time.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 h-[58px] rounded-[12px] font-bold text-xl text-black transition-all active:scale-95 shadow-md flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #FFFFFF 0%, #FFB300 100%)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("enrollmentId");
                  navigate("/talent-league");
                }}
                className="flex-1 h-[58px] rounded-[12px] border-2 border-black font-bold text-xl text-black bg-white hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(to top, rgba(255, 179, 0, 0.25) 0%, transparent 100%)",
        }}
      ></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Raleway:wght@400;500;600;700&family=Inter:wght@400;700&display=swap');
        
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CompetitionCompleted;
