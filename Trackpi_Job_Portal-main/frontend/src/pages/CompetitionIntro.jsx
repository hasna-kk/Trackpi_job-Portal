import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import trackpiLogo from "../assets/logo.png";
import goldConfetti from "../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import { challengeAudio } from "../utils/audioManager";
import { Volume2, VolumeX, ChevronLeft } from "lucide-react";

const CompetitionIntro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });
  const [timerPhase, setTimerPhase] = useState("wait"); // 'wait' or 'active'
  const [compDates, setCompDates] = useState({ start: "", end: "" });

  useEffect(() => {
    const unsubscribe = challengeAudio.subscribe(setIsPlaying);
    challengeAudio.play();
    return unsubscribe;
  }, []);

  const toggleMusic = () => {
    challengeAudio.toggle();
  };

  // Individual 48-Hour Timer (Starts from Registration)
  useEffect(() => {
    const fetchCandidateTimer = async () => {
      try {
        const enrollmentId = localStorage.getItem("enrollmentId");
        if (!enrollmentId) return;

        const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/login`, { enrollmentId });

        if (res.data.success && res.data.candidate) {
          const candidateDept = res.data.candidate.department;
          const compRes = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/all-public`);

          if (compRes.data.success) {
            const comps = compRes.data.competitions;
            const candidateCompId = res.data.candidate.competitionId;

            let myComp;
            if (candidateCompId) {
              myComp = comps.find(c => c._id === candidateCompId);
            }

            if (!myComp) {
              myComp = comps
                .filter(c => c.department.toLowerCase().includes(candidateDept.toLowerCase()))
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .find(c => new Date(c.endDate) > new Date());
            }

            if (!myComp) {
              // Fallback: Pick any upcoming/live competition
              myComp = comps
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .find(c => new Date(c.endDate) > new Date());
            }

            if (myComp) {
              // Interpret start date as Local Midnight to avoid UTC offset issues
              const start = new Date(myComp.startDate.split('T')[0] + 'T00:00:00');
              const end = new Date(myComp.endDate.split('T')[0] + 'T23:59:59');

              const formatOptions = { month: 'long', day: 'numeric' };
              setCompDates({
                start: start.toLocaleDateString(undefined, formatOptions),
                end: end.toLocaleDateString(undefined, { ...formatOptions, year: 'numeric' })
              });

              if (new Date() >= start) {
                setTimerPhase("active");
                setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
                return;
              }

              setTimerPhase("wait");
              const targetDate = start;

              const interval = setInterval(() => {
                const now = new Date();
                const diff = targetDate.getTime() - now.getTime();

                if (diff <= 0) {
                  clearInterval(interval);
                  setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
                  setTimerPhase("active");
                  return;
                }

                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                setTimeLeft({
                  days: d.toString().padStart(2, "0"),
                  hours: h.toString().padStart(2, "0"),
                  minutes: m.toString().padStart(2, "0"),
                  seconds: s.toString().padStart(2, "0")
                });
              }, 1000);

              return () => clearInterval(interval);
            }
          }
        }
      } catch (err) {
        console.error("Error setting individual timer:", err);
      }
    };

    fetchCandidateTimer();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
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
          else if (taskUrl) navigate("/competition/pending");
          else setLoading(false);
        } else {
          navigate("/");
        }
      } catch (err) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white text-black font-sans flex flex-col">
      {/* Background Confetti */}
      <img
        src={goldConfetti}
        alt=""
        className="absolute top-0 left-0 w-full h-[600px] object-cover opacity-60 pointer-events-none z-0"
        style={{
          filter: "brightness(2) contrast(1.1) saturate(1.4)",
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
          <Link to="/competition/ui-ux" className="text-[#FFB300] font-russo text-[18px]">
            Competition
          </Link>
          <Link to="/competition/pending" className="text-black font-russo text-[18px] hover:text-[#FFB300] transition">
            Result
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-black font-russo text-[18px] hover:text-[#FFB300] transition"
          >
            Logout
          </button>
          <button onClick={toggleMusic} className="text-black hover:scale-110 transition-transform">
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-10 px-4">
        <h1 className="font-russo text-[#FFB300] text-[56px] mb-2 text-center">
          Start Your Talent League
        </h1>

        {compDates.start && (
          <p className="font-russo text-black/60 text-[20px] mb-10 text-center">
            {compDates.start} — {compDates.end}
          </p>
        )}

        <div className="flex flex-col items-center gap-6 mb-12">
          <span className="font-russo text-[#FFB300] text-[24px] uppercase tracking-widest">
            {timerPhase === "active" ? "Competition Live:" : "Starts in:"}
          </span>
          <div className="flex gap-8">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINUTES', val: timeLeft.minutes },
              { label: 'SECONDS', val: timeLeft.seconds }
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <div className="w-[110px] h-[110px] bg-[#FFB300] rounded-[15px] shadow-[0_12px_24px_rgba(255,179,0,0.3)] flex items-center justify-center border-t border-white/20">
                  <span className="font-russo text-black text-[48px]">{item.val}</span>
                </div>
                <span className="text-black text-[13px] font-bold tracking-[0.2em]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#FFB300] text-center mb-16 max-w-[800px] text-[22px] font-medium leading-relaxed" style={{ fontFamily: "'Raleway', sans-serif" }}>
          Please joining in on time. Join with your enrollment I D. Join our Internship Talent Competition and prove your skills in design, editing, or development
        </p>

        <button
          onClick={() => navigate("/talent-league")}
          className="w-[190px] h-[48px] border-[1.5px] border-[#1A1A1A] bg-white rounded-[10px] text-[#1A1A1A] font-bold text-[20px] hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center"
        >
          Done
        </button>
      </main>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#FFB300]/10 to-transparent pointer-events-none z-0"></div>

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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Raleway:wght@400;500;600;700&family=Inter:wght@400;700&display=swap');
        .font-russo { font-family: 'Russo One', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
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

export default CompetitionIntro;
