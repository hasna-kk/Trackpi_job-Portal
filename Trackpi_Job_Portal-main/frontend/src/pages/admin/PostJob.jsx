import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

const PostJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = !!id && location.pathname.includes("/edit/");
    const isViewMode = !!id && location.pathname.includes("/view/");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        workMode: "On-site",
        gender: "Both",
        education: "Any",
        salaryMin: "10000",
        salaryMax: "30000",
        jobType: "Full time",
        vacancies: "1",
        workingDaysStart: "Monday",
        workingDaysEnd: "Friday",
        workingHoursStart: "09",
        workingHoursStartPeriod: "Am",
        workingHoursEnd: "06",
        workingHoursEndPeriod: "Pm",
        experience: "",
        description: "",
        skills: "",
        eligibility: "",
        benefits: "",
        incentive: "",
        responsibilities: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/jobs/${id}`);
            const job = response.data;

            // Helper to safely split strings
            const safeSplit = (str, separator) => str ? str.split(separator) : ["", ""];

            const [salaryMin, salaryMax] = safeSplit(job.salary, " - ");
            const [workingDaysStart, workingDaysEnd] = safeSplit(job.workingDays, " to ");

            // Parse working hours
            const [startStr, endStr] = safeSplit(job.workingHours, " - ");
            const [workingHoursStart, workingHoursStartPeriod] = startStr ? startStr.trim().split(" ") : ["09", "Am"];
            const [workingHoursEnd, workingHoursEndPeriod] = endStr ? endStr.trim().split(" ") : ["06", "Pm"];

            setFormData({
                title: job.title || "",
                company: job.company || "",
                location: job.location || "",
                workMode: job.workMode || "On-site",
                gender: job.gender || "Both",
                education: job.education || "Any",
                salaryMin: salaryMin || "10000",
                salaryMax: salaryMax || "30000",
                jobType: job.jobType || "Full time",
                vacancies: String(job.vacancies || "1"),
                workingDaysStart: workingDaysStart || "Monday",
                workingDaysEnd: workingDaysEnd || "Friday",
                workingHoursStart: workingHoursStart || "09",
                workingHoursStartPeriod: workingHoursStartPeriod || "Am",
                workingHoursEnd: workingHoursEnd || "06",
                workingHoursEndPeriod: workingHoursEndPeriod || "Pm",
                experience: job.experience || "",
                description: job.description || "",
                skills: job.skills || "",
                eligibility: job.eligibility || "",
                benefits: job.benefits || "",
                incentive: job.incentive || "",
                responsibilities: job.responsibilities || "",
            });
        } catch (error) {
            console.error("Error fetching job details:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            // Construct payload to match backend schema
            const payload = {
                title: formData.title,
                company: formData.company,
                location: formData.location,
                workMode: formData.workMode,
                gender: formData.gender,
                education: formData.education,
                salary: `${formData.salaryMin} - ${formData.salaryMax}`,
                jobType: formData.jobType,
                vacancies: parseInt(formData.vacancies),
                workingDays: `${formData.workingDaysStart} to ${formData.workingDaysEnd}`,
                workingHours: `${formData.workingHoursStart} ${formData.workingHoursStartPeriod} - ${formData.workingHoursEnd} ${formData.workingHoursEndPeriod}`,
                experience: formData.experience,
                description: formData.description,
                skills: formData.skills,
                eligibility: formData.eligibility,
                benefits: formData.benefits,
                incentive: formData.incentive,
                responsibilities: formData.responsibilities,
                status: isEditMode ? undefined : "new",
            };

            if (isEditMode) {
                await axios.put(`${API_URL}/api/jobs/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${API_URL}/api/jobs`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            // Redirect back to jobs list
            navigate("/admin/jobs");
        } catch (error) {
            console.error("Error posting job:", error);
            alert("Failed to post job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen font-sans">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 text-black font-bold">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold flex-1 text-center mr-10">{isViewMode ? "View Job" : isEditMode ? "Edit Job" : "Post jobs"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                {/* Job Title */}
                <div className="border-b border-gray-300 pb-2">
                    <label className="block text-sm font-bold text-gray-800 mb-1">Job title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="Type job title"
                        className="w-full focus:outline-none text-sm text-gray-600 placeholder-gray-300 disabled:bg-white"
                        required
                    />
                </div>

                {/* Organization Name */}
                <div className="border-b border-gray-300 pb-2">
                    <label className="block text-sm font-bold text-gray-800 mb-1">Organization name</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="Type company name and location"
                        className="w-full focus:outline-none text-sm text-gray-600 placeholder-gray-300 disabled:bg-white"
                        required
                    />
                </div>

                {/* Organization Location */}
                <div className="border-b border-gray-300 pb-2">
                    <label className="block text-sm font-bold text-gray-800 mb-1">Organization Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="Enter location"
                        className="w-full focus:outline-none text-sm text-gray-600 placeholder-gray-300 disabled:bg-white"
                        required
                    />
                </div>

                {/* Job Mode */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Job mode</label>
                    <div className="flex gap-6 text-sm">
                        {["On-site", "Remote", "Work from home", "Hybrid", "Field work"].map((mode) => (
                            <label key={mode} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="workMode"
                                    value={mode}
                                    checked={formData.workMode === mode}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`w-4 h-4 text-[#FFB300] focus:ring-[#FFB300] border-gray-300 ${formData.workMode === mode ? 'accent-[#FFB300]' : ''}`}
                                />
                                <span className="text-gray-600">{mode}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Gender</label>
                    <div className="flex gap-20 text-sm">
                        {["Male", "Female", "Both"].map((g) => (
                            <label key={g} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value={g}
                                    checked={formData.gender === g}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`w-4 h-4 text-[#FFB300] focus:ring-[#FFB300] border-gray-300 ${formData.gender === g ? 'accent-[#FFB300]' : ''}`}
                                />
                                <span className="text-gray-600">{g}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Education</label>
                    <div className="flex gap-10 text-sm">
                        {["SSLC", "Plus 2", "Graduation", "Post Graduation", "Any"].map((edu) => (
                            <label key={edu} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="education"
                                    value={edu}
                                    checked={formData.education === edu}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`w-4 h-4 text-[#FFB300] focus:ring-[#FFB300] border-gray-300 ${formData.education === edu ? 'accent-[#FFB300]' : ''}`}
                                />
                                <span className="text-gray-600">{edu}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Salary Scale */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Salary scale</label>
                    <div className="flex items-center gap-4">
                        <select
                            name="salaryMin"
                            value={formData.salaryMin}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="border border-gray-300 rounded px-3 py-1.5 w-32 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                        >
                            <option value="10000">10000</option>
                            <option value="15000">15000</option>
                            <option value="20000">20000</option>
                            <option value="30000">30000</option>
                            <option value="50000">50000</option>
                        </select>
                        <span className="text-sm text-gray-600">to</span>
                        <select
                            name="salaryMax"
                            value={formData.salaryMax}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="border border-gray-300 rounded px-3 py-1.5 w-32 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                        >
                            <option value="15000">15000</option>
                            <option value="20000">20000</option>
                            <option value="30000">30000</option>
                            <option value="50000">50000</option>
                            <option value="100000">100000</option>
                        </select>
                    </div>
                </div>

                {/* Job Type */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Job type</label>
                    <div className="flex gap-10 text-sm">
                        {["Full time", "Part time"].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="jobType"
                                    value={type}
                                    checked={formData.jobType === type}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`w-4 h-4 text-[#FFB300] focus:ring-[#FFB300] border-gray-300 ${formData.jobType === type ? 'accent-[#FFB300]' : ''}`}
                                />
                                <span className="text-gray-600">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Total Vacancies */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Total vacancies</label>
                    <select
                        name="vacancies"
                        value={formData.vacancies}
                        onChange={handleChange}
                        disabled={isViewMode}
                        className="border border-gray-300 rounded px-3 py-1.5 w-48 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                    >
                        <option value="" disabled>Number of vacancies</option>
                        {[...Array(20).keys()].map(i => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>

                {/* Working Days */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Working days</label>
                    <div className="flex items-center gap-4">
                        <select
                            name="workingDaysStart"
                            value={formData.workingDaysStart}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="border border-gray-300 rounded px-3 py-1.5 w-32 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                        >
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-600">to</span>
                        <select
                            name="workingDaysEnd"
                            value={formData.workingDaysEnd}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="border border-gray-300 rounded px-3 py-1.5 w-32 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                        >
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Working Hours */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Working hours</label>
                    <div className="flex items-center gap-2">
                        <select
                            name="workingHoursStart"
                            value={formData.workingHoursStart}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                        >
                            {[...Array(12).keys()].map(i => (
                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                            ))}
                        </select>
                        <select
                            name="workingHoursStartPeriod"
                            value={formData.workingHoursStartPeriod}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                        >
                            <option value="Am">Am</option>
                            <option value="Pm">Pm</option>
                        </select>
                        <span className="text-sm text-gray-600 mx-2">to</span>
                        <select
                            name="workingHoursEnd"
                            value={formData.workingHoursEnd}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                        >
                            {[...Array(12).keys()].map(i => (
                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                            ))}
                        </select>
                        <select
                            name="workingHoursEndPeriod"
                            value={formData.workingHoursEndPeriod}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-gray-50"
                        >
                            <option value="Am">Am</option>
                            <option value="Pm">Pm</option>
                        </select>
                    </div>
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Experience</label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="Fresher"
                        className="w-48 border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] disabled:bg-white"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="Description about job"
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] resize-none disabled:bg-white"
                    ></textarea>
                </div>

                {/* Key Skills */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Key skills</label>
                    <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="please type key skills"
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] resize-none disabled:bg-white"
                    ></textarea>
                </div>

                {/* Eligibility Criteria */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Eligibility criteria</label>
                    <textarea
                        name="eligibility"
                        value={formData.eligibility}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="please type skills , eligibility criteria"
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] resize-none disabled:bg-white"
                    ></textarea>
                </div>

                {/* Compensation & Benefits */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Compensation & Benefits</label>
                    <textarea
                        name="benefits"
                        value={formData.benefits}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="Type compensation and benefits"
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] resize-none disabled:bg-white"
                    ></textarea>
                </div>

                {/* Incentive */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Incentive</label>
                    <textarea
                        name="incentive"
                        value={formData.incentive}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="Type incentive"
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] resize-none disabled:bg-white"
                    ></textarea>
                </div>

                {/* Key Responsibilities */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Key responsibilities</label>
                    <textarea
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        disabled={isViewMode}
                        placeholder="Type key responsibilities"
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#FFB300] resize-none disabled:bg-white"
                    ></textarea>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 pb-10 mt-6">
                    {isViewMode ? (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate(`/admin/jobs/edit/${id}`)}
                                className="bg-[#FFB300] hover:bg-[#ffca2c] text-black font-semibold px-8 py-2 rounded shadow-sm transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-white border border-gray-300 text-black font-semibold px-8 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#FFB300] hover:bg-[#ffca2c] text-black font-semibold px-8 py-2 rounded shadow-sm transition-colors disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-white border border-gray-300 text-black font-semibold px-8 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PostJob;
