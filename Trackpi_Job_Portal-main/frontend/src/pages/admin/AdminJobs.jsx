import { useState, useEffect } from "react";
import { Edit, Eye, Search, ToggleLeft, ToggleRight, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import { API_URL } from "../../config";
import Pagination from "../../components/admin/Pagination";


const AdminJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchJobs();
    }, []);

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/jobs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("Session expired or unauthorized. Please login as Admin.");
                localStorage.removeItem("token");
                navigate("/admin/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // Filter jobs based on search query
    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Generic function to update job status
    const updateJobStatus = async (id, newStatus) => {
        // Optimistic update
        const originalJobs = [...jobs];
        setJobs(jobs.map(job => job._id === id ? { ...job, status: newStatus } : job));

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/api/jobs/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Error updating job status:", error);
            // Revert changes on error
            setJobs(originalJobs);
            alert("Failed to update job status");
        }
    };

    // Toggle Status (Open/Closed)
    const handleStatusChange = (newStatus, id) => {
        const mappedStatus = newStatus === "Open" ? "new" : "closed";
        updateJobStatus(id, mappedStatus);
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div className="relative w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for jobs or candidates"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {hasPermission(PERMISSIONS.JOBS_POST) && (
                    <button
                        onClick={() => window.location.href = "/admin/jobs/post"}
                        className="bg-[#FFB300] hover:bg-[#ffca2c] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm text-black">
                        Post jobs
                    </button>
                )}
            </div>

            <h2 className="text-xl font-bold mb-6 text-gray-800">Jobs</h2>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                                <th className="p-4 pl-6">Job title</th>
                                <th className="p-4">Posted date</th>
                                <th className="p-4">Applying candidates</th>
                                <th className="p-4">Job status</th>
                                <th className="p-4">New/Urgent</th>
                                <th className="p-4 pr-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">Loading jobs...</td>
                                </tr>
                            ) : filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No jobs found.</td>
                                </tr>
                            ) : (
                                paginatedJobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                        {/* Job Title */}
                                        <td className="p-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 text-sm">{job.title}</span>
                                                <span className="text-xs text-gray-500 mt-1">{job.company},<br /> {job.location},</span>
                                            </div>
                                        </td>

                                        {/* Posted Date */}
                                        <td className="p-4 text-sm text-gray-700">
                                            {new Date(job.createdAt).toLocaleDateString('en-GB')}
                                        </td>

                                        {/* Applying Candidates */}
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <div 
                                                    onClick={() => navigate(`/admin/candidates/applicants/${job._id}`)}
                                                    className="flex flex-col items-center cursor-pointer group/all"
                                                >
                                                    <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded min-w-[60px] justify-between group-hover/all:bg-[#FFB300] transition-colors">
                                                        <Users size={14} className="text-gray-600 group-hover/all:text-white" />
                                                        <span className="text-xs font-bold text-gray-800 group-hover/all:text-white">{job.applicantsCount || 0}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 mt-1 group-hover/all:text-[#FFB300] font-medium">All</span>
                                                </div>
                                                <div 
                                                    onClick={() => navigate(`/admin/candidates/applicants/${job._id}?filter=pending`)}
                                                    className="flex flex-col items-center ml-2 cursor-pointer group/pending"
                                                >
                                                    <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded min-w-[60px] justify-between group-hover/pending:bg-red-500 transition-colors">
                                                        <FileText size={14} className="text-gray-600 group-hover/pending:text-white" />
                                                        <span className="text-xs font-bold text-gray-800 group-hover/pending:text-white">{job.pendingApplicantsCount || 0}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 mt-1 group-hover/pending:text-red-500 font-medium">Pending</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Job Status - Dropdown */}
                                        <td className="p-4">
                                            <div className="relative">
                                                <button
                                                    disabled={!hasPermission(PERMISSIONS.JOBS_UPDATE_STATUS)} // Disable if no permission
                                                    onClick={() => setOpenDropdownId(openDropdownId === job._id ? null : job._id)}
                                                    className={`flex items-center justify-between w-28 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 transition-colors ${hasPermission(PERMISSIONS.JOBS_UPDATE_STATUS) ? 'hover:border-gray-400 focus:outline-none cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${job.status !== 'closed' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                        <span>{job.status !== 'closed' ? 'Open' : 'Closed'}</span>
                                                    </div>
                                                    {hasPermission(PERMISSIONS.JOBS_UPDATE_STATUS) && (
                                                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdownId === job._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>

                                                {openDropdownId === job._id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setOpenDropdownId(null)}
                                                        ></div>
                                                        <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                                                            <button
                                                                onClick={() => {
                                                                    handleStatusChange("Open", job._id);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                                                            >
                                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                                Open
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleStatusChange("Closed", job._id);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                                                            >
                                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                                Closed
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                        {/* New/Urgent - Toggle */}
                                        <td className="p-4">
                                            <button
                                                disabled={job.status === 'closed' || !hasPermission(PERMISSIONS.JOBS_NEW_URGENT_JOB)}
                                                onClick={() => {
                                                    const newStatus = job.status === 'urgent' ? 'new' : 'urgent';
                                                    updateJobStatus(job._id, newStatus);
                                                }}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${job.status === 'urgent' ? 'bg-red-500' : 'bg-green-500'} ${job.status === 'closed' || !hasPermission(PERMISSIONS.JOBS_NEW_URGENT_JOB) ? 'opacity-50 cursor-not-allowed bg-gray-400' : ''}`}
                                            >
                                                <span className="sr-only">Toggle Urgent</span>
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.status === 'urgent' ? 'translate-x-6' : 'translate-x-1'}`}
                                                />
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                {hasPermission(PERMISSIONS.JOBS_VIEW_DETAILS) && (
                                                    <button
                                                        onClick={() => navigate(`/admin/jobs/view/${job._id}`)}
                                                        className="p-1.5 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition">
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {hasPermission(PERMISSIONS.JOBS_EDIT) && (
                                                    <button
                                                        onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                                                        className="p-1.5 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition">
                                                        <Edit size={16} />
                                                    </button>
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
                    totalResults={filteredJobs.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
        </div>
    );
};

export default AdminJobs;
