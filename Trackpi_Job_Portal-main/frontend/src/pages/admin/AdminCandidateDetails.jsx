import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { calculateProfileStrength } from "../../utils/profileUtils";
import config from "../../config";
import { ArrowLeft } from "lucide-react";

// Reuse existing profile components (Read-Only Mode)
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileSummary from "../../components/profile/ProfileSummary";
import ExperienceSection from "../../components/profile/ExperienceSection";
import SkillsSection from "../../components/profile/SkillsSection";
import EducationSection from "../../components/profile/EducationSection";
import LanguageSection from "../../components/profile/LanguageSection";
import ResumeSection from "../../components/profile/ResumeSection";
import ProfileSidebar from "../../components/profile/ProfileSidebar";

const DetailItem = ({ icon, text, isLink, href }) => (
    <div className="flex items-center gap-3 text-sm font-medium text-gray-800">
        <span className="text-black text-lg flex-shrink-0">{icon}</span>
        {isLink ? (
            <a href={href} className="truncate hover:underline" title={text}>{text}</a>
        ) : (
            <span className="truncate" title={text}>{text}</span>
        )}
    </div>
);

const AdminCandidateDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCandidateProfile();
    }, [id]);

    const fetchCandidateProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${config.API_URL}/api/admin/candidates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data.profile);
        } catch (err) {
            console.error(err);
            setError("Failed to load candidate profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <p className="text-red-500 mb-4">{error || "Profile not found"}</p>
            <button onClick={() => navigate("/admin/candidates/signup")} className="text-blue-600 hover:underline">
                Go Back
            </button>
        </div>
    );

    const { isComplete } = calculateProfileStrength(profile);
    const locationString = profile.location
        ? `${profile.location.city || ''}, ${profile.location.state || ''}, ${profile.location.country || ''}`.replace(/^, |, $/g, '')
        : "N/A";

    return (
        <div className="bg-white min-h-screen font-sans pb-20 overflow-x-hidden">
            {/* Back Button Header */}
            <div className="bg-white border-b border-gray-200 px-4 md:px-12 py-4 sticky top-0 z-10 shadow-sm flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/candidates/signup")}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#FFB300] transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    Back to Candidates
                </button>
                <h1 className="text-xl font-bold text-gray-800">Candidate Profile View</h1>
            </div>

            {/* Profile Header (Read Only - we pass no-op functions for edits) */}
            <ProfileHeader
                profile={profile}
                onEdit={() => { }} // No-op
                onCoverUpload={() => { }}
                onDeleteCover={() => { }}
                onProfileImageUpload={() => { }}
                onDeleteProfileImage={() => { }}
                onShare={() => { }}
                readOnly={true} // Assuming components support this or we just disable valid interactions via props
            />

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative mt-8">
                <div className="flex flex-col lg:flex-row gap-[24px] pb-0">

                    {/* LEFT COLUMN (Content) */}
                    <div className="flex-1 lg:max-w-[822px]">

                        {/* User Details Grid */}
                        <div className="rounded-lg border border-[#0091FF] px-6 py-5 mb-8 bg-white max-w-[822px]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                                <div className="space-y-3">
                                    <DetailItem
                                        icon={<i className="ri-briefcase-line"></i>}
                                        text={profile.workStatus ? (profile.workStatus.charAt(0).toUpperCase() + profile.workStatus.slice(1)) : "N/A"}
                                    />
                                    <DetailItem
                                        icon={profile.gender === 'female' ? <i className="ri-women-line"></i> : <i className="ri-men-line"></i>}
                                        text={profile.gender === 'male' ? 'He/Him' : profile.gender === 'female' ? 'She/Her' : profile.gender || 'N/A'}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <DetailItem
                                        icon={<i className="ri-phone-line"></i>}
                                        text={profile.phone || "N/A"}
                                    />
                                    <DetailItem
                                        icon={<i className="ri-mail-line"></i>}
                                        text={profile.email}
                                        isLink={true}
                                        href={`mailto:${profile.email}`}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <DetailItem
                                        icon={<i className="ri-graduation-cap-line"></i>}
                                        text={profile.education?.length > 0 ? profile.education[0].degree : "N/A"}
                                    />
                                    <DetailItem
                                        icon={<i className="ri-map-pin-line"></i>}
                                        text={locationString}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sections (Read Only) */}
                        {/* We use the same components. If they have 'onEdit' buttons rendered, they might click them but nothing will happen as we pass no-ops or nulls. 
                            Ideally, we should pass a `readOnly={true}` prop if the components support it. 
                            If not, the buttons might show up but be effectively disabled. 
                        */}

                        <ProfileSummary
                            summary={profile.summary}
                            onEdit={null}
                            onAdd={null}
                            readOnly={true}
                        />

                        <ExperienceSection
                            workExperience={profile.workExperience}
                            onAddExperience={null}
                            onManage={null}
                            readOnly={true}
                        />

                        <SkillsSection
                            skills={profile.skills}
                            onEdit={null}
                            onAdd={null}
                            onDelete={null}
                            readOnly={true}
                        />

                        <EducationSection
                            education={profile.education}
                            onAdd={null}
                            onManage={null}
                            readOnly={true}
                        />

                        <LanguageSection
                            languages={profile.languages}
                            onAdd={null}
                            onManage={null}
                            readOnly={true}
                        />

                        <ResumeSection
                            resumeUrl={profile.resumeUrl}
                            onAdd={null}
                            onEdit={null}
                            onDelete={null}
                            isGlobalComplete={isComplete}
                            readOnly={true}
                        />

                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    {/* Sidebar usually has 'Edit' buttons or interactivity. We pass nulls. */}
                    <ProfileSidebar
                        profile={profile}
                        onAction={() => { }} // No-op
                        readOnly={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminCandidateDetails;
