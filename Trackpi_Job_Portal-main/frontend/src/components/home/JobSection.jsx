import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import JobCard from "./JobCard";
import JobDetailsModal from "./JobDetailsModal";
import Pagination from "./Pagination";
import { TiArrowBack } from "react-icons/ti";
import { API_URL } from "../../config";


const JobSection = ({ className = "", isHome = false, showBack = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialExperience = searchParams.get("experience") || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Filter & Search State
  const initialSearch = initialKeyword || initialLocation ? `${initialKeyword} ${initialLocation}`.trim() : "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [sortType, setSortType] = useState("Sort");

  // Specific Filters State (Multi-select)
  const [filters, setFilters] = useState({
    education: [],
    jobType: [], // Contract type
    industry: [],
    experience: initialExperience ? [initialExperience] : [],
  });

  const [expandedSections, setExpandedSections] = useState({
    education: true,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // Refs
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setOpenSort(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* -------------------- Data Fetching -------------------- */
  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const res = await fetch(`${API_URL}/api/jobs`);
        const data = await res.json();
        const enrichedData = Array.isArray(data) ? data
          .filter(job => job.status !== 'closed')
          .map((job, index) => ({
            ...job,
            views: job.views || Math.floor(Math.random() * 1000) + 50,
            createdAt: job.createdAt || new Date(Date.now() - index * 86400000).toISOString()
          })) : [];
        setJobs(enrichedData);

        const token = localStorage.getItem('token');
        if (token) {
          const appsRes = await fetch(`${API_URL}/api/applications/my-applications`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const appsData = await appsRes.json();
          if (appsData.success) {
            setAppliedJobIds(appsData.applications.map(app => app.jobId?._id || app.jobId || app.job?._id || app.job));
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs or applications", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndApplications();
  }, []);

  /* -------------------- Constants & Options -------------------- */
  const filterCategories = [
    {
      id: "education",
      label: "Education required",
      options: ["Plus two", "Diploma", "Graduate", "Post graduate"]
    },
    {
      id: "jobType",
      label: "Contract type",
      options: ["Full Time", "Internship", "Freelance", "Part Time"]
    },
    {
      id: "industry",
      label: "Industry",
      options: ["Accounting", "Banking", "UI/UX Designing", "IT", "Marketing", "Finance"]
    },
    {
      id: "experience",
      label: "Experience level",
      options: ["Freshers", "Entry Level (1-2 yr)", "Mid Level (4-5 yr)", "Senior Level (5+ yr)"]
    },
    {
      id: "posted",
      label: "Job posted",
      options: ["Most viewed", "Newest", "Urgent"]
    }
  ];

  /* -------------------- Logic -------------------- */

  const matchFilters = (job) => {
    // 1. Education
    if (filters.education && filters.education.length > 0) {
      const jobEdu = (job.education || "").toLowerCase().trim();
      const matches = filters.education.some(f => {
        const filterStr = f.toLowerCase().trim();
        // Exact matching or smart matching for common patterns
        if (filterStr === "graduate") return (jobEdu.includes("graduate") || jobEdu.includes("graduation") || jobEdu.includes("degree")) && !jobEdu.includes("post");
        if (filterStr === "post graduate") return jobEdu.includes("post graduate") || jobEdu.includes("post graduation") || jobEdu.includes("master") || jobEdu.includes("pg");
        if (filterStr === "plus two") return jobEdu.includes("plus two") || jobEdu.includes("plus 2") || jobEdu.includes("+2") || jobEdu.includes("12th");
        return jobEdu.includes(filterStr);
      });
      if (!matches) return false;
    }

    // 2. Contract Type
    if (filters.jobType && filters.jobType.length > 0) {
      const jobType = (job.jobType || "").toLowerCase();
      const matches = filters.jobType.some(f => jobType.includes(f.toLowerCase()));
      if (!matches) return false;
    }

    // 3. Industry
    if (filters.industry && filters.industry.length > 0) {
      const text = `${job.title} ${job.company} ${job.skills || ""} ${job.description || ""}`.toLowerCase();
      const matches = filters.industry.some(f => text.includes(f.toLowerCase()));
      if (!matches) return false;
    }

    // 4. Experience
    if (filters.experience && filters.experience.length > 0) {
      const jobExp = (job.experience || "").toLowerCase();
      const matches = filters.experience.some(f => {
        if (f === "Freshers") return jobExp.includes("fresher") || jobExp.includes("0");
        return jobExp.includes(f.toLowerCase().slice(0, 5)); // match partials like "Entry" or "Senior"
      });
      if (!matches) return false;
    }

    return true;
  };

  const currentFilteredJobs = jobs.filter((job) => {
    if (!job) return false;
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      (job.title || "").toLowerCase().includes(term) ||
      (job.company || "").toLowerCase().includes(term) ||
      (job.location || "").toLowerCase().includes(term);

    return matchSearch && matchFilters(job);
  });


  // Sort Logic
  const sortedJobs = [...currentFilteredJobs].sort((a, b) => {
    // 1. Urgent Priority
    if (sortType === "Urgent") {
      if (a.status === "urgent" && b.status !== "urgent") return -1;
      if (a.status !== "urgent" && b.status === "urgent") return 1;
    }

    // 2. Most Viewed Priority (Simulated)
    if (sortType === "Most viewed") {
      if ((b.views || 0) !== (a.views || 0)) {
        return (b.views || 0) - (a.views || 0);
      }
    }

    // 3. Newest Priority
    if (sortType === "Newest" || sortType === "Sort") {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    }

    // Default: Newest first usually
    return 0;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);


  // Handlers
  const toggleSection = (section) => {
    setExpandedSections(prev => {
      // If it's already open, close it (toggle behavior). 
      // If closing it, we return an empty object to have none open.
      if (prev[section]) return {};
      // Otherwise open only the selected section
      return { [section]: true };
    });
  };

  const toggleFilter = (category, value) => {
    if (category === "posted") {
      setSortType(value);
      setCurrentPage(1);
      return;
    }

    setFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };



  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <section className={`pt-0 pb-16 bg-white font-['Satoshi'] ${className}`}>
      <div className="max-w-[1200px] mx-auto px-4">

        {/* 1. Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center mb-10 relative"
        >
          {showBack && (
            <button
              onClick={() => navigate("/")}
              className="absolute left-4 md:left-8 top-1 md:top-3 text-black hover:text-[#FFB300] transition-colors"
            >
              <TiArrowBack size={24} className="font-bold" />
            </button>
          )}
          <div className="max-w-[600px]">
            <h2 className="text-[38px] md:text-[56px] font-extrabold text-black tracking-tight uppercase leading-none font-Cabinet Grotesk">
              JOB LISTING
            </h2>
            <p className="text-[16px] text-gray-600 mt-2 font-medium">
              All available jobs in one place. Filter and apply
            </p>
          </div>
        </motion.div>

        {/* 2. Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center gap-4 mb-10 max-w-[980px] mx-auto w-full"
        >
          <div className="relative flex-grow w-full">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FFB300]">
              <i className="ri-search-line text-xl"></i>
            </div>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 w-[1px] h-6 bg-gray-300"></div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search your favorite company or job role"
              className="w-full h-[44px] pl-20 pr-6 rounded-[12px] border border-[#FFB300] outline-none text-sm placeholder:text-gray-400 text-gray-700 shadow-sm"
            />
          </div>
          <button className="w-full md:w-auto h-[44px] px-10 bg-[#FFB300] hover:bg-[#ffc133] text-black font-bold text-sm rounded-[12px] transition-colors shadow-sm">
            Search
          </button>
        </motion.div>

        {/* Filters Toolbar - Justify Between / 1252px Max Width / 57px Height */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-between items-center mb-10 max-w-[1252px] mx-auto w-full z-30 relative px-0 h-[57px]"
        >

          {/* SORT BUTTON (Left) */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setOpenSort(!openSort);
                setOpenFilter(false);
              }}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-b from-white to-[#F2F2F2] border border-black rounded-[10px] text-[13px] font-bold text-black hover:brightness-95 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
            >
              Sort <i className="ri-arrow-up-down-line ml-1"></i>
            </button>

            {openSort && (
              <div className="absolute top-full left-0 mt-3 bg-white shadow-xl border border-gray-100 rounded-[16px] w-[260px] z-50 overflow-hidden animate-fadeIn">
                <div className="flex flex-col">
                  {["Most viewed", "Newest", "Urgent"].map((option) => {
                    const isSelected = sortType === option;
                    return (
                      <div
                        key={option}
                        onClick={() => {
                          setSortType(option);
                          setOpenSort(false);
                          setCurrentPage(1);
                        }}
                        className={`flex items-center px-4 py-3 cursor-pointer transition-colors bg-gradient-to-r from-[#F2F2F2] to-white border-b border-gray-100 last:border-0 hover:from-gray-200`}
                      >
                        {/* Checkbox Styled as Rounded Square */}
                        <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center mr-3 transition-colors ${isSelected
                          ? "border-black text-black"
                          : "border-black bg-transparent"
                          }`}>
                          {/* Checkmark always visible if selected */}
                          {isSelected && <i className="ri-check-line text-sm font-bold"></i>}
                        </div>

                        {/* Label */}
                        <span className="text-[15px] font-medium text-black">
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* FILTER DROPDOWN (Right) */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setOpenFilter(!openFilter)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-b from-white to-[#F2F2F2] border border-black rounded-[10px] text-[13px] font-bold text-black hover:brightness-95 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              <i className="ri-filter-3-line ml-1"></i>
            </button>

            {openFilter && (
              <div className="absolute top-full right-0 mt-3 bg-white shadow-2xl border border-gray-200 rounded-[4px] w-[280px] md:w-[320px] max-h-[600px] overflow-y-auto z-50 p-4 animate-fadeIn">

                <div className="flex justify-end items-center mb-2">
                  <button
                    onClick={() => setOpenFilter(false)}
                    className="text-gray-500 hover:text-black text-xl leading-none"
                  >
                    &times;
                  </button>
                </div>

                {filterCategories.map((category) => (
                  <div key={category.id} className="mb-4">
                    {/* Header */}
                    <button
                      onClick={() => toggleSection(category.id)}
                      className="flex justify-between items-center w-full mb-2"
                    >
                      <h4 className="text-[16px] font-medium text-black">
                        {category.label}
                      </h4>
                      {expandedSections[category.id] ? (
                        <i className="ri-arrow-up-s-line text-xl text-black"></i>
                      ) : (
                        <i className="ri-arrow-down-s-line text-xl text-black"></i>
                      )}
                    </button>

                    {/* Options */}
                    {expandedSections[category.id] && (
                      <div className="space-y-2">
                        {category.options.map((option) => {
                          const isSelected = category.id === "posted" ? sortType === option : filters[category.id]?.includes(option);
                          return (
                            <div
                              key={option}
                              onClick={() => toggleFilter(category.id, option)}
                              className="flex items-center group cursor-pointer mb-1.5"
                            >
                              <div className="flex-grow flex items-center py-2 px-3 bg-gradient-to-r from-gray-200 via-gray-100 to-transparent rounded-sm">
                                {/* Custom Checkbox Look */}
                                <div className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center mr-3 transition-colors ${isSelected ? "border-black bg-transparent text-black" : "bg-transparent border-gray-500 group-hover:border-black"
                                  }`}>
                                  {isSelected && <i className="ri-check-line text-[10px] font-bold"></i>}
                                </div>

                                {/* Label */}
                                <div className="text-[12px] text-gray-900 font-medium">
                                  {option}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}
          </div>
        </motion.div>

        {/* 4. Job Listings */}
        <div className="flex flex-col gap-4 max-w-[1200px] mx-auto mb-16">
          {loading && <p className="text-center">Loading jobs...</p>}

          {!loading && sortedJobs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
              <button
                onClick={() => {
                  setFilters({ education: [], jobType: [], industry: [], experience: [] });
                  setSortType("Sort");
                  setOpenFilter(false);
                }}
                className="mt-4 text-[#FFB300] font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading &&
            currentJobs.map((job, idx) => (
              <motion.div
                key={job._id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <JobCard
                  id={job._id}
                  status={job.status === "urgent" ? "Urgent Hiring" : "New"}
                  statusColor={job.status === "urgent" ? "red" : "green"}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  jobType={job.jobType}
                  education={job.education}
                  salary={job.salary}
                  experience={job.experience}
                  workMode={job.workMode}
                  gender={job.gender || "Any"}
                  hasApplied={appliedJobIds.includes(job._id)}
                  onDetailsClick={() => setSelectedJobId(job._id)}
                  onApplySuccess={() => setAppliedJobIds(prev => [...prev, job._id])}
                />
              </motion.div>
            ))}
        </div>


        {/* Modal */}
        {selectedJobId && (
          <JobDetailsModal
            jobId={selectedJobId}
            isApplied={appliedJobIds.includes(selectedJobId)}
            onApplySuccess={() => {
              setAppliedJobIds(prev => [...prev, selectedJobId]);
              setSelectedJobId(null);
            }}
            onClose={() => setSelectedJobId(null)}
          />
        )}




        {/* 5. Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}



      </div>
    </section>
  );
};

export default JobSection;
