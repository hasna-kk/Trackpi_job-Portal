import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import trackpiLogo from "../assets/logo.png";
import goldConfetti from "../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import logoutImg from "../assets/Talent league/ui ux/logout.png";
import { challengeAudio } from "../utils/audioManager";
import { Volume2, VolumeX } from "lucide-react";

const CompetitionResult = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.title = "Competition Results | TrackPi";
    const unsubscribe = challengeAudio.subscribe(setIsPlaying);
    challengeAudio.play();
    return unsubscribe;
  }, []);

  const toggleMusic = () => {
    challengeAudio.toggle();
  };

  useEffect(() => {
    const fetchCandidateData = async () => {
      const enrollmentId = localStorage.getItem("enrollmentId");
      if (!enrollmentId) {
        navigate("/");
        return;
      }

      setLoading(false);
    };
    fetchCandidateData();
  }, [navigate]);

  if (loading) return null;

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
        <div className="flex items-center">
          <Link to="/">
            <img src={trackpiLogo} alt="TrackPi Logo" className="h-10 cursor-pointer object-contain" />
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <Link
            to="/competition/ui-ux"
            className="text-black font-semibold text-lg hover:text-yellow-400 transition"
          >
            Competition
          </Link>
          <Link
            to="/competition/result"
            className="text-[#FFB300] font-semibold text-lg hover:text-yellow-400 transition"
          >
            Result
          </Link>
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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-20 px-4">
        <div className="text-center mb-8">
          <h1
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontWeight: 400,
              fontSize: "64px",
              lineHeight: "100%",
              textAlign: "center",
            }}
            className="text-black mb-4"
          >
            Your <span className="text-[#FFB300]">Results</span>
          </h1>
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 400,
              fontSize: "24px",
              color: "#666666"
            }}
          >
            Summary of your participation & outcome
          </p>
        </div>

        {/* Result Card */}
        <div
          className="bg-white rounded-[20px] p-16 flex flex-col items-center justify-center relative shadow-sm"
          style={{
            width: "870px",
            height: "450px",
            border: "2px solid #FFB300",
          }}
        >
          <h2
            style={{
              fontFamily: "'Lobster', cursive",
              fontSize: "80px",
              fontWeight: 400,
              lineHeight: "1.2",
              width: "535px",
              background: "linear-gradient(to right, #000000 0%, #000000 5%, #FFB300 95%, #FFB300 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "38px",
              textAlign: "center"
            }}
          >
            Congratulations !
          </h2>

          <p
            className="text-center px-4"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "24px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#000000",
              maxWidth: "750px"
            }}
          >
            "You have <span className="text-[#FFB300]">successfully</span> completed this activity. We appreciate your participation and effort!". We're excited to welcome you to the{" "}
            <span className="text-[#FFB300]">TrackPi Internship Program!</span> Our team will contact you with onboarding details soon.
          </p>

          <button
            onClick={() => navigate("/competition/ui-ux")}
            className="w-[200px] h-[52px] bg-[#FFB300] text-white rounded-[10px] font-bold text-[20px] hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center justify-center mt-10"
          >
            Back to home
          </button>
        </div>
      </main>

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(to top, rgba(255, 179, 0, 0.25) 0%, transparent 100%)",
        }}
      ></div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[32px] w-full max-w-[500px] p-10 flex flex-col items-center animate-pop-in text-center relative shadow-2xl overflow-hidden">
            {/* Illustration Placeholder - Using a generic high-quality one if specific not found */}
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
                  localStorage.removeItem("candidateName");
                  localStorage.removeItem("candidateEmail");
                  localStorage.removeItem("idCode");
                  localStorage.removeItem("loginCode");
                  setShowLogoutModal(false);
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Russo+One&family=Raleway:wght@400;500;600;700&family=Inter:wght@400;700&display=swap');
        
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

export default CompetitionResult;
