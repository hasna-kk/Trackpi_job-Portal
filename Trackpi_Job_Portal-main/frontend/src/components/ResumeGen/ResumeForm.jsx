import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PersonalInfo from './PersonalInfo';
import Education from './Education';
import Internship from './Internship';
import Skills from './Skills';
import AdditionalSection from './AdditionalSection';
import ProgressBar from './ProgressBar';
import { RotateCcw, UploadCloud } from 'lucide-react';
import { useResume } from './ResumeContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../../config';

const ResumeForm = () => {
    const navigate = useNavigate();
    const { resumeData } = useResume();
    const [step, setStep] = useState(1);
    const steps = ["Personal Info", "Education", "Internship", "Skills", "Additional section"];

    const [isBuilding, setIsBuilding] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isBuilt, setIsBuilt] = useState(false);

    const location = useLocation();
    const isFromProfile = location.state?.fromProfile || false; // Set this if redirected from profile creation
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // Helper: Generate PDF Blob (Clean version) for Upload
    const generateCleanPdfBlob = async () => {
        const originalElement = document.getElementById('resume-preview');
        if (!originalElement) throw new Error("Resume preview element not found");

        const clonedElement = originalElement.cloneNode(true);
        Object.assign(clonedElement.style, {
            position: 'fixed', top: '0', left: '-9999px',
            width: '210mm', minHeight: '297mm', zIndex: '-1',
            transform: 'none', margin: '0', overflow: 'visible'
        });
        document.body.appendChild(clonedElement);

        // Lowered scale from 2 to 1 for compression to bypass Cloudinary 10MB limit
        const canvas = await html2canvas(clonedElement, {
            scale: 1.5, useCORS: true, logging: false, backgroundColor: '#ffffff'
        });
        document.body.removeChild(clonedElement);

        // Compress using JPEG instead of PNG for huge file size savings
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const pdf = new jsPDF('p', 'mm', 'a4', true); // compressed = true
        pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), undefined, 'FAST');

        return pdf.output('blob');
    };

    const handleBuildResume = async () => {
        setIsBuilding(true);
        try {
            const pdfBlob = await generateCleanPdfBlob();

            // Prepare formData
            const formData = new FormData();
            formData.append('pdfFile', pdfBlob, `${resumeData.personalInfo.fullName || 'resume'}.pdf`);
            formData.append('name', resumeData.personalInfo.fullName || 'Unknown Candidate');
            formData.append('phone', resumeData.personalInfo.phone || 'N/A');
            formData.append('email', resumeData.personalInfo.email || '');

            const headers = {};
            if (isLoggedIn) headers.Authorization = `Bearer ${token}`;

            const res = await axios.post(`${config.API_URL}/api/resume/build`, formData, { headers });

            if (res.data.success) {
                toast.success("Resume Built Successfully!");
                setIsBuilt(true);
            }
        } catch (error) {
            console.error("Resume build failed", error);
            const msg = error.response ? JSON.stringify(error.response.data) : error.message;
            toast.error(`Failed to build resume: ${msg}`, { duration: 5000 });
        } finally {
            setIsBuilding(false);
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const originalElement = document.getElementById('resume-preview');
            const clonedElement = originalElement.cloneNode(true);

            Object.assign(clonedElement.style, {
                position: 'fixed', top: '0', left: '-9999px',
                width: '210mm', minHeight: '297mm', zIndex: '-1',
                transform: 'none', margin: '0', overflow: 'visible'
            });
            document.body.appendChild(clonedElement);

            const canvas = await html2canvas(clonedElement, {
                scale: 1.5, useCORS: true, logging: false, backgroundColor: '#ffffff'
            });
            document.body.removeChild(clonedElement);

            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

            // Watermark for Guest
            if (!isLoggedIn) {
                pdf.setTextColor(200, 200, 200);
                pdf.setFontSize(40);
                pdf.setFont("helvetica", "bold");
                pdf.saveGraphicsState();
                pdf.setGState(new pdf.GState({ opacity: 0.2 }));

                // TrackPi Watermark
                pdf.text("TrackPi", 40, 150, { angle: 45, align: "center" });
                pdf.text("TrackPi", 100, 250, { angle: 45, align: "center" });

                pdf.restoreGraphicsState();
            }

            pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}.pdf`);
            toast.success("Resume Downloaded!");
        } catch (error) {
            console.error("PDF Download failed", error);
            toast.error("Failed to download PDF.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleUploadToProfile = async () => {
        const loadingToast = toast.loading("Uploading resume to profile...");
        try {
            const pdfBlob = await generateCleanPdfBlob();
            const formData = new FormData();
            formData.append("resume", pdfBlob, `${resumeData.personalInfo.fullName || 'resume'}.pdf`);

            const res = await axios.post(`${config.API_URL}/api/profile/resume`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.data) {
                toast.success("Resume attached to profile successfully!", { id: loadingToast });
                // Redirect back to profile creation
                navigate('/create-profile');
            }
        } catch (error) {
            console.error("Failed to upload to profile", error);
            toast.error("Failed to upload resume to profile.", { id: loadingToast });
        }
    };

    const handleNext = () => {
        if (step === 1) {
            const { fullName, email, phone } = resumeData.personalInfo;
            if (!fullName || !email || !phone) {
                toast.error("Please fill in all mandatory fields (Name, Email, Phone).");
                return;
            }
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(fullName)) {
                toast.error("Full name can only contain letters and spaces.");
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toast.error("Please enter a valid email address.");
                return;
            }
            if (phone.length < 10) {
                toast.error("Please enter a valid phone number.");
                return;
            }
        } else if (step === 2) {
            // Validate Education
            if (!resumeData.education || resumeData.education.length === 0) {
                toast.error("Please add at least one education entry.");
                return;
            }
        } else if (step === 4) {
            // Validate Skills
            if (!resumeData.skills || !resumeData.skills.hard || resumeData.skills.hard.length === 0) {
                toast.error("Please add at least one hard skill.");
                return;
            }
        }
        
        if (step < steps.length) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="flex flex-col min-h-screen md:min-h-0">
            {/* Stepper */}
            <ProgressBar currentStep={step} steps={steps} />

            {/* Form Content */}
            <div className="bg-transparent mb-12">
                {step === 1 && <PersonalInfo />}
                {step === 2 && <Education />}
                {step === 3 && <Internship />}
                {step === 4 && <Skills />}
                {step === 5 && <AdditionalSection />}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-6 mt-auto md:mt-10 pb-10">
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-3 pl-6 pr-2 py-2 bg-gradient-to-r from-[#FFC107] to-[#FF9800] text-white rounded-full font-bold shadow-md hover:scale-105 transition"
                    >
                        <span>Back</span>
                        <div className="bg-black text-[#FFB300] rounded-full p-2 flex items-center justify-center">
                            <RotateCcw size={16} className="transform rotate-0" />
                        </div>
                    </button>
                )}

                {step < steps.length ? (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-3 pr-6 pl-2 py-2 bg-gradient-to-r from-[#FF9800] to-[#FFC107] text-white rounded-full font-bold shadow-md hover:scale-105 transition"
                    >
                        <div className="bg-black text-[#FFB300] rounded-full p-2 flex items-center justify-center">
                            <RotateCcw size={16} className="transform rotate-180" />
                        </div>
                        <span>Next</span>
                    </button>
                ) : (
                    !isBuilt ? (
                        <button
                            onClick={handleBuildResume}
                            disabled={isBuilding}
                            className="flex items-center gap-3 pr-6 pl-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition disabled:opacity-50"
                        >
                            <div className="bg-black text-blue-400 rounded-full p-2 flex items-center justify-center">
                                {!isBuilding ? <RotateCcw size={16} className="transform rotate-180" /> : <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></span>}
                            </div>
                            <span>{isBuilding ? 'Building...' : 'Build Resume'}</span>
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-[#FFB300] text-gray-900 rounded-full font-bold shadow-md hover:scale-105 transition disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                {isDownloading ? 'Downloading...' : 'Download'}
                            </button>

                            {/* If logged in and coming from profile setup */}
                            {isLoggedIn && isFromProfile && (
                                <button
                                    onClick={handleUploadToProfile}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-bold shadow-lg hover:bg-black transition hover:scale-105"
                                >
                                    <UploadCloud size={18} /> Upload to Profile
                                </button>
                            )}
                        </div>
                    )
                )}
            </div>

            {!isLoggedIn && isBuilt && (
                <div className="text-center text-sm text-gray-500 mt-2 mb-8">
                    * Guest downloads contain a TracksPi watermark. <a href="/login" className="text-blue-600 underline">Log in</a> to download a clean PDF.
                </div>
            )}
        </div>
    );
};

export default ResumeForm;
