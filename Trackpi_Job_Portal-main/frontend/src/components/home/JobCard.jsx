import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "remixicon/fonts/remixicon.css";

/* Assets */
import verifiedJob from "../../assets/badges/verified-job.png";
import trackpiLogo from "../../assets/badges/trackpi-striped.png";
import LoginRequiredModal from "../LoginRequiredModal";
import ApplyJobForm from "./ApplyJobForm";

const JobCard = ({
  id,
  title = "Job Title",
  company = "Company Name",
  location = "Location",
  education = "Any Degree",
  jobType = "Full Time",
  salary = "Not disclosed",
  experience = "Not specified",
  workMode = "On-site",
  gender = "Any",
  status = "New",
  statusColor = "green",
  hasApplied = false,
  onApplySuccess,
  onDetailsClick,
}) => {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const handleApplyClick = () => {
    if (hasApplied) return;
    const token = localStorage.getItem("token");
    if (token) {
      setShowApplyForm(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  /* Status Ribbon */
  const ribbonGradient =
    statusColor === "red"
      ? "linear-gradient(90deg, #E33232 0%, #FFFFFF 100%)"
      : "linear-gradient(90deg, #2CA734 0%, #FFFFFF 100%)";

  return (
    <>
      {/* ================= CARD ================= */}
      <motion.div 
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="relative"
      >
        <div className="bg-white border border-gray-300 rounded-[25px] shadow-sm relative hover:shadow-md transition-shadow duration-300">

          {/* STATUS RIBBON */}
          <div
            className="w-[65%] h-[39px] flex items-center px-6 text-white font-bold text-base rounded-tl-[8px]"
            style={{ background: ribbonGradient }}
          >
            {status}
          </div>

          {/* WORK MODE */}
          <div className="absolute top-0 right-0 bg-[#FFB300] px-4 py-2 rounded-bl-2xl rounded-tr-[25px] font-bold text-[12px] sm:text-[13px] flex items-center gap-1 sm:gap-2 z-10">
            <i className="ri-briefcase-4-line"></i>
            {workMode}
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">

            {/* COMPANY LOGO — inline on mobile, absolute on larger screens */}
            <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 md:absolute md:-left-6 md:top-1/2 md:-translate-y-1/2 bg-[#FFB300] rounded-2xl flex items-center justify-center shadow-md border border-white z-20 overflow-hidden">
              <img
                src={trackpiLogo}
                alt="Company Logo"
                className="w-full h-full object-contain p-2"
              />
            </div>

            {/* MAIN INFO */}
            <div className="flex-grow md:pl-16 pr-0 md:pr-4 w-full">
              <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                <div>
                  <h3 className="text-[18px] sm:text-[22px] font-bold text-black uppercase tracking-tight">
                    {title}
                  </h3>

                  <p className="text-[14px] sm:text-[15px] text-gray-800 flex items-center gap-1 mt-1 font-medium">
                    <i className="ri-map-pin-line text-[#FFB300]"></i>
                    {company}, {location}
                  </p>
                </div>
              </div>

              {/* Verified Job Badge - Exact Figma Position */}
              <img
                src={verifiedJob}
                alt="Verified"
                className="absolute hidden lg:block w-[158px] h-[138px] top-[46px] left-[790px] p-[10px] object-contain z-20"
              />

              {/* JOB DETAILS - Tighter Spacing */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-[97px] text-[12px] sm:text-[13px] font-semibold mt-2 max-w-[732px] h-auto md:h-[48px]">
                <div className="flex items-center gap-2">
                  <i className="ri-briefcase-line text-[#FFB300] text-lg"></i>
                  {jobType}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-graduation-cap-line text-[#FFB300] text-lg"></i>
                  {education}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-briefcase-4-line text-[#FFB300] text-lg"></i>
                  {workMode}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-user-line text-[#FFB300] text-lg"></i>
                  {gender}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-money-rupee-circle-line text-[#FFB300] text-lg"></i>
                  {salary}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-time-line text-[#FFB300] text-lg"></i>
                  {experience}
                </div>
              </div>
            </div>

            {/* ACTION PANEL */}
            <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto md:min-w-[180px] md:pb-6 relative">
              <button
                onClick={handleApplyClick}
                className="font-bold text-[14px] transition-all flex items-center justify-center"
                style={{
                  width: "155px",
                  height: "33px",
                  borderRadius: "10px",
                  padding: "10px",
                  background: "linear-gradient(90deg, #FFB300 0%, #FFFFFF 100%)",
                  border: "1px solid #6C6962",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                }}
              >
                Apply Now
              </button>

              <div className="flex flex-col items-center">
                <button
                  onClick={onDetailsClick}
                  className="text-[14px] font-medium text-black leading-none font-['Satoshi'] flex items-center justify-center gap-1"
                >
                  More details <i className="ri-arrow-right-line scale-90"></i>
                </button>
                <div
                  className="border-t-[1px] border-[#D02520] mt-[2px] w-[77px]"
                ></div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* ================= LOGIN POPUP ================= */}
      {showLoginPopup && (
        <LoginRequiredModal onClose={() => setShowLoginPopup(false)} />
      )}

      {/* ================= APPLY FORM POPUP ================= */}
      {showApplyForm && (
        <ApplyJobForm
          jobId={id}
          job={{ title, company, location }}
          onCancel={() => setShowApplyForm(false)}
          onSuccess={() => {
            if (onApplySuccess) onApplySuccess();
            setShowApplyForm(false);
          }}
        />
      )}
    </>
  );
};

export default JobCard;
