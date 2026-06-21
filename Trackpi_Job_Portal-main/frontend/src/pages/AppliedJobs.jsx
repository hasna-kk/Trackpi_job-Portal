import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import JobDetailsModal from '../components/home/JobDetailsModal';
import toast from 'react-hot-toast';

import logo from '../assets/logo.png';
import config from '../config';

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error("Please login to view applied jobs");
                    setLoading(false);
                    return;
                }

                const configAuth = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const res = await axios.get(`${config.API_URL}/api/applications/my-applications`, configAuth);
                if (res.data.success) {
                    setApplications(res.data.applications);
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
                // toast.error("Failed to fetch applied jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedJobs();
    }, []);

    // Helper to get badge color based on status
    const getStatusBadge = (status) => {
        // Mock status logic if not available in job
        if (status === 'urgent') return "bg-[#FF4F4F] text-white"; // Red for Urgent
        if (status === 'new') return "bg-[#4CAF50] text-white"; // Green for New
        return "hidden";
    };

    return (
        <div className="bg-[#F8F9FB] min-h-screen pb-20">
            <Navbar />

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-32">

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold text-gray-600">You haven't applied to any jobs yet.</h2>
                        <Link to="/jobs" className="mt-4 inline-block bg-[#FFB300] text-black px-6 py-2 rounded-full font-bold">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {applications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((app) => {
                            const job = app.jobId;
                            if (!job) return null; // Handle if job was deleted

                            return (
                                <div key={app._id} className="bg-white rounded-[32px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col items-start border border-gray-50 relative overflow-hidden w-[415px] h-[381px] shrink-0">

                                    {/* 1. Header: Logo, Info, Verified */}
                                    <div className="flex justify-between items-center w-full mb-6">
                                        <div className="flex items-center gap-3">
                                            {/* Company Logo - Natural Aspect Ratio */}
                                            <div className="w-14 h-8 flex items-center justify-center shrink-0">
                                                <img src={logo} alt={job.company} className="w-full h-full object-contain" />
                                            </div>

                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-[15px] text-gray-900 leading-tight truncate max-w-[130px]">{job.company}</h3>
                                                <p className="text-gray-400 text-[10px] font-medium leading-none mt-1">{job.location}</p>
                                            </div>
                                        </div>

                                        {/* Verified Badge - Pill Style */}
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#FF4D4D]/20 bg-[#FFF5F5] shrink-0 transform scale-[0.85] origin-right">
                                            <div className="w-4 h-4 rounded-full bg-[#FF4D4D] flex items-center justify-center shadow-sm">
                                                <i className="ri-check-line text-white text-[10px] font-bold"></i>
                                            </div>
                                            <span className="text-[9px] font-bold text-[#FF4D4D] uppercase tracking-wider">Verified Company</span>
                                        </div>
                                    </div>

                                    {/* 2. Job Title & Description */}
                                    <div className="mb-5">
                                        <h2 className="text-[17px] font-bold text-gray-900 mb-1.5 leading-tight">{job.title}</h2>
                                        <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 pr-2 font-medium">
                                            {job.description || "No description provided."}
                                        </p>
                                    </div>

                                    {/* 3. Tags row (Job Type, Education, Mode) */}
                                    <div className="flex items-center gap-4 mb-3.5 w-full">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                                            <i className="ri-briefcase-4-fill text-[#FFB300] text-xs"></i>
                                            Full time
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                                            <i className="ri-graduation-cap-fill text-[#FFB300] text-xs"></i>
                                            Any postgraduation
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                                            <i className="ri-home-4-fill text-[#FFB300] text-xs"></i>
                                            Work from home
                                        </div>
                                    </div>

                                    {/* 4. Details row (Gender, Salary, Experience) */}
                                    <div className="flex flex-col gap-2 w-full mb-auto pb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                                                <i className="ri-user-fill text-[#FFB300] text-xs"></i>
                                                Female
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                                                <i className="ri-money-dollar-circle-fill text-[#FFB300] text-xs"></i>
                                                35,000 rs - 40,000 rs
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                                            <i className="ri-time-fill text-[#FFB300] text-xs"></i>
                                            Minimum one year experience in sales
                                        </div>
                                    </div>

                                    {/* 5. Footer: WFH Badge, Applied Button, More details */}
                                    <div className="w-full">
                                        <div className="flex items-center justify-between mb-4">
                                            {/* Work From Home Pill */}
                                            <div className="flex items-center gap-2 border border-[#FFB300] rounded-full pl-4 pr-1 py-1 bg-white text-gray-700 text-[10px] font-bold shadow-[0_2px_8px_rgba(255,179,0,0.1)]">
                                                Work from home
                                                <div className="w-5 h-5 bg-[#FFB300] rounded-full flex items-center justify-center text-white">
                                                    <i className="ri-home-4-fill text-[10px]"></i>
                                                </div>
                                            </div>

                                            {/* Applied Button (Green) */}
                                            <button className="bg-[#4CAF50] text-white px-8 py-2.5 rounded-xl font-bold text-[11px] shadow-[0_4px_12px_rgba(76,175,80,0.2)] hover:bg-[#43A047] transition cursor-default">
                                                Applied
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between w-full h-8 px-0">
                                            {/* Status Badge (Urgent/New) - Ribbon Style */}
                                            <div className="flex-1 -ml-10 flex items-center h-full">
                                                {job.status === 'urgent' ? (
                                                    <div className="bg-gradient-to-r from-[#FF5252] to-[#FF8A80]/0 text-white text-[9px] font-bold px-10 py-1.5 rounded-r-full shadow-sm uppercase tracking-wider">
                                                        Urgent Hiring
                                                    </div>
                                                ) : job.status === 'new' ? (
                                                    <div className="bg-gradient-to-r from-[#4CAF50] to-[#81C784]/0 text-white text-[9px] font-bold px-10 py-1.5 rounded-r-full shadow-sm uppercase tracking-wider">
                                                        New
                                                    </div>
                                                ) : null}
                                            </div>

                                            <button
                                                onClick={() => setSelectedJobId(job._id)}
                                                className="text-gray-900 text-[10px] font-bold hover:underline flex items-center gap-1 group shrink-0"
                                            >
                                                More details
                                                <span className="group-hover:translate-x-1 transition-transform font-light text-base leading-none">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {applications.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <svg width="10" height="16" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1L2 10L11 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {Array.from({ length: Math.ceil(applications.length / itemsPerPage) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${currentPage === i + 1
                                    ? "bg-[#FFB300] text-black shadow-sm"
                                    : "bg-black text-white hover:bg-gray-800"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(Math.ceil(applications.length / itemsPerPage), p + 1))}
                            disabled={currentPage === Math.ceil(applications.length / itemsPerPage)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === Math.ceil(applications.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-black hover:bg-gray-100'}`}
                        >
                            <svg width="10" height="16" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L10 10L1 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {selectedJobId && (
                <JobDetailsModal
                    jobId={selectedJobId}
                    isApplied={true}
                    onClose={() => setSelectedJobId(null)}
                />
            )}
        </div>
    );
};

export default AppliedJobs;
