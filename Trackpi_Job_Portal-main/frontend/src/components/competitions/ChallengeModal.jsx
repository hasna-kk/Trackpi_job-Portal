import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronDown, CheckCircle2, Loader2, Copy, Upload, Volume2, VolumeX, FileText } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import trophyWireframe from "../../assets/competitions/trophy-wireframe-new.png";
import winnerOnPeak from "../../assets/competitions/businessman-mature-black.png";
import womanClimbing from "../../assets/competitions/woman-climbing-black.png";
import successAchievement from "../../assets/Talent league/ui ux/flat  style   illustration.png";
import businessmanStayingTop from "../../assets/Talent league/ui ux/businessman-staying-top-mountain-peak 1.png";
import goldConfetti from "../../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import taskPDF from "../../assets/Talent league/ui ux/Assessment.pdf";
import trackpiLogo from "../../assets/logo.png";
import logoutImg from "../../assets/Talent league/ui ux/logout.png";
import { challengeAudio } from "../../utils/audioManager";

/**
 * ChallengeModal component that displays upcoming and future competitions.
 * Based on the visual design provided with 1024x701px dimensions.
 */
const ChallengeModal = ({ isOpen, onClose, initialView = "cards", department = "" }) => {
  const navigate = useNavigate();
  const [view, setView] = useState(initialView); // 'cards', 'register', 'success', 'login', 'talentLeagueIntro', 'task', 'result'
  const [loginCode, setLoginCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [idCode, setIdCode] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isRegistrationLogin, setIsRegistrationLogin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    const unsubscribe = challengeAudio.subscribe(setIsPlaying);
    return unsubscribe;
  }, []);

  const toggleMusic = () => {
    challengeAudio.toggle();
  };
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    department: "",
    agreed: false
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    location: ""
  });

  const handleLogin = async (codeToUse) => {
    const cleanedCode = (codeToUse || loginCode).trim().toUpperCase();
    if (!cleanedCode) {
      setLoginError("Please enter your Enrollment Code");
      return;
    }

    setLoading(true);
    setLoginError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/login`,
        { enrollmentId: cleanedCode }
      );
      if (response.data.success) {
        localStorage.setItem("enrollmentId", cleanedCode);
        toast.success("Login Successful!");

        setLoginCode(""); // Clear input for next user
        onClose();


        const { status } = response.data.candidate;

        if (status === "Pass") {
          onClose();
          navigate("/competition/result");
        } else if (status === "Fail") {
          onClose();
          navigate("/competition/failed");
        } else if (isRegistrationLogin) {
          setIsRegistrationLogin(false);
          onClose();
          navigate("/competition/intro");
        } else {
          onClose();
          navigate("/competition/task");
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid Enrollment Code. Please check and try again.";
      setLoginError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timerPhase, setTimerPhase] = useState("wait"); // "wait" or "active"
  const [compDates, setCompDates] = useState({ start: "", end: "" });
  const [loginError, setLoginError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [liveCompetition, setLiveCompetition] = useState(null);
  const [futureCompetition, setFutureCompetition] = useState(null);
  const [registeringComp, setRegisteringComp] = useState(null); // Track competition for success timer

  // Fetch Competitions for Cards View
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/all-public`);
        if (response.data.success) {
          const allComps = response.data.competitions;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();

          // 1. Sort all competitions by start date
          const sortedComps = allComps.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

          // 2. Filter for competitions that haven't ended yet
          const activeComps = sortedComps.filter(c => new Date(c.endDate) >= today);

          // 3. Categorize matching the Admin logic
          // Live (Upcoming): Starts in current month and hasn't ended
          const livePool = activeComps.filter(c => {
            const start = new Date(c.startDate);
            return start.getMonth() === currentMonth && start.getFullYear() === currentYear;
          });

          // Future: Starts after current month
          const futurePool = activeComps.filter(c => {
            const start = new Date(c.startDate);
            return (start.getFullYear() > currentYear) || (start.getFullYear() === currentYear && start.getMonth() > currentMonth);
          });

          // Helper to find by department or fallback
          const findBest = (pool) => {
            if (pool.length === 0) return null;
            let found = pool.find(c => c.department.toLowerCase().includes(department.toLowerCase()));
            if (!found) found = pool[0]; // Take the earliest one in the pool
            return found;
          };

          setLiveCompetition(findBest(livePool));
          setFutureCompetition(findBest(futurePool));
        }
      } catch (error) {
        console.error("Error fetching competitions for cards:", error);
      }
    };
    fetchCompetitions();
  }, []);

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formatCompDate = (dateString) => {
    if (!dateString) return { month: "---", day: "--", suffix: "", year: "----" };
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();
    return {
      month: months[date.getMonth()],
      day: day,
      suffix: getOrdinalSuffix(day),
      year: date.getFullYear()
    };
  };

  // Dual-Phase Timer (Wait for Start -> Compete until End)
  useEffect(() => {
    if (view !== "task" && view !== "talentLeagueIntro" && view !== "success") return;

    const fetchCandidateTimer = async () => {
      try {
        const enrollmentId = localStorage.getItem("enrollmentId");
        let start;
        let end;

        if (enrollmentId) {
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

              if (!myComp && view === "success" && registeringComp) {
                myComp = registeringComp;
              }

              if (myComp) {
                start = new Date(myComp.startDate.split('T')[0] + 'T00:00:00');
                end = new Date(myComp.endDate.split('T')[0] + 'T00:00:00');

                const formatOptions = { month: 'long', day: 'numeric' };
                setCompDates({
                  start: start.toLocaleDateString(undefined, formatOptions),
                  end: end.toLocaleDateString(undefined, { ...formatOptions, year: 'numeric' })
                });
              } else if (view === "success" && registeringComp) {
                start = new Date(registeringComp.startDate.split('T')[0] + 'T00:00:00');
                end = new Date(registeringComp.endDate.split('T')[0] + 'T00:00:00');

                const formatOptions = { month: 'long', day: 'numeric' };
                setCompDates({
                  start: start.toLocaleDateString(undefined, formatOptions),
                  end: end.toLocaleDateString(undefined, { ...formatOptions, year: 'numeric' })
                });
              }
            }
          }
        }

        if (!start || !end) return;

        const now = new Date();
        const initialPhase = now < start ? "wait" : "active";
        setTimerPhase(initialPhase);
        const targetDate = initialPhase === "wait" ? start : end;

        if (now > end) {
          // Time is up
          setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
          setIsTimeUp(true);
          return;
        }

        const interval = setInterval(() => {
          const currentTime = new Date();
          const currentPhase = currentTime < start ? "wait" : "active";
          const currentTarget = currentPhase === "wait" ? start : end;

          setTimerPhase(currentPhase);

          const diff = currentTarget.getTime() - currentTime.getTime();

          if (diff <= 0) {
            clearInterval(interval);
            if (currentPhase === "wait") {
              fetchCandidateTimer(); // Refresh to start active phase
            } else {
              setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
              setIsTimeUp(true);
            }
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
      } catch (err) {
        console.error("Error setting individual modal timer:", err);
      }
    };

    fetchCandidateTimer();
  }, [view]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File "${file.name}" selected!`);
    }
  };


  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = value;
    let errorMsg = "";

    // Validation: Letters only for Full Name and Location
    if (name === 'fullName' || name === 'location') {
      if (/[0-9]/.test(value)) {
        errorMsg = "Only letters allowed. Numbers are not permitted.";
      }
      processedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    // Validation: Numbers only for Phone Number
    if (name === 'phone') {
      if (/[^0-9]/.test(value)) {
        errorMsg = "Only numbers allowed. Letters are not permitted.";
      }
      processedValue = value.replace(/[^0-9]/g, '');
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };

  const resetAndClose = () => {
    setView("cards");
    setIsRegistrationLogin(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      department: "",
      agreed: false
    });
    setLoading(false);
    setIdCode("");
    setIsPlaying(false);
    onClose();
  };

  const copyToClipboard = () => {
    if (idCode) {
      navigator.clipboard.writeText(idCode);
      toast.success("Code copied to clipboard!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.location) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!formData.agreed) {
      toast.error("Please agree to the terms");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/register`, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        department: formData.department,
        role: formData.department, // Sync role with selected department for consistency
        competitionId: registeringComp?._id
      });

      if (response.data.success) {
        const newIdCode = response.data.candidate.enrollmentId;
        setIdCode(newIdCode);
        localStorage.setItem("enrollmentId", newIdCode); // Persist ID for subsequent pages
        sessionStorage.setItem("isFirstTime", "true"); // Flag for initial flow
        setView("success");
        toast.success("Registration Successful!");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in font-sans">
      {/* Modal Container - Balanced Size with Internal Scrolling */}
      <div
        className={`relative transition-all duration-500 ease-in-out shadow-[0_30px_60px_rgba(0,0,0,0.3)] w-full max-w-[1024px] rounded-[30px] ${view === "task" ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"}`}
        style={{
          backgroundColor: (view === "task" || view === "result") ? '#FFFFFF' : '#000000',
          backgroundImage: (view === "task" || view === "result")
            ? 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 179, 0, 0.1) 100%)'
            : 'linear-gradient(#000000, #000000), linear-gradient(to bottom, #FFFFFF, #FFB300)',
          border: (view === "task" || view === "result") ? 'none' : '1px solid transparent',

          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          height: '701px'
        }}
      >

        {/* Global Back Button (Top Level) */}
        {(view === "login" || !["cards", "talentLeagueIntro", "task", "result", "register", "success"].includes(view)) && (
          <button
            onClick={() => {
              if (view === "login") {
                resetAndClose();
                navigate("/talent-league");
              } else {
                setView("cards");
              }
            }}
            className="absolute top-6 left-8 text-white hover:text-[#FFB300] transition-colors z-[200] flex items-center gap-2"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Close Button */}
        {!["login", "register", "success", "talentLeagueIntro"].includes(view) && (
          <button
            onClick={resetAndClose}
            className={`absolute top-6 right-8 transition-colors z-[200] ${(view === "task" || view === "result") ? "text-black hover:text-[#FFB300]" : "text-white hover:text-[#FFB300]"
              }`}

          >
            <X size={32} />
          </button>
        )}

        {view === "cards" ? (
          <>
            {/* Title Section */}
            <div className="text-center mb-10 pt-16 flex flex-col items-center">
              <h2
                className="font-russo text-center"
                style={{
                  fontSize: '40px',
                  lineHeight: '113%',
                  letterSpacing: '-1px',
                  filter: 'drop-shadow(0px 4px 4px rgba(255, 255, 255, 0.3))'
                }}
              >
                <span className="text-[#FFB300] block">UI UX Designers</span>
                <span className="text-white block whitespace-nowrap">Competitions & Task</span>
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-[760px]">

                {/* Upcoming Competitions Card */}
                <div
                  className="rounded-[36px] p-10 flex flex-col items-center text-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
                  style={{
                    background: 'linear-gradient(#1A1A1A, #1A1A1A) padding-box, linear-gradient(to top, #FFC732, transparent 80%) border-box',
                    border: '1.5px solid transparent'
                  }}
                >
                  <h4 className="text-white font-russo text-[32px] md:text-[38px] leading-[1.1] tracking-tight">
                    Upcoming<br />Competitions
                  </h4>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2" style={{ fontFamily: 'Sitka, serif' }}>
                      <span className="text-white text-[22px]">{formatCompDate(liveCompetition?.startDate).month}</span>
                      <div className="flex items-start">
                        <span className="text-white text-[30px]">{formatCompDate(liveCompetition?.startDate).day}</span>
                        <span className="text-white text-[14px] mt-2">{formatCompDate(liveCompetition?.startDate).suffix}</span>
                      </div>
                      <span className="text-white text-[22px]">{formatCompDate(liveCompetition?.startDate).year}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <p
                        className="italic"
                        style={{
                          fontFamily: 'Sitka, serif',
                          fontSize: '21.5px',
                          lineHeight: '100%',
                          color: '#FF0000',
                          fontWeight: '400'
                        }}
                      >
                        Submission deadline
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-0" style={{ fontFamily: 'Sitka, serif' }}>
                        <span className="text-white text-[18px]">{formatCompDate(liveCompetition?.endDate).month}</span>
                        <div className="flex items-start">
                          <span className="text-white text-[25px]">{formatCompDate(liveCompetition?.endDate).day}</span>
                          <span className="text-white text-[11px] mt-1">{formatCompDate(liveCompetition?.endDate).suffix}</span>
                        </div>
                        <span className="text-white text-[18px]">{formatCompDate(liveCompetition?.endDate).year}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRole("UI/UX Designer");
                      setRegisteringComp(liveCompetition);
                      setIdCode("");
                      setLoginCode("");
                      setLoginError("");
                      setView("register");
                    }}
                    className="mt-4 w-full h-[58px] bg-[#2E2400] border border-[#FFB300]/40 rounded-[14px] text-[#FFB300] font-russo text-[20px] shadow-[inset_0_0_20px_rgba(254,179,8,0.15)] hover:bg-[#3D3200] hover:text-[#FFC732] transition-all active:scale-95 flex items-center justify-center"
                  >
                    Register Now
                  </button>
                </div>

                {/* Trackpi Future Competitions Card */}
                <div
                  className="rounded-[36px] p-10 flex flex-col items-center text-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
                  style={{
                    background: 'linear-gradient(#1A1A1A, #1A1A1A) padding-box, linear-gradient(to top, #FFC732, transparent 80%) border-box',
                    border: '1.5px solid transparent'
                  }}
                >
                  <h4 className="text-white font-russo text-[32px] md:text-[38px] leading-[1.1] tracking-tight">
                    Trackpi Future<br />Competitions
                  </h4>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2" style={{ fontFamily: 'Sitka, serif' }}>
                      <span className="text-white text-[22px]">{formatCompDate(futureCompetition?.startDate).month}</span>
                      <div className="flex items-start">
                        <span className="text-white text-[30px]">{formatCompDate(futureCompetition?.startDate).day}</span>
                        <span className="text-white text-[14px] mt-2">{formatCompDate(futureCompetition?.startDate).suffix}</span>
                      </div>
                      <span className="text-white text-[22px]">{formatCompDate(futureCompetition?.startDate).year}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <p
                        className="italic"
                        style={{
                          fontFamily: 'Sitka, serif',
                          fontSize: '21.5px',
                          lineHeight: '100%',
                          color: '#FF0000',
                          fontWeight: '400'
                        }}
                      >
                        Submission deadline
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-0" style={{ fontFamily: 'Sitka, serif' }}>
                        <span className="text-white text-[18px]">{formatCompDate(futureCompetition?.endDate).month}</span>
                        <div className="flex items-start">
                          <span className="text-white text-[25px]">{formatCompDate(futureCompetition?.endDate).day}</span>
                          <span className="text-white text-[11px] mt-1">{formatCompDate(futureCompetition?.endDate).suffix}</span>
                        </div>
                        <span className="text-white text-[18px]">{formatCompDate(futureCompetition?.endDate).year}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRole("Future UI/UX Designer");
                      setRegisteringComp(futureCompetition);
                      setIdCode("");
                      setLoginCode("");
                      setLoginError("");
                      setView("register");
                    }}
                    className="mt-4 w-full h-[58px] bg-[#221c00] border border-[#FFC732]/20 rounded-[14px] text-[#FFC732] font-russo text-[20px] shadow-[inset_0_0_20px_rgba(254,179,8,0.05)] hover:bg-[#2E2400] hover:text-[#FFC732] transition-all active:scale-95 flex items-center justify-center"
                  >
                    Prebook Now
                  </button>
                </div>
              </div>
            </div>

            {/* Already registered Login Link - Centered at the bottom */}
            <div className="w-full flex justify-center mt-12 mb-6 z-10">
              <button
                onClick={() => {
                  setLoginCode("");
                  setLoginError("");
                  setView("login");
                }}
                className="text-white/80 hover:text-[#FFB300] font-sans text-[16px] underline underline-offset-4 transition-colors font-medium decoration-white/30 hover:decoration-[#FFB300]/50"
              >
                Log in to View Results
              </button>
            </div>
          </>
        ) : view === "success" ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fade-in relative px-10">

            {/* Success Content Container - Positioned precisely as Registration Form */}
            <div
              className="absolute flex flex-col items-center gap-2"
              style={{
                width: '423.44px',
                top: '60px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              <h2
                className="font-russo text-center"
                style={{
                  fontSize: '25.63px',
                  color: '#FFB300',
                  lineHeight: '100%',
                  fontWeight: '400',
                  letterSpacing: '0px',
                  filter: 'drop-shadow(0px 2.95px 2.95px rgba(255, 255, 255, 0.45))'
                }}
              >
                Thank you for your Registration
              </h2>
              <p className="text-white text-[18px] font-medium mt-1">
                Please copy your Enrollment Code
              </p>

              {/* Enrollment Code Box - Exact Figma Specs */}
              <div
                className="mt-4 flex items-center justify-between px-8 relative bg-black/40"
                style={{
                  width: '100%',
                  height: '60px',
                  borderRadius: '8.19px',
                  border: '0.73px solid #A1A1AA'
                }}
              >
                <span className="text-white font-russo text-[24px] tracking-[0.15em]">
                  {idCode || "ENDG258734"}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-white hover:text-[#FFB300] transition-colors"
                  title="Copy Code"
                >
                  <Copy size={20} />
                </button>
              </div>

              {/* Success Description - Color Pattern from Image */}
              <p
                className="mt-6 text-center"
                style={{
                  width: '494px',
                  height: 'auto',
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '20px',
                  fontWeight: '400',
                  lineHeight: '1.2',
                  letterSpacing: '0%'
                }}
              >
                <span className="text-[#FFB300]">Please make a note of your enrollment ID. You will need </span>
                <span className="text-[#FFB300]">this</span>
                <span className="text-white"> Enrollment ID to log in and participate </span>
                <span className="text-[#FFB300]">in the competition.</span>
              </p>

              {/* Success Illustration - Precise blend to remove black background */}
              <div className="mt-2 flex items-center justify-center">
                <img
                  src={winnerOnPeak}
                  alt="Success"
                  className="w-[260px] h-[260px] object-contain"
                  style={{
                    mixBlendMode: 'screen'
                  }}
                />
              </div>

              {/* Next Button after registration - leads to Login */}
              <button
                onClick={() => {
                  setIsRegistrationLogin(true);
                  setView("login");
                }}
                className="mt-4 bg-[#FFB300] hover:bg-[#FFC732] text-white shadow-[0_15px_30px_rgba(255,179,0,0.4)] transition-all active:scale-[0.98] flex items-center justify-center hover:scale-[1.02]"
                style={{
                  width: '414.22px',
                  height: '45.84px',
                  borderRadius: '9.82px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '700',
                  fontSize: '16px'
                }}
              >
                Done
              </button>
            </div>

            {/* Decorative Trophy on bottom left - Repositioned deeper into corner */}
            <div className="absolute bottom-[-50px] left-[-40px] w-[350px] opacity-70 pointer-events-none -z-0">
              <img
                src={trophyWireframe}
                alt=""
                className="w-full h-auto"
                style={{
                  filter: 'brightness(1.5)',
                  transform: 'rotate(15deg)'
                }}
              />
            </div>
          </div>
        ) : view === "login" ? (
          /* Login View (Log in with your Enrollment code) */
          <div className="w-full h-full relative animate-slide-in overflow-hidden flex flex-col items-center">
            {/* Background Confetti */}
            <img
              src={goldConfetti}
              alt="Golden Confetti Background"
              className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none z-0"
              style={{ filter: 'brightness(1.8) saturate(1.8)' }}
            />

            {/* Title with Exact Figma Specs */}
            <h2
              className="font-russo text-[#FFB300] text-center mt-16"
              style={{
                width: '652px',
                height: '42px',
                fontSize: '38.56px',
                fontWeight: '400',
                lineHeight: '1.1',
                letterSpacing: '0px'
              }}
            >
              Log in with your Enrollment code
            </h2>

            {/* Form Container */}
            <div className="flex flex-col items-center mt-12 z-10" style={{ width: '605.2px' }}>
              <p
                className="text-white self-start"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '20px',
                  fontWeight: '400',
                  lineHeight: '100%',
                  width: '235px',
                  marginLeft: '4px', // Close to 3px, adjusting for visual alignment
                  marginBottom: '38px'
                }}
              >
                Please enter your I D Code
              </p>

              {/* Enrollment ID Input Box - Exact Figma Specs */}
              <label
                className={`w-full bg-black flex items-center justify-center px-8 cursor-text transition-all ${loginError ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-[#A1A1AA] focus-within:border-[#FFB300]'}`}
                style={{
                  height: '88.31px',
                  borderRadius: '14.8px',
                  borderWidth: '1.32px',
                  borderStyle: 'solid'
                }}
              >
                <input
                  type="text"
                  placeholder="ENDG258734"
                  value={loginCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s/g, '').toUpperCase();
                    setLoginCode(val);
                    if (loginError) setLoginError("");
                  }}
                  onPaste={(e) => {
                    const pastedData = e.clipboardData.getData('text').replace(/\s/g, '');
                    const match = pastedData.match(/ENDG\d{6}/i);
                    if (match) {
                      e.preventDefault();
                      const code = match[0].toUpperCase();
                      setLoginCode(code);
                      if (loginError) setLoginError("");
                    }
                  }}
                  className="w-full h-full bg-transparent border-none outline-none text-white font-russo text-[42px] text-center tracking-[12px] placeholder:opacity-20"
                />
              </label>
              {loginError && <p className="text-[#EF4444] text-[14px] mt-4 font-medium animate-pulse">{loginError}</p>}

              {/* Info Text - Exact Figma Specs */}
              <p
                className="text-[#FFB300] text-center mt-12 mb-12"
                style={{
                  width: '437.59px',
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '16.92px',
                  fontWeight: '400',
                  lineHeight: '1.2'
                }}
              >
                If you don't have enrollment I D. Please register our on going competition to get your Enrollment I D.
              </p>

              {/* Submit Button - Exact Figma Specs */}
              <button
                onClick={() => handleLogin()}
                disabled={loading}
                className="mt-6 hover:brightness-110 text-white shadow-[0_10px_25px_rgba(255,179,0,0.15)] transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
                style={{
                  width: '259.04px',
                  height: '48.28px',
                  backgroundColor: '#FFB300',
                  borderRadius: '10.42px',
                  border: '1.18px solid #71460D',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '700',
                  fontSize: '18px'
                }}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Submit"}
              </button>

            </div>

            {/* Decorative Trophy on bottom left - Adjusted size and rotation */}
            <div className="absolute bottom-[-100px] left-[-40px] w-[400px] opacity-70 pointer-events-none -z-0">
              <img
                src={trophyWireframe}
                alt=""
                className="w-full h-auto"
                style={{
                  filter: 'brightness(1.5)',
                  transform: 'rotate(5deg)'
                }}
              />
            </div>

            {/* Decorative Image on bottom right - Figma Specs */}
            <div className="absolute bottom-[0px] right-0 pointer-events-none z-10 flex items-end justify-end">
              <img
                src={successAchievement}
                alt="Success Achievement"
                style={{
                  width: '355.97px',
                  height: '269.34px',
                  flex: 'none',
                  order: '0',
                  alignSelf: 'stretch',
                  flexGrow: '0',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        ) : view === "talentLeagueIntro" ? (
          /* Talent League Intro / Waiting Screen (Image 2) */
          <div className="w-full relative animate-pop-in flex flex-col items-center pt-28 pb-6 px-8 h-full bg-white bg-gradient-to-b from-white to-[#FFB300]/10 rounded-[35px] overflow-hidden">
            <img
              src={goldConfetti}
              alt="Confetti"
              className="absolute top-0 left-0 right-0 w-full h-[550px] object-cover opacity-100 pointer-events-none z-0"
              style={{
                filter: 'brightness(2.5) contrast(1.1) saturate(1.4)',
                maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 80%), linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 80%), linear-gradient(to bottom, black 70%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Layer 1: Framed Brown Confetti Background - Aggressive Bottom Clear */}
            <img
              src={goldConfetti}
              alt="Brown Confetti Background"
              className="absolute top-0 left-0 right-0 w-full h-[550px] object-cover opacity-90 pointer-events-none z-0"
              style={{
                filter: 'sepia(1) saturate(1.8) brightness(0.7) hue-rotate(-10deg) contrast(1.1)',
                maskImage: 'radial-gradient(ellipse at center, transparent 45%, black 90%), linear-gradient(to bottom, black 30%, transparent 45%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 45%, black 90%), linear-gradient(to bottom, black 30%, transparent 45%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Layer 2: Dedicated Top-Left Brown Burst - Bottom Cleared */}
            <img
              src={goldConfetti}
              alt="Corner Left Brown"
              className="absolute top-0 left-0 w-[600px] h-[600px] object-cover opacity-100 pointer-events-none z-0"
              style={{
                filter: 'sepia(1) saturate(1.8) brightness(0.7) hue-rotate(-10deg) contrast(1.1)',
                maskImage: 'radial-gradient(circle at top left, black 25%, transparent 85%), linear-gradient(to bottom, black 30%, transparent 45%)',
                WebkitMaskImage: 'radial-gradient(circle at top left, black 25%, transparent 85%), linear-gradient(to bottom, black 30%, transparent 45%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Layer 3: Dedicated Top-Right Brown Burst - Bottom Cleared */}
            <img
              src={goldConfetti}
              alt="Corner Right Brown"
              className="absolute top-0 right-0 w-[600px] h-[600px] object-cover opacity-100 pointer-events-none z-0"
              style={{
                filter: 'sepia(1) saturate(1.8) brightness(0.7) hue-rotate(-10deg) contrast(1.1)',
                maskImage: 'radial-gradient(circle at top right, black 25%, transparent 85%), linear-gradient(to bottom, black 30%, transparent 45%)',
                WebkitMaskImage: 'radial-gradient(circle at top right, black 25%, transparent 85%), linear-gradient(to bottom, black 30%, transparent 45%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Top Navigation Bar - Matching Dashboard */}
            <nav
              className="absolute flex items-center justify-between z-20"
              style={{
                width: 'calc(100% - 144px)',
                top: '55px',
                left: '72px',
                height: '40.2px'
              }}
            >
              <div className="flex items-center gap-4">
                <img src={trackpiLogo} alt="TrackPi" className="h-[36px] object-contain" />
              </div>
              <div className="flex items-center gap-10">
                <span className="text-[#FFB300] font-russo text-[18px] cursor-default">Competition</span>
                <span className="text-black font-russo text-[18px] cursor-default opacity-50">Result</span>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-black font-russo text-[18px] hover:opacity-100 transition-opacity"
                >
                  Logout
                </button>
                <button onClick={toggleMusic} className="ml-4 hover:scale-110 transition-transform">
                  {isPlaying ? <Volume2 size={24} strokeWidth={1.5} className="text-black cursor-pointer" /> : <VolumeX size={24} strokeWidth={1.5} className="text-black cursor-pointer" />}
                </button>
              </div>
            </nav>

            {/* Main Content Container */}
            <div className="flex flex-col items-center z-10 w-full mt-14 text-center animate-fade-in px-4">
              <h2 className="font-russo text-[#FFB300] text-[58px] mb-12 leading-tight">Start Your Talent League</h2>

              {/* Countdown Timer Grid (Static Image Match) */}
              <div className="flex items-center gap-6 mb-14">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINUTES', val: timeLeft.minutes },
                  { label: 'SECONDS', val: timeLeft.seconds }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <div className="w-[110px] h-[110px] bg-gradient-to-b from-[#FFB300] to-[#FFC732] rounded-[15px] shadow-[0_12px_24px_rgba(255,179,0,0.3)] flex items-center justify-center">
                      <span className="font-russo text-black text-[48px]">{item.val}</span>
                    </div>
                    <span className="text-[#404040] text-[13px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                ))}
              </div>

              <p
                className="text-[#FFB300] text-center mb-16 mx-auto"
                style={{
                  width: '694px',
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '24px',
                  fontWeight: '400',
                  lineHeight: '100%',
                }}
              >
                Please joining in on time. Join with your enrollment I D. Join our Internship Talent Competition and prove your skills in design, editing, or development
              </p>

              {/* Done Button - Matching Figma Image 2 */}
              <button
                onClick={() => {
                  resetAndClose();
                  navigate("/talent-league");
                }}
                className="w-[190px] h-[48px] border-[1.5px] border-[#1A1A1A] bg-white rounded-[10px] text-[#1A1A1A] font-bold text-[20px] hover:bg-gray-100 active:scale-95 transition-all shadow-sm flex items-center justify-center"
              >
                Done
              </button>
            </div>
          </div>
        ) : view === "task" ? (
          /* Task Submission View (Image 1) - Balanced Modal Frame */
          <div className="w-full relative animate-pop-in flex flex-col items-center pt-20 pb-4 px-8 h-full">
            {/* Gold Bottom Glow - Characteristic of Dashboard screens in images */}
            <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-[#FFB300]/20 to-transparent pointer-events-none z-0"></div>

            {/* Light Background Confetti - Focused on Top */}
            {/* Light Background Confetti - Framed Intensity */}
            <img
              src={goldConfetti}
              alt="Confetti Background"
              className="absolute top-0 left-0 right-0 w-full h-[550px] object-cover opacity-100 pointer-events-none z-0"
              style={{
                filter: 'brightness(3.0) contrast(1.1) saturate(1.6)',
                maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 80%), linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 80%), linear-gradient(to bottom, black 70%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Layer 1: Framed Brown Confetti Background - Aggressive Bottom Clear */}
            <img
              src={goldConfetti}
              alt="Brown Confetti Background"
              className="absolute top-0 left-0 right-0 w-full h-[550px] object-cover opacity-90 pointer-events-none z-0"
              style={{
                filter: 'sepia(1) saturate(1.8) brightness(0.8) hue-rotate(-10deg) contrast(1.1)',
                maskImage: 'radial-gradient(ellipse at center, transparent 45%, black 90%), linear-gradient(to bottom, black 30%, transparent 45%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 45%, black 90%), linear-gradient(to bottom, black 30%, transparent 45%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Layer 2: Dedicated Top-Left Brown Burst - Bottom Cleared */}
            <img
              src={goldConfetti}
              alt="Corner Left Brown"
              className="absolute top-0 left-0 w-[600px] h-[600px] object-cover opacity-100 pointer-events-none z-0"
              style={{
                filter: 'sepia(1) saturate(1.8) brightness(0.8) hue-rotate(-10deg) contrast(1.1)',
                maskImage: 'radial-gradient(circle at top left, black 25%, transparent 85%), linear-gradient(to bottom, black 30%, transparent 45%)',
                WebkitMaskImage: 'radial-gradient(circle at top left, black 25%, transparent 85%), linear-gradient(to bottom, black 30%, transparent 45%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Layer 3: Dedicated Top-Right Brown Burst - Bottom Cleared */}
            <img
              src={goldConfetti}
              alt="Corner Right Brown"
              className="absolute top-0 right-0 w-[600px] h-[600px] object-cover opacity-100 pointer-events-none z-0"
              style={{
                filter: 'sepia(1) saturate(1.8) brightness(0.8) hue-rotate(-10deg) contrast(1.1)',
                maskImage: 'radial-gradient(circle at top right, black 25%, transparent 85%), linear-gradient(to bottom, black 30%, transparent 45%)',
                WebkitMaskImage: 'radial-gradient(circle at top right, black 25%, transparent 85%), linear-gradient(to bottom, black 30%, transparent 45%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Top Navigation Bar - Figma Specs: Top 55px, Left 72px, Justify space-between */}
            <nav
              className="absolute flex items-center justify-between z-20"
              style={{
                width: 'calc(100% - 144px)', // Deducting 72px from both sides
                top: '55px',
                left: '72px',
                height: '40.17px'
              }}
            >
              {/* Logo & Back button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView("talentLeagueIntro")}
                  className="text-black hover:text-[#FFB300] transition-colors"
                >
                  <ChevronLeft size={32} />
                </button>
                <img src={trackpiLogo} alt="TrackPi" className="h-[36px] object-contain" />
              </div>

              {/* Nav Items */}
              <div className="flex items-center gap-10">
                <button
                  onClick={() => setView("task")}
                  className={`${view === "task" ? "text-[#FFB300]" : "text-black"} font-russo text-[18px] hover:opacity-80 transition-opacity`}
                >
                  Competition
                </button>
                <button
                  onClick={() => setView("result")}
                  className={`${view === "result" ? "text-[#FFB300]" : "text-black"} font-russo text-[18px] hover:opacity-80 transition-opacity`}
                >
                  Result
                </button>
                <button
                  className="text-black font-russo text-[18px] hover:opacity-80 transition-opacity"
                  onClick={() => setShowLogoutModal(true)}
                >
                  Logout
                </button>
                <button onClick={toggleMusic} className="ml-4 hover:scale-110 transition-transform">
                  {isPlaying ? <Volume2 size={24} strokeWidth={1.5} className="text-black cursor-pointer" /> : <VolumeX size={24} strokeWidth={1.5} className="text-black cursor-pointer" />}
                </button>
              </div>
            </nav>

            {/* Content Container - Balanced Spacing */}
            <div className="flex flex-col items-center gap-6 mt-14 w-full">
              <div className="flex flex-col items-center gap-4">


                {/* Task Form Content */}
                <div className="z-10 flex flex-col items-center w-full">
                  {/* Title - Strictly Matched to Figma Specs */}
                  <h2
                    className="font-russo text-[#FFB300] text-center mb-6"
                    style={{
                      fontSize: '40px',
                      lineHeight: '110%',
                      fontWeight: '400',
                      letterSpacing: '0px',
                      textTransform: 'none'
                    }}
                  >
                    Submit Your Task
                  </h2>

                  {/* Countdown Timer Row */}
                  <div className="flex flex-col items-center gap-4 mb-6">
                    {compDates.start && (
                      <p className="font-russo text-black/60 text-[18px] mb-2 text-center">
                        {compDates.start} — {compDates.end}
                      </p>
                    )}
                    <span className="font-russo text-[#FFB300] text-[18px] uppercase tracking-widest">
                      {timerPhase === "active" ? "Ends in:" : "Starts in:"}
                    </span>
                    <div className="flex gap-8">
                      {[
                        { label: 'DAYS', val: timeLeft.days },
                        { label: 'HOURS', val: timeLeft.hours },
                        { label: 'MINUTES', val: timeLeft.minutes },
                        { label: 'SECONDS', val: timeLeft.seconds }
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-2">
                          <div
                            className="w-[90px] h-[90px] bg-gradient-to-b from-[#FFB300] to-[#FFC732] rounded-[12px] flex items-center justify-center shadow-[0_8px_16px_rgba(255,179,0,0.25)] border border-white/40"
                          >
                            <span className="text-black font-russo text-[42px] leading-none">{item.val}</span>
                          </div>
                          <span className="text-black text-[11px] font-bold tracking-[0.15em] uppercase">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Your Task Section */}
                  <div className="w-full max-w-[815px] mb-4 text-center flex flex-col items-center">
                    <h3 className="text-[#FFB300] font-russo text-[16px] mb-1">View Your Task</h3>
                    <a
                      href={taskPDF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[332px] h-[60px] bg-white border-[1.2px] border-[#A1A1AA] rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm group cursor-pointer"
                    >
                      <div className="bg-[#EF4444]/10 p-1.5 rounded-lg group-hover:bg-[#EF4444]/20 transition-colors">
                        <FileText className="text-[#EF4444]" size={30} />
                      </div>
                    </a>
                  </div>

                  {/* Submit Your Task Section */}
                  <div className="w-full max-w-[815px] mb-6 text-center flex flex-col items-center">
                    <h3 className="text-[#FFB300] font-russo text-[16px] mb-1">Submit Your Task</h3>
                    <div className="w-full h-[95px] bg-white border-[1.2px] border-[#A1A1AA] rounded-[12px] p-2 px-6 flex flex-col items-center justify-center gap-2 shadow-sm">
                      <p className="text-[#1A1A1A] text-[15px] font-medium font-inter">
                        {selectedFile ? `Selected: ${selectedFile.name}` : "Submit your design in figma link or adobe XD link or PDF ."}
                      </p>
                      <div className="flex flex-col items-center gap-2">
                        <label
                          className={`flex items-center gap-2 px-6 h-[34px] rounded-[8px] font-bold text-[14px] transition-all shadow-sm ${(timerPhase !== 'active' || isTimeUp) ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60' : 'bg-white border-[1.2px] border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300]/5 active:scale-[0.98] cursor-pointer'}`}
                        >
                          {(timerPhase !== 'active' || isTimeUp) ? "Locked" : (selectedFile ? "Change file" : "Upload file")}
                          <Upload size={16} className={(timerPhase !== 'active' || isTimeUp) ? "text-gray-400" : "text-[#FFB300]"} />
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf"
                            disabled={timerPhase !== 'active' || isTimeUp}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Final Submit Button */}
                  <button
                    onClick={async () => {
                      if (!selectedFile) {
                        toast.error("Please upload your PDF task file first.");
                        return;
                      }

                      const activeId = idCode || loginCode;
                      if (!activeId) {
                        toast.error("Enrollment ID is missing. Please log in again.");
                        return;
                      }

                      setLoading(true);
                      try {
                        const formData = new FormData();
                        formData.append("taskFile", selectedFile);
                        formData.append("enrollmentId", activeId);

                        const response = await axios.post(
                          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/submit-task`,
                          formData,
                          {
                            headers: { "Content-Type": "multipart/form-data" }
                          }
                        );

                        if (response.data.success) {
                          toast.success("Task PDF Submitted Successfully!");
                          setSelectedFile(null);
                          onClose();
                          navigate("/competition/completed"); // Go straight to full page status
                        }
                      } catch (error) {
                        console.error("Submission error:", error);
                        toast.error(error.response?.data?.message || "Failed to submit task.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || timerPhase !== 'active' || isTimeUp}
                    className="w-[182px] h-[52px] bg-[#FFB300] text-white font-bold text-[20px] rounded-[10px] shadow-[0_12px_24px_rgba(255,179,0,0.3)] hover:brightness-110 active:scale-95 transition-all mb-2 disabled:opacity-50 flex items-center justify-center mt-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>

        ) : view === "result" ? (
          /* Result View (Matching CompetitionPending design) */
          <div className="w-full relative animate-pop-in flex flex-col items-center pt-20 pb-4 px-8 h-full">
            {/* Gold Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-[#FFB300]/20 to-transparent pointer-events-none z-0"></div>

            {/* Light Background Confetti */}
            <img
              src={goldConfetti}
              alt="Confetti Background"
              className="absolute top-0 left-0 right-0 w-full h-[550px] object-cover opacity-100 pointer-events-none z-0"
              style={{
                filter: 'brightness(3.0) contrast(1.1) saturate(1.6)',
                maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 80%), linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 80%), linear-gradient(to bottom, black 70%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />

            {/* Top Navigation Bar - Matching Task View Navbar */}
            <nav
              className="absolute flex items-center justify-between z-20"
              style={{
                width: 'calc(100% - 144px)',
                top: '55px',
                left: '72px',
                height: '40.17px'
              }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView("task")}
                  className="text-black hover:text-[#FFB300] transition-colors"
                >
                  <ChevronLeft size={32} />
                </button>
                <img src={trackpiLogo} alt="TrackPi" className="h-[36px] object-contain" />
              </div>

              <div className="flex items-center gap-10">
                <button
                  onClick={() => setView("task")}
                  className={`${view === "task" ? "text-[#FFB300]" : "text-black"} font-russo text-[18px] hover:opacity-80 transition-opacity`}
                >
                  Competition
                </button>
                <button
                  onClick={() => setView("result")}
                  className={`${view === "result" ? "text-[#FFB300]" : "text-black"} font-russo text-[18px] hover:opacity-80 transition-opacity`}
                >
                  Result
                </button>
                <button
                  className="text-black font-russo text-[18px] hover:opacity-80 transition-opacity"
                  onClick={() => setShowLogoutModal(true)}
                >
                  Logout
                </button>
                <button onClick={toggleMusic} className="ml-4 hover:scale-110 transition-transform">
                  {isPlaying ? <Volume2 size={24} strokeWidth={1.5} className="text-black cursor-pointer" /> : <VolumeX size={24} strokeWidth={1.5} className="text-black cursor-pointer" />}
                </button>
              </div>
            </nav>

            {/* Main Content - No result found state */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20 z-10 w-full">
              <h2
                className="text-center"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "32px",
                  fontWeight: 400,
                  color: "#000000",
                  opacity: 0.8
                }}
              >
                No result found. We will update you soon
              </h2>

              <button
                onClick={() => navigate("/competition/ui-ux")}
                className="w-[200px] h-[52px] bg-[#FFB300] text-white rounded-[10px] font-bold text-[20px] hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center justify-center mt-10"
              >
                Back to home
              </button>
            </div>
          </div>
        ) : (
          /* Registration View (As per provided image) */
          <div className="w-full h-full relative animate-slide-in overflow-hidden">

            {/* Inner Form Frame (Specified by Figma, tightened for single-page fit) */}
            <div
              className="absolute flex flex-col items-center"
              style={{
                width: '423.44px',
                height: 'auto',
                top: '40px',
                left: '300px',
                paddingBottom: '40px',
                gap: '15px',
              }}
            >
              {/* Form Title (Styled strictly to Figma spec) */}
              <h2
                className="font-russo text-center"
                style={{
                  fontSize: '22px',
                  color: '#FFB300',
                  lineHeight: '100%',
                  fontWeight: '400',
                  letterSpacing: '0px',
                  filter: 'drop-shadow(0px 2.95px 2.95px rgba(255, 255, 255, 0.45))'
                }}
              >
                Register your Details
              </h2>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col z-10" style={{ gap: '27px' }}>

                {/* Full Name */}
                <div className="flex flex-col gap-1 text-left w-full">
                  <label className="text-white text-[14px] font-medium ml-1 flex items-center gap-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`bg-black/40 px-4 text-white text-[13px] outline-none transition-all placeholder:text-gray-600 shadow-inner ${errors.fullName ? 'border-red-500' : 'focus:border-[#FFB300]/50'}`}
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '8.19px',
                      border: errors.fullName ? '0.73px solid #EF4444' : '0.73px solid #A1A1AA'
                    }}
                  />
                  {errors.fullName && <p className="text-[#EF4444] text-[11px] mt-1 ml-1">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1 text-left w-full">
                  <label className="text-white text-[14px] font-medium ml-1 flex items-center gap-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-black/40 px-4 text-white text-[13px] outline-none focus:border-[#FFB300]/50 transition-all placeholder:text-gray-600 shadow-inner"
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '8.19px',
                      border: '0.73px solid #A1A1AA'
                    }}
                  />
                </div>

                {/* Phone Number with Mock Country Picker */}
                <div className="flex flex-col gap-1 text-left w-full">
                  <label className="text-white text-[14px] font-medium ml-1">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3 h-[45px]">
                    <div className="flex items-center gap-2 bg-black/40 border border-white/20 rounded-xl px-4 min-w-[80px] cursor-pointer hover:border-[#FFB300]/30 transition-all shadow-inner">
                      <img src="https://flagcdn.com/in.svg" alt="IN" className="w-5 h-3 object-cover" />
                      <span className="text-white text-[13px]">+91</span>
                      <ChevronDown size={10} className="text-gray-400" />
                    </div>
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`flex-1 bg-black/40 px-4 text-white text-[13px] outline-none transition-all placeholder:text-gray-600 shadow-inner ${errors.phone ? 'border-red-500' : 'focus:border-[#FFB300]/50'}`}
                      style={{
                        height: '48px',
                        borderRadius: '8.19px',
                        border: errors.phone ? '0.73px solid #EF4444' : '0.73px solid #A1A1AA'
                      }}
                    />
                  </div>
                  {errors.phone && <p className="text-[#EF4444] text-[11px] mt-1 ml-1">{errors.phone}</p>}
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1 text-left w-full">
                  <label className="text-white text-[14px] font-medium ml-1 flex items-center gap-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="location"
                    placeholder="Enter your Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`bg-black/40 px-4 text-white text-[13px] outline-none transition-all placeholder:text-gray-600 shadow-inner ${errors.location ? 'border-red-500' : 'focus:border-[#FFB300]/50'}`}
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '8.19px',
                      border: errors.location ? '0.73px solid #EF4444' : '0.73px solid #A1A1AA'
                    }}
                  />
                  {errors.location && <p className="text-[#EF4444] text-[11px] mt-1 ml-1">{errors.location}</p>}
                </div>

                {/* Department Section */}
                <div className="flex flex-col gap-1 text-left w-full">
                  <label className="text-white text-[14px] font-medium ml-1 flex items-center gap-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="bg-black/40 px-4 text-white text-[13px] outline-none focus:border-[#FFB300]/50 transition-all appearance-none cursor-pointer"
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '8.19px',
                      border: '0.73px solid #A1A1AA',
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="" disabled className="bg-[#1a1a1a]">Select Department</option>
                    <option value="MERN Stack Developer" className="bg-[#1a1a1a]">MERN Stack Developer</option>
                    <option value="UI/UX Designer" className="bg-[#1a1a1a]">UI/UX Designer</option>
                    <option value="Graphic Designer" className="bg-[#1a1a1a]">Graphic Designer</option>
                    <option value="HR" className="bg-[#1a1a1a]">HR</option>
                  </select>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-center gap-3 pt-1">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#FFB300] rounded transition-all peer-checked:bg-[#FFB300] flex items-center justify-center">
                      <svg className={`w-3.5 h-3.5 text-black transform transition-transform duration-200 ${formData.agreed ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                  <div className="text-gray-400 text-[12px] leading-snug">
                    I agree to the <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-2">
                  <button
                    disabled={loading}
                    type="submit"
                    className="bg-[#FFB300] hover:bg-[#FFC732] text-white shadow-[0_10px_25px_rgba(255,179,0,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      width: '414.22px',
                      height: '45.84px',
                      borderRadius: '9.82px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: '700',
                      fontSize: '16px'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      "Get your I D Code"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Decorative Trophy on bottom left - Repositioned slightly right */}
            <div className="absolute bottom-[-50px] left-[20px] w-[350px] opacity-70 pointer-events-none -z-0">
              <img
                src={trophyWireframe}
                alt=""
                className="w-full h-auto"
                style={{
                  filter: 'brightness(1.5)',
                  transform: 'rotate(15deg)'
                }}
              />
            </div>

          </div>
        )}

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB300]/5 blur-[120px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB300]/5 blur-[100px] -z-10 rounded-full"></div>
      </div>

      {/* Background overlay click to close */}
      <div className="absolute inset-0 -z-10 bg-black/40" onClick={resetAndClose}></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Inter:wght@400;500;600;700;800;900&family=Lato:wght@400;700&family=Raleway:wght@400&display=swap');
        
        .font-russo {
          font-family: 'Russo One', sans-serif;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-pop-in {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        
        .custom-scrollbar {
          -ms-overflow-style: none;
        }
      `}</style>

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
                  setLoginCode("");
                  setIdCode("");
                  setLoginError("");
                  setView("cards");
                  setShowLogoutModal(false);
                  onClose();
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

export default ChallengeModal;
