import { useState, useEffect } from "react";
import { Eye, Trash2, FileText, Search, Filter, ArrowUpDown, ChevronDown, ChevronUp, X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import { API_URL } from "../../config";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import Pagination from "../../components/admin/Pagination";
import { calculateProfileStrength } from "../../utils/profileUtils";


const Toggle = ({ checked, onChange, disabled }) => {
    return (
        <button
            disabled={disabled}
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
};

const CircularProgress = ({ percentage }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Progress Color Logic
    let color = "text-[#FFB300]"; // Default Yellow/Orange
    if (percentage > 75) color = "text-green-500";
    if (percentage < 25) color = "text-red-500";

    return (
        <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-gray-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="20"
                    cy="20"
                />
                <circle
                    className={color}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="20"
                    cy="20"
                />
            </svg>
            <span className="absolute text-[10px] font-bold text-gray-700">{percentage}%</span>
        </div>
    );
};

const FilterDropdown = ({ filters, setFilters, onClose }) => {
    const [expandedSection, setExpandedSection] = useState("experience");

    const experienceLevels = [
        { label: "Freshers", value: "fresher" },
        { label: "Entry Level (1-2 yr)", value: "entry" },
        { label: "Mid Level (4-5 yr)", value: "mid" },
        { label: "Senior Level (5+ yr)", value: "senior" }
    ];

    const educationLevels = ["Plus two", "Diploma", "Graduate", "Post graduate"];
    const jobTags = ["Most viewed", "Newest", "Urgent"];

    const toggleFilter = (category, value) => {
        setFilters(prev => {
            const current = prev[category];
            if (current.includes(value)) {
                return { ...prev, [category]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [category]: [...current, value] };
            }
        });
    };

    return (
        <div className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <span className="font-bold text-gray-800">Filters</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                    <X size={18} />
                </button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto">
                {/* Experience Section */}
                <div className="border-b border-gray-100">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === "experience" ? null : "experience")}
                        className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                        <span className="text-sm font-semibold text-gray-700">Experience level</span>
                        {expandedSection === "experience" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedSection === "experience" && (
                        <div className="px-4 pb-4 space-y-3">
                            {experienceLevels.map(level => (
                                <label key={level.value} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.experience.includes(level.value) ? 'bg-[#FFB300] border-[#FFB300]' : 'border-gray-300 group-hover:border-[#FFB300]'}`}>
                                        {filters.experience.includes(level.value) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={filters.experience.includes(level.value)}
                                        onChange={() => toggleFilter("experience", level.value)}
                                    />
                                    <span className="text-sm text-gray-600 font-medium">{level.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Gender Section */}
                <div className="border-b border-gray-100">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === "gender" ? null : "gender")}
                        className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                        <span className="text-sm font-semibold text-gray-700">Gender</span>
                        {expandedSection === "gender" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedSection === "gender" && (
                        <div className="px-4 pb-4 space-y-3">
                            {["Male", "Female"].map(g => (
                                <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.gender.includes(g) ? 'bg-[#FFB300] border-[#FFB300]' : 'border-gray-300 group-hover:border-[#FFB300]'}`}>
                                        {filters.gender.includes(g) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={filters.gender.includes(g)}
                                        onChange={() => toggleFilter("gender", g)}
                                    />
                                    <span className="text-sm text-gray-600 font-medium">{g}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Progress Bar level */}
                <div className="border-b border-gray-100">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === "progress" ? null : "progress")}
                        className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                        <span className="text-sm font-semibold text-gray-700">Progress bar level</span>
                        {expandedSection === "progress" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedSection === "progress" && (
                        <div className="px-5 pb-6">
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={filters.progress}
                                onChange={(e) => setFilters(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFB300]"
                            />
                            <div className="text-center mt-3 font-bold text-gray-800 text-base">{filters.progress}%</div>
                        </div>
                    )}
                </div>

                {/* Education Section */}
                <div className="border-b border-gray-100">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === "education" ? null : "education")}
                        className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                        <span className="text-sm font-semibold text-gray-700">Education required</span>
                        {expandedSection === "education" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedSection === "education" && (
                        <div className="px-4 pb-4 space-y-3">
                            {educationLevels.map(edu => (
                                <label key={edu} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.education.includes(edu) ? 'bg-[#FFB300] border-[#FFB300]' : 'border-gray-300 group-hover:border-[#FFB300]'}`}>
                                        {filters.education.includes(edu) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={filters.education.includes(edu)}
                                        onChange={() => toggleFilter("education", edu)}
                                    />
                                    <span className="text-sm text-gray-600 font-medium">{edu}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Job Posted / Tags */}
                <div className="border-b border-gray-100">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === "jobTags" ? null : "jobTags")}
                        className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                        <span className="text-sm font-semibold text-gray-700">Job posted</span>
                        {expandedSection === "jobTags" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedSection === "jobTags" && (
                        <div className="px-4 pb-4 space-y-3">
                            {jobTags.map(tag => (
                                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.jobTags.includes(tag) ? 'bg-[#FFB300] border-[#FFB300]' : 'border-gray-300 group-hover:border-[#FFB300]'}`}>
                                        {filters.jobTags.includes(tag) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={filters.jobTags.includes(tag)}
                                        onChange={() => toggleFilter("jobTags", tag)}
                                    />
                                    <span className="text-sm text-gray-600 font-medium">{tag}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-gray-50 flex gap-3">
                <button 
                    onClick={() => setFilters({
                        experience: [],
                        gender: [],
                        progress: 0,
                        education: [],
                        jobTags: []
                    })}
                    className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition"
                >
                    Clear all
                </button>
                <button 
                    onClick={onClose}
                    className="flex-1 py-2 bg-[#FFB300] text-white text-sm font-bold rounded-lg hover:shadow-lg transition shadow-[#FFB300]/20"
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

const SortDropdown = ({ sortBy, setSortBy, onClose }) => {
    const options = [
        { label: "Name (A - Z)", value: "name-asc" },
        { label: "Name (Z-A)", value: "name-desc" },
        { label: "Date Applied (Newest)", value: "date-newest" },
        { label: "Date Applied (Oldest)", value: "date-oldest" },
        { label: "Gender (Male → Female)", value: "gender-m-f" },
        { label: "Gender (Female → Male)", value: "gender-f-m" },
        { label: "Experience (High → Low)", value: "exp-high-low" },
        { label: "Experience (Low → High)", value: "exp-low-high" },
    ];

    return (
        <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => {
                        setSortBy(option.value);
                        onClose();
                    }}
                    className={`w-full text-left p-4 text-sm font-medium transition flex items-center justify-between border-b border-gray-50 last:border-0 ${sortBy === option.value ? 'bg-[#FFB300] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                    {option.label}
                    {sortBy === option.value && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
                </button>
            ))}
        </div>
    );
};

const AdminApplicants = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({ totalCount: 0, pendingCount: 0 });
    const location = useLocation();
    const navigate = useNavigate();
    const { jobId } = useParams();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);

    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [filters, setFilters] = useState({
        experience: [],
        gender: [],
        progress: 0,
        education: [],
        jobTags: []
    });
    const [sortBy, setSortBy] = useState("date-newest");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const isPendingFilter = new URLSearchParams(location.search).get("filter") === "pending";

    const isSignupPage = location.pathname.includes("signup");
    const PERM_RESUME = isSignupPage ? PERMISSIONS.SIGNUP_DOWNLOAD_RESUME : PERMISSIONS.APPLICANTS_DOWNLOAD_RESUME;
    const PERM_DELETE = isSignupPage ? PERMISSIONS.SIGNUP_DELETE : PERMISSIONS.APPLICANTS_DELETE;
    const PERM_VIEW_DETAILS = isSignupPage ? PERMISSIONS.SIGNUP_VIEW_DETAILS : PERMISSIONS.APPLICANTS_VIEW_DETAILS;



    // Reset pagination when filters or route change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters, sortBy, location.pathname]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem("token");
                let endpoint = jobId 
                    ? `${API_URL}/api/admin/jobs/${jobId}/applicants`
                    : isSignupPage 
                        ? `${API_URL}/api/admin/candidates`
                        : `${API_URL}/api/admin/applications/all`;
                
                if (isPendingFilter && jobId) {
                    endpoint += "?status=pending";
                }
                
                const response = await fetch(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to fetch candidates");

                const result = await response.json();
                const data = jobId ? result.applicants : result;

                if (jobId) {
                    setStats({ totalCount: result.totalCount, pendingCount: result.pendingCount });
                }

                const formattedData = data.map(user => ({
                    id: user._id,
                    name: user.name || "N/A",
                    role: isSignupPage ? (user.profile?.jobTitle || (user.experience ? `${user.experience}` : "Job Seeker")) : (user.role || "N/A"),
                    phone: user.profile?.phone || user.phone || "N/A",
                    email: user.email,
                    gender: user.profile?.gender || "N/A",
                    resume: user.profile?.resumeUrl || user.resumeUrl,
                    isChecked: user.isChecked,
                    applicationId: user.applicationId,
                    appliedAt: user.appliedAt || user.createdAt,
                    progress: user.progress || (user.profile ? calculateProfileStrength(user.profile).strength : 0),
                    education: user.profile?.education || (user.education?.[0]?.degree) || "N/A",
                    experienceLevel: user.profile?.experienceLevel || (parseInt(user.experience) > 5 ? "senior" : parseInt(user.experience) > 3 ? "mid" : "entry")
                }));

                setCandidates(formattedData);
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [jobId, location.pathname, location.search]);

    const handleToggleCheck = async (candidate) => {
        // If in pending view, "can only toggled to checked"
        if (isPendingFilter && candidate.isChecked) return;

        try {
            const token = localStorage.getItem("token");
            const newStatus = !candidate.isChecked;
            
            const appId = candidate.applicationId || candidate.id;
            const response = await fetch(`${API_URL}/api/admin/applications/${appId}/toggle-check`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ isChecked: newStatus })
            });

            if (!response.ok) throw new Error("Failed to update status");

            // Optimistic update
            if (isPendingFilter && newStatus) {
                // If it becomes checked in pending view, remove it
                setCandidates(candidates.filter(c => c.applicationId !== appId && c.id !== appId));
                // Decrease pending count
                setStats(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1) }));
            } else {
                setCandidates(candidates.map(c => 
                    (c.applicationId === appId || c.id === appId) ? { ...c, isChecked: newStatus } : c
                ));
                // Adjust pending count if in jobId view
                if (jobId) {
                    setStats(prev => ({ 
                        ...prev, 
                        pendingCount: newStatus ? Math.max(0, prev.pendingCount - 1) : prev.pendingCount + 1 
                    }));
                }
            }
        } catch (err) {
            console.error("Error toggling status:", err);
            alert("Failed to update application status");
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(candidates.map(c => c.applicationId || c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDeleteClick = (id) => {
        setCandidateToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!candidateToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/candidates/${candidateToDelete}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete candidate");

            setCandidates(candidates.filter(c => c.id !== candidateToDelete));
            setSelectedIds(selectedIds.filter(sid => sid !== candidateToDelete));
            setIsDeleteModalOpen(false);
            setCandidateToDelete(null);
        } catch (err) {
            console.error("Error deleting candidate:", err);
            alert("Failed to delete candidate");
        }
    };

    const filteredCandidates = candidates
        .filter(c => {
            // Search
            const candidateName = c.name || "";
            const candidateEmail = c.email || "";
            const matchesSearch = candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (!matchesSearch) return false;

            // Filters
            if (filters.experience.length > 0 && !filters.experience.includes(c.experienceLevel)) return false;
            if (filters.gender.length > 0 && !filters.gender.map(g => g.toLowerCase()).includes(c.gender.toLowerCase())) return false;
            if (c.progress < filters.progress) return false;
            if (filters.education.length > 0 && !filters.education.includes(c.education)) return false;
            // jobTags is a dummy for now as it relies on job-level metadata we don't fully track here yet

            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name-asc": return a.name.localeCompare(b.name);
                case "name-desc": return b.name.localeCompare(a.name);
                case "date-newest": return new Date(b.appliedAt) - new Date(a.appliedAt);
                case "date-oldest": return new Date(a.appliedAt) - new Date(b.appliedAt);
                case "gender-m-f": return b.gender.toLowerCase().localeCompare(a.gender.toLowerCase());
                case "gender-f-m": return a.gender.toLowerCase().localeCompare(b.gender.toLowerCase());
                case "exp-high-low": {
                    const order = { "senior": 3, "mid": 2, "entry": 1, "fresher": 0 };
                    return (order[b.experienceLevel] || 0) - (order[a.experienceLevel] || 0);
                }
                case "exp-low-high": {
                    const order = { "senior": 3, "mid": 2, "entry": 1, "fresher": 0 };
                    return (order[a.experienceLevel] || 0) - (order[b.experienceLevel] || 0);
                }
                default: return 0;
            }
        });

    const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
    const paginatedCandidates = filteredCandidates.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-white p-8 min-h-[90vh]">
            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isPendingFilter ? "Pending candidates" : jobId ? "All candidates" : isSignupPage ? "Signup candidates" : "Job applicants"}
                    </h1>
                    {jobId && (
                        <div className="flex gap-4 text-sm font-medium">
                            <span className="text-gray-500">Total: <span className="text-gray-900">{stats.totalCount}</span></span>
                            <span className="text-gray-500">Pending: <span className="text-red-500">{stats.pendingCount}</span></span>
                        </div>
                    )}
                </div>
                <div className="w-full md:w-auto text-right">
                    <button
                        onClick={() => setSelectedIds(candidates.map(c => c.id))}
                        className="text-[#FFB300] font-semibold hover:underline flex items-center justify-end gap-1 text-sm cursor-pointer"
                    >
                        Select all <span className="text-[#FFB300]">→</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for jobs or candidates"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] text-gray-600 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto justify-end relative">
                    <button 
                        onClick={() => {
                            setShowFilters(!showFilters);
                            setShowSort(false);
                        }}
                        className={`flex items-center gap-2 px-6 py-2 border rounded-lg transition shadow-sm text-sm font-medium ${showFilters ? 'bg-gray-100 border-[#FFB300] text-[#FFB300]' : 'border-black hover:bg-gray-50 text-black'}`}
                    >
                        Filter <Filter size={14} />
                    </button>
                    {showFilters && <FilterDropdown filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />}

                    <button 
                        onClick={() => {
                            setShowSort(!showSort);
                            setShowFilters(false);
                        }}
                        className={`flex items-center gap-2 px-6 py-2 border rounded-lg transition shadow-sm text-sm font-medium ${showSort ? 'bg-gray-100 border-[#FFB300] text-[#FFB300]' : 'border-black hover:bg-gray-50 text-black'}`}
                    >
                        Sort <ArrowUpDown size={14} />
                    </button>
                    {showSort && <SortDropdown sortBy={sortBy} setSortBy={setSortBy} onClose={() => setShowSort(false)} />}
                </div>
            </div>

            {/* Selection Status */}
            {selectedIds.length > 0 && (
                <div className="mb-4 text-sm text-gray-600 flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <span>Selected <span className="font-bold text-[#FFB300]">{selectedIds.length}</span> items</span>
                    {hasPermission(PERM_DELETE) && (
                        <button className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1">
                            Delete items <span className="text-lg">→</span>
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                                <th className="p-4 w-[50px] text-left"></th> {/* Checkbox Column */}
                                <th className="p-4 min-w-[150px] font-normal text-center">Applicants Name</th>
                                <th className="p-4 font-normal text-center">Job role</th>
                                <th className="p-4 font-normal text-center">Phone Number</th>
                                <th className="p-4 font-normal text-center">Email</th>
                                <th className="p-4 font-normal text-center">Gender</th>
                                <th className="p-4 font-normal text-center">Resume</th>
                                <th className="p-4 font-normal text-center">Action</th>
                                <th className="p-4 font-normal text-center">{jobId ? "Status" : "Progress Bar"}</th>
                            </tr>
                        </thead>
                        <tbody className="text-black text-sm font-medium">
                            {loading ? (
                                <tr><td colSpan="9" className="p-10 text-center text-gray-500">Loading candidates...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="9" className="p-10 text-center text-red-500 font-medium">Error: {error}</td></tr>
                            ) : filteredCandidates.length === 0 ? (
                                <tr><td colSpan="9" className="p-10 text-center text-gray-500">No candidates found</td></tr>
                            ) : (
                                paginatedCandidates.map((candidate) => (
                                    <tr key={candidate.applicationId || candidate.id} className="border-b border-gray-200 hover:bg-yellow-50/10 transition group">
                                        <td className="p-4 text-left">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-400 text-[#FFB300] focus:ring-[#FFB300] cursor-pointer"
                                                checked={selectedIds.includes(candidate.applicationId || candidate.id)}
                                                onChange={() => handleSelectOne(candidate.applicationId || candidate.id)}
                                            />
                                        </td>
                                        <td className="p-4 text-gray-900 font-semibold text-center">{candidate.name}</td>
                                        <td className="p-4 text-gray-800 text-center">{candidate.role}</td>
                                        <td className="p-4 text-gray-800 font-medium text-center">{candidate.phone}</td>
                                        <td className="p-4 text-gray-800 text-center">{candidate.email}</td>
                                        <td className="p-4 text-gray-800 text-center">{candidate.gender}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {candidate.resume && hasPermission(PERM_RESUME) ? (
                                                    <a href={candidate.resume} target="_blank" rel="noopener noreferrer"
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition text-gray-700">
                                                        <FileText size={18} />
                                                    </a>
                                                ) : (
                                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-300 cursor-not-allowed">
                                                        <FileText size={18} />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                {hasPermission(PERM_VIEW_DETAILS) && (
                                                    <button
                                                        onClick={() => navigate(`/admin/candidates/${candidate.id}`)}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition"
                                                        title="View"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                )}
                                                {hasPermission(PERM_DELETE) && (
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded hover:bg-red-200 transition"
                                                        title="Delete"
                                                        onClick={() => handleDeleteClick(candidate.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {jobId ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Toggle 
                                                            checked={candidate.isChecked} 
                                                            onChange={() => handleToggleCheck(candidate)}
                                                            disabled={isPendingFilter && candidate.isChecked}
                                                        />
                                                        <span className={`text-[10px] font-bold ${candidate.isChecked ? 'text-green-600' : 'text-gray-400'}`}>
                                                            {candidate.isChecked ? 'Checked' : 'Unchecked'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <CircularProgress percentage={candidate.progress || 0} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={filteredCandidates.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
            {/* Delete Modal */}
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete candidates"
                message="Sure you want to delete"
            />
        </div>
    );
};

export default AdminApplicants;
