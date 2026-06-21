import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Country, State } from "country-state-city";
import LoadingIllustration from '../assets/illustrations/loading-illustration.png'; // Make sure this path is correct based on where we copied it
import { useNavigate } from "react-router-dom";
import step1Illustration from "../assets/profile/step1_illustration.png";
import Step1BasicInfo from "./create-profile/Step1BasicInfo";
import Step2Education from "./create-profile/Step2Education";
import Step3Experience from "./create-profile/Step3Experience";
import config from "../config";


const CreateProfile = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Check if profile already exists or cache exists
    useEffect(() => {
        const checkProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                // Check if profile exists and is completed without triggering a 404
                const res = await axios.get(`${config.API_URL}/api/profile/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.profileCompleted) {
                    navigate("/profile");
                }
                if (res.data.resumeUrl) {
                    setFormData(prev => ({
                        ...prev,
                        resumeUrl: res.data.resumeUrl,
                        resumeName: res.data.resumeUrl.split('/').pop()
                    }));
                }
            } catch (err) {
                console.error("Profile status check error:", err);
            }
        };

        checkProfile();

        // Restore cached form data if available
        const cachedData = localStorage.getItem("profileCreationCache");
        if (cachedData) {
            try {
                const parsedCache = JSON.parse(cachedData);
                if (parsedCache.formData) {
                    setFormData(prev => ({ ...prev, ...parsedCache.formData }));
                }
                if (parsedCache.primaryPhoneCode) {
                    setPrimaryPhoneCode(parsedCache.primaryPhoneCode);
                }
                if (parsedCache.altPhoneCode) {
                    setAltPhoneCode(parsedCache.altPhoneCode);
                }
                if (parsedCache.step) {
                    setStep(parsedCache.step);
                }
            } catch (e) {
                console.error("Failed to parse cached profile data", e);
            }
        }
    }, [navigate]);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        altPhone: "",
        email: "",

        // Location
        pincode: "",
        country: "",
        state: "",
        city: "",

        dob: "",
        gender: "",
        maritalStatus: "",
        workStatus: "", // 'fresher' | 'experienced'
        workExperiences: [], // list of experiences

        // Step 2 Fields
        languages: [], // [{name: '', proficiency: ''}]
        preferredLocations: ["", "", ""], // Allow up to 3 preferences
        willRelocate: null, // true/false
        preferredWorkMode: "", // 'onsite', 'remote', ...
        educationList: [], // [{degree: '', institution: '', year: ''}]

        // Step 3 Fields
        drivingLicenses: [], // ["two_wheeler", "four_wheeler"]
        expectedSalary: "",

        hasDrivingLicense: false, // Legacy boolean, keeping sync if needed or replacing usage
        hasTwoWheeler: null,
        hasLaptop: null,

        resumeUrl: "",
        resumeFile: null, // File object for upload
        resumeName: "",   // Display name
        profileImage: "",

        socialLinks: {
            linkedin: "",
            github: "",
            portfolio: "",
            twitter: ""
        }
    });

    // Country Code State
    const [primaryPhoneCode, setPrimaryPhoneCode] = useState("+91");
    const [altPhoneCode, setAltPhoneCode] = useState("+91");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("socialLinks.")) {
            const key = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [key]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };



    const prevStep = () => setStep(s => s - 1);

    const submitProfile = async () => {
        try {
            setLoading(true); // Start loading animation

            const token = localStorage.getItem("token");

            // Prepare payload
            const payload = { ...formData };

            if (typeof payload.skills === 'string') {
                payload.skills = payload.skills.split(",").map(s => s.trim()).filter(s => s);
            }

            // Append Country Codes to Phones
            payload.phone = `${primaryPhoneCode}${payload.phone}`;
            if (payload.altPhone) {
                payload.altPhone = `${altPhoneCode}${payload.altPhone}`;
            }

            // Convert Codes to Names for Backend (Moved from Step 1)
            const countryName = Country.getCountryByCode(formData.country)?.name || formData.country;
            const stateName = State.getStateByCodeAndCountry(formData.state, formData.country)?.name || formData.state;

            payload.country = countryName;
            payload.state = stateName;

            // Map Frontend Fields to Backend Schema
            payload.education = formData.educationList?.map(edu => ({
                degree: edu.level,
                institution: edu.university,
                year: edu.endYear, // Taking end year as main year
                domain: edu.domain,
                description: `${edu.course} (${edu.courseType})`
            })) || [];

            payload.workExperience = formData.workExperiences?.map(exp => ({
                jobTitle: exp.jobTitle,
                company: exp.company,
                startDate: exp.startDate,
                endDate: exp.endDate,
                description: exp.description
            })) || [];

            // Explicitly map Date of Birth
            if (payload.dob && !payload.dateOfBirth) {
                payload.dateOfBirth = payload.dob;
            }

            // Backend Safety Flag
            payload.isFinalSubmission = true;

            // Remove frontend-only list keys to keep payload clean
            delete payload.educationList;
            delete payload.workExperiences;
            delete payload.resumeFile; // Don't send file object in JSON JSON
            delete payload.resumeName;


            await axios.post(`${config.API_URL}/api/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // --- Resume Upload Logic ---
            if (formData.resumeFile) {
                try {
                    const resumeData = new FormData();
                    resumeData.append("resume", formData.resumeFile);
                    await axios.post(`${config.API_URL}/api/profile/resume`, resumeData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    });
                } catch (uploadErr) {
                    console.error("Resume upload failed", uploadErr);
                    // Strict handling: Toast and block navigation
                    toast.error("Profile saved successfully, but Resume upload failed. Please try uploading your resume again.");
                    setLoading(false);
                    return;
                }
            }
            // ---------------------------

            // Clear caching on successful submission
            localStorage.removeItem("profileCreationCache");

            navigate("/profile");
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            const errorMessage = err.response?.data?.message || err.message || "Profile creation failed";

            if (status === 401) {
                toast.error("Session expired or invalid. Please login again.");
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
                return;
            }

            toast.error(errorMessage);
            setLoading(false); // Stop loading if error
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden px-4">

                {/* Background Blobs (Optional visuals from screenshot) */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-gray-50 to-white rounded-full translate-x-1/2 -translate-y-1/2 z-0 opacity-50"></div>

                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10 max-w-6xl">

                    {/* Left: Text & Spinner */}
                    <div className="text-center md:text-left flex flex-col items-center md:items-start pl-10">
                        <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight mb-2">
                            Level Up Your Career
                        </h1>
                        <h1 className="text-4xl md:text-6xl font-bold text-[#FFB300] mb-12">
                            Journey
                        </h1>

                        <div className="relative mb-8">
                            {/* Custom Yellow Spinner with Gradient */}
                            <svg className="animate-spin h-32 w-32" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#FFB300" stopOpacity="0" />
                                        <stop offset="100%" stopColor="#FFB300" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                                {/* Track removed as per design (or keep very faint if needed) */}
                                {/* <circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="8" fill="none" className="opacity-10" /> */}

                                {/* Gradient Arc */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="url(#spinner-gradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray="200"
                                    strokeDashoffset="50"
                                />
                            </svg>
                        </div>

                        <p className="text-2xl font-bold text-black mb-2">Loading your profile.......</p>
                    </div>

                    {/* Right: Illustration */}
                    <div className="flex justify-center md:justify-end">
                        <img src={LoadingIllustration} alt="Team working" className="max-w-full md:max-w-lg object-contain" />
                    </div>
                </div>

                {/* Footer Text */}
                <div className="absolute bottom-10 w-full text-center px-4">
                    <p className="text-[#FBBF24] text-xs max-w-2xl mx-auto leading-relaxed font-medium">
                        Our platform connects passionate job seekers with the right opportunities. Whether you're a fresher starting your career or a professional looking to grow, we make job search simple, fast, and smart.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white font-sans relative overflow-x-hidden">

            {/* Background 3D Bubbles */}
            {/* Top Left - Large */}
            <div className="absolute top-20 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-200 shadow-[inset_10px_-10px_30px_rgba(0,0,0,0.05),20px_20px_40px_rgba(0,0,0,0.05)] z-0"></div>

            {/* Middle Left - Medium */}
            <div className="absolute top-[45%] -left-32 w-48 h-48 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-200 shadow-[inset_10px_-10px_30px_rgba(0,0,0,0.05),20px_20px_40px_rgba(0,0,0,0.05)] z-0"></div>

            {/* Middle Right - Large */}
            <div className="absolute top-[30%] -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-200 shadow-[inset_10px_-10px_30px_rgba(0,0,0,0.05),20px_20px_40px_rgba(0,0,0,0.05)] z-0 opacity-80"></div>

            {/* Bottom Right - Large */}
            <div className="absolute bottom-0 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-200 shadow-[inset_10px_-10px_30px_rgba(0,0,0,0.05),20px_20px_40px_rgba(0,0,0,0.05)] z-0 opacity-60"></div>

            {/* Top Right Illustration */}
            {step === 1 && (
                <div className="absolute top-0 right-0 z-0 hidden md:block w-[423px] h-auto">
                    <img src={step1Illustration} alt="Illustration" className="w-full h-auto" />
                </div>
            )}

            <div className="min-h-screen w-full flex justify-center py-10 px-4 relative z-10">
                <div className="w-full max-w-[945px]">

                    {step === 1 && (
                        <Step1BasicInfo
                            formData={formData}
                            setFormData={setFormData}
                            handleChange={handleChange}
                            primaryPhoneCode={primaryPhoneCode}
                            setPrimaryPhoneCode={setPrimaryPhoneCode}
                            altPhoneCode={altPhoneCode}
                            setAltPhoneCode={setAltPhoneCode}
                            onNext={() => setStep(2)}
                        />
                    )}


                    {/* ================= STEP 2 ================= */}
                    {step === 2 && (
                        <Step2Education
                            formData={formData}
                            setFormData={setFormData}
                            handleChange={handleChange}
                            onNext={() => setStep(3)}
                            onBack={prevStep}
                        />
                    )}

                    {/* ================= STEP 3 ================= */}
                    {step === 3 && (
                        <Step3Experience
                            formData={formData}
                            setFormData={setFormData}
                            handleChange={handleChange}
                            onBack={prevStep}
                            onSubmit={submitProfile}
                        />
                    )}



                </div>
            </div >

        </div >
    );
};
export default CreateProfile;
