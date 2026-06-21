import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { applyForJob } from "../../jobService";
import trackpiLogo from "../../assets/badges/trackpi-striped.png";
import config from "../../config";
import { Country } from "country-state-city";

const ApplyJobForm = ({ jobId, job, onCancel, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneCode: "+91",
        phone: "",
        experience: "",
        portfolio: "",
    });

    const [profile, setProfile] = useState(null);
    const [useProfileResume, setUseProfileResume] = useState(false);

    const [countries] = useState(() => Country.getAllCountries());
    const sortedCountries = React.useMemo(() => {
        return [...countries].sort((a, b) => b.phonecode.length - a.phonecode.length);
    }, [countries]);

    // Load user data and profile on mount
    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    setFormData(prev => ({
                        ...prev,
                        name: user.name || "",
                        email: user.email || ""
                    }));
                } catch (e) {
                    console.error("Error parsing user data", e);
                }
            }

            if (token) {
                try {
                    const res = await axios.get(`${config.API_URL}/api/profile/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success && res.data.profile) {
                        const p = res.data.profile;
                        setProfile(p);
                        
                        let extractedCode = "+91";
                        let extractedPhone = "";

                        if (p.phone) {
                            const rawPhone = p.phone;

                            // Find the best matching country code (longest first to avoid +1 vs +1242 issues)
                            const matchedCountry = sortedCountries.find(c => rawPhone.startsWith(`+${c.phonecode}`));
                            
                            if (matchedCountry) {
                                extractedCode = `+${matchedCountry.phonecode}`;
                                // Remove prefix and take remaining digits
                                extractedPhone = rawPhone.slice(extractedCode.length).replace(/\D/g, '').slice(0, 10);
                            } else {
                                // Fallback: Take last 10 digits as the subscriber number
                                const digits = rawPhone.replace(/\D/g, '');
                                extractedPhone = digits.slice(-10);
                            }
                        }

                        setFormData(prev => ({
                            ...prev,
                            name: p.fullName || prev.name,
                            email: p.email || prev.email,
                            phoneCode: extractedCode,
                            phone: extractedPhone,
                        }));
                        if (p.resumeUrl) {
                            setUseProfileResume(true);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching profile", err);
                }
            }
        };

        fetchUserData();
    }, []);

    const [errors, setErrors] = useState({});
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [fileError, setFileError] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (error && formRef.current) {
            formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const newErrors = { ...errors };

        if (name === 'name') {
            if (!/^[A-Za-z\s]*$/.test(value)) {
                newErrors.name = "Name should contain only alphabets";
            } else if (!value.trim()) {
                newErrors.name = "Name is required";
            } else {
                delete newErrors.name;
            }
        }

        if (name === 'phone') {
            const cleanValue = value.replace(/\D/g, '').slice(0, 10);
            if (!cleanValue && value) {
                newErrors.phone = "Phone number must contain only digits";
            } else if (cleanValue && cleanValue.length < 5) {
                newErrors.phone = "Please enter a valid phone number";
            } else if (!cleanValue) {
                newErrors.phone = "Phone number is required";
            } else {
                delete newErrors.phone;
            }
            setErrors(newErrors);
            setFormData(prev => ({ ...prev, [name]: cleanValue }));
            return; // Handle separately due to sanitization
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.trim() && !emailRegex.test(value)) {
                newErrors.email = "Please enter a valid email address";
            } else if (!value.trim()) {
                newErrors.email = "Email is required";
            } else {
                delete newErrors.email;
            }
        }

        setErrors(newErrors);
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                setFileError("File size exceeds 2MB limit.");
                setResume(null);
                e.target.value = null; // Reset input
                return;
            }
            const validTypes = ['application/pdf'];
            if (!validTypes.includes(file.type)) {
                setFileError("Invalid format. Please upload PDF only.");
                setResume(null);
                e.target.value = null;
                return;
            }
            setFileError(null);
            setResume(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Instead of merging, we validate everything fresh
        const currentErrors = {};
        if (!formData.name.trim()) {
            currentErrors.name = "Name is required";
        } else if (!/^[A-Za-z\s]*$/.test(formData.name)) {
            currentErrors.name = "Name should contain only alphabets";
        }

        if (!formData.email.trim()) {
            currentErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            currentErrors.email = "Please enter a valid email address";
        }

        if (!formData.phone.trim()) {
            currentErrors.phone = "Phone number is required";
        } else if (!/^\d*$/.test(formData.phone)) {
            currentErrors.phone = "Phone number must contain only digits";
        } else if (formData.phone.length < 5) {
            currentErrors.phone = "Please enter a valid phone number";
        }

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            const fieldNames = { name: "Full Name", email: "Email Address", phone: "Phone Number" };
            const errorFields = Object.keys(currentErrors).map(key => fieldNames[key]).join(', ');
            setError(`Please provide valid data for: ${errorFields}`);
            return;
        }

        setLoading(true);
        setMessage(null);

        if (!resume && !useProfileResume) {
            setError("Please upload your resume.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", `${formData.phoneCode}${formData.phone}`);
        data.append("experience", formData.experience);
        data.append("portfolio", formData.portfolio);

        // Append User ID if available
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user._id || user.id) {
                    data.append("userId", user._id || user.id);
                }
            } catch (e) {
                // Ignore if parse fails
            }
        }

        if (resume) {
            data.append("resume", resume);
        }

        try {
            // If the user wants to test UI only, we can mock success if needed
            // const res = await applyForJob(jobId, data);

            // For now proceeding with real call
            const res = await applyForJob(jobId, data);

            if (res.success || res.application) {
                setMessage("Application submitted successfully!");
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                setError(res.message || res.error || "Failed to submit application.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (message) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <i className="ri-check-line text-4xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Success!</h3>
                <p className="text-gray-600 mb-6">Your application for {job?.title} has been sent.</p>
            </div>
        );
    }

    return (
        // Wrap everything in the modal overlay inside the component
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-backgroundFade"
            onClick={(e) => {
                e.stopPropagation();
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            <div
                className="bg-white rounded-[18px] shadow-2xl border-[0.5px] border-[#FFB300] w-full max-w-[957px] h-[95vh] md:h-full max-h-[743px] overflow-hidden flex flex-col relative animate-fadeIn font-lato text-black p-10 pt-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Spheres */}
                <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),10px_10px_20px_rgba(0,0,0,0.1)] z-0 pointer-events-none opacity-80"></div>
                <div className="absolute -bottom-10 -left-10 w-[150px] h-[150px] bg-gradient-to-tr from-white via-gray-100 to-gray-300 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),10px_10px_20px_rgba(0,0,0,0.1)] z-0 pointer-events-none opacity-80"></div>

                {/* Close Button */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={onCancel}
                        className="w-10 h-10 flex items-center justify-center text-2xl font-bold hover:scale-110 transition-transform"
                    >
                        ✕
                    </button>
                </div>

                {/* Header: Logo and Job Info */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <img src={trackpiLogo} alt="Logo" className="w-16 object-contain" />
                    <div className="flex flex-col items-start text-left">
                        <h2 className="text-[15px] font-bold">{job?.company || "Company Name"}</h2>
                        <p className="text-gray-500 text-[12px]">{job?.location || "Location"}</p>
                        <h3 className="text-[13px] font-bold leading-tight">{job?.title || "Job Title"}</h3>
                    </div>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 space-y-8 flex-grow overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                            <i className="ri-error-warning-fill"></i>
                            {error}
                        </div>
                    )}

                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-[20px] font-bold">Personal Information</h2>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-medium text-gray-700">Full Name<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full text-[14px] font-bold border-b outline-none py-1 bg-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-800 focus:border-black'}`}
                                placeholder="Paul Walker"
                            />
                            {errors.name && <p className="text-red-500 text-[12px]">{errors.name}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-medium text-gray-700">Email Address<span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full text-[14px] font-bold border-b outline-none py-1 bg-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-800 focus:border-black'}`}
                                placeholder="paulwalker233@gmail.com"
                            />
                            {errors.email && <p className="text-red-500 text-[12px]">{errors.email}</p>}
                        </div>

                        {/* Phone Number Box */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-medium text-gray-700">Phone Number <span className="text-gray-500 font-normal">(With country code)</span></label>
                            <div className={`flex items-center border rounded-[6px] bg-white h-[44px] ${errors.phone ? 'border-red-500' : 'border-gray-400'}`}>
                                <div className="flex items-center gap-2 px-4 border-r border-gray-400 h-full cursor-pointer relative">
                                    <span className="text-[14px] font-bold text-black">{formData.phoneCode}</span>
                                    <i className="ri-arrow-down-s-fill text-black"></i>
                                    <select 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        value={formData.phoneCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phoneCode: e.target.value }))}
                                    >
                                        {countries.map((c, idx) => (
                                            <option key={`${c.isoCode}-${idx}`} value={`+${c.phonecode}`}>
                                                {c.name} (+{c.phonecode})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="flex-grow px-4 text-[14px] font-bold text-black outline-none bg-transparent"
                                    placeholder="867392385578"
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-[12px]">{errors.phone}</p>}
                        </div>
                    </div>

                    {/* Job-Related Details Section */}
                    <div className="space-y-6">
                        <h2 className="text-[20px] font-bold">Job-Related Details</h2>

                        {/* Experience Underlined */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-medium text-gray-700">Experience</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full text-[14px] font-bold border-b border-gray-800 outline-none py-1 bg-transparent"
                                placeholder="I am fresher"
                            />
                        </div>

                        {/* Resume / CV Upload */}
                        <div className="space-y-4">
                            <label className="text-[14px] font-bold">Resume / CV Upload</label>

                            {profile?.resumeUrl && (
                                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex-grow">
                                        <p className="text-[12px] font-bold text-green-700">Profile Resume Found</p>
                                        <p className="text-[11px] text-green-600">Using resume from profile</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setUseProfileResume(!useProfileResume)}
                                        className={`text-[11px] font-bold px-3 py-1.5 rounded border transition-all ${useProfileResume ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300'}`}
                                    >
                                        {useProfileResume ? "Upload New" : "Use Profile Resume"}
                                    </button>
                                </div>
                            )}

                            {!useProfileResume && (
                                <div className="animate-fadeIn">
                                    <div className="flex items-center gap-4">
                                        <div className="relative px-4 py-2 bg-[#F3F3F3] border border-gray-400 rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors shadow-sm">
                                            <span className="text-[13px] font-medium text-black">Choose file</span>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <span className="text-[12px] text-gray-500 font-medium truncate">{resume ? resume.name : ""}</span>
                                    </div>
                                    <p className="text-gray-500 text-[11px] mt-2 font-medium">PDF/DOC, file size limit</p>
                                    {fileError && (
                                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                                            <i className="ri-error-warning-line"></i> {fileError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Portfolio Box */}
                        <div className="space-y-3">
                            <label className="text-[14px] font-bold">Portfolio / Work samples Link</label>
                            <div className="bg-[#F3F3F3] border border-gray-400 rounded-[4px] p-3 shadow-inner">
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none text-black font-bold text-[14px] placeholder:font-normal"
                                    placeholder="www.behancepaulwalker.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons Centered */}
                    <div className="flex items-center justify-center gap-8 pt-6 pb-2 relative z-10 shrink-0">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[180px] h-[48px] bg-gradient-to-r from-[#FFF5D1] via-[#FFD54F] to-[#FFB300] border border-gray-400 rounded-[10px] text-black font-bold text-[16px] shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center justify-center"
                        >
                            {loading ? <i className="ri-loader-4-line animate-spin text-xl"></i> : "Submit"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-[180px] h-[48px] bg-white border border-gray-800 rounded-[10px] text-black font-bold text-[16px] shadow-sm hover:bg-gray-50 hover:scale-105 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default ApplyJobForm;
