import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateProfileStrength } from "../utils/profileUtils";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import config from "../config";

import Navbar from "../components/Navbar";
import EditProfileModal from "../components/profile/EditProfileModal";
import EditExperienceModal from "../components/profile/EditExperienceModal";
import EditSkillsModal from "../components/profile/EditSkillsModal";
import EditSummaryModal from "../components/profile/EditSummaryModal";
import EditEducationModal from "../components/profile/EditEducationModal";
import EditLanguageModal from "../components/profile/EditLanguageModal";
import EditResumeModal from "../components/profile/EditResumeModal";
import DeleteConfirmationModal from "../components/profile/DeleteConfirmationModal";
import EditAdditionalDetailsModal from "../components/profile/EditAdditionalDetailsModal";
import EditSocialLinksModal from "../components/profile/EditSocialLinksModal";

import ProfileHeader from "../components/profile/ProfileHeader";
import SectionListModal from "../components/profile/SectionListModal";
import ExperienceCard from "../components/profile/ExperienceCard";
import BulkEditExperienceModal from "../components/profile/BulkEditExperienceModal";
import EducationCard from "../components/profile/EducationCard";
import LanguageRow from "../components/profile/LanguageRow";
import ProfileSummary from "../components/profile/ProfileSummary";
import ExperienceSection from "../components/profile/ExperienceSection";
import SkillsSection from "../components/profile/SkillsSection";
import EducationSection from "../components/profile/EducationSection";
import LanguageSection from "../components/profile/LanguageSection";
import ResumeSection from "../components/profile/ResumeSection";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import JobListing from "../components/profile/JobListing";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isSummaryEditing, setIsSummaryEditing] = useState(false);

    const [isExpListOpen, setIsExpListOpen] = useState(false);
    const [isEduListOpen, setIsEduListOpen] = useState(false);
    const [isLangListOpen, setIsLangListOpen] = useState(false);

    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [currentExperience, setCurrentExperience] = useState(null);
    const [experienceEditIndex, setExperienceEditIndex] = useState(null);
    const [isExperienceEditing, setIsExperienceEditing] = useState(false);

    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [isSkillsAddMode, setIsSkillsAddMode] = useState(true);

    const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
    const [currentEducation, setCurrentEducation] = useState(null);
    const [educationEditIndex, setEducationEditIndex] = useState(null);
    const [isEducationEditing, setIsEducationEditing] = useState(false);

    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [languageEditIndex, setLanguageEditIndex] = useState(null);
    const [isLanguageEditing, setIsLanguageEditing] = useState(false);

    const [showDeleteResumeModal, setShowDeleteResumeModal] = useState(false);
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
    const [isResumeEditing, setIsResumeEditing] = useState(false);

    const [isAdditionalDetailsModalOpen, setIsAdditionalDetailsModalOpen] = useState(false);
    const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

    const [showDeleteCoverModal, setShowDeleteCoverModal] = useState(false);
    const [showDeleteProfileImageModal, setShowDeleteProfileImageModal] = useState(false);
    const [showDeleteSkillModal, setShowDeleteSkillModal] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);
    const [showDeleteEducationModal, setShowDeleteEducationModal] = useState(false);
    const [educationIndexToDelete, setEducationIndexToDelete] = useState(null);

    const [showDeleteExperienceModal, setShowDeleteExperienceModal] = useState(false);
    const [experienceIndexToDelete, setExperienceIndexToDelete] = useState(null);

    const [showDeleteLanguageModal, setShowDeleteLanguageModal] = useState(false);
    const [languageIndexToDelete, setLanguageIndexToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Fetching profile with token:", token ? "Token present" : "No token");

            if (!token) {
                console.warn("No token found in localStorage, redirecting to login");
                navigate("/login");
                return;
            }

            const res = await axios.get(`${config.API_URL}/api/profile/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data.profile);
            setError("");
        } catch (err) {
            console.error("Profile fetch error:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                setError("Failed to load profile");
            } else if (err.response?.status === 404 && err.response?.data?.message === "Profile not found") {
                toast("Please complete your profile first.");
                navigate("/create-profile");
            } else {
                setError(err.response?.data?.message || "Failed to connect to the server. Please try again later.");
                toast.error("Failed to connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (actionType) => {
        if (actionType === 'photo') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast("Click the camera icon on your profile picture", { icon: "📸" });
            return;
        }

        const sectionMap = {
            'skills': { id: 'skills-section', open: () => setIsSkillsModalOpen(true) },
            'education': { id: 'education-section', open: handleAddEducation },
            'experience': { id: 'experience-section', open: handleAddExperience },
            'language': { id: 'language-section', open: handleAddLanguage },
            'summary': { id: 'summary-section', open: () => setIsSummaryModalOpen(true) },
            'resume': { id: 'resume-section', open: () => setIsResumeModalOpen(true) },
            'social': { open: () => setIsSocialModalOpen(true) },
            'additional': { open: () => setIsAdditionalDetailsModalOpen(true) },
            'phone': { open: () => setIsEditModalOpen(true) },
            'marital': { open: () => setIsEditModalOpen(true) },
            'dob': { open: () => setIsEditModalOpen(true) },
        };

        const target = sectionMap[actionType];
        if (target) {
            const element = document.getElementById(target.id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => target.open(), 600);
            } else {
                target.open();
            }
        }
    };

    const handleDeleteResume = () => setShowDeleteResumeModal(true);

    const confirmDeleteResume = async () => {
        setShowDeleteResumeModal(false);
        const oldResume = profile.resumeUrl;
        setProfile(prev => ({ ...prev, resumeUrl: null }));

        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`${config.API_URL}/api/profile/resume`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data) setProfile(res.data);
            toast.success("Resume deleted");
        } catch (err) {
            setProfile(prev => ({ ...prev, resumeUrl: oldResume }));
            toast.error(err.response?.data?.message || "Failed to delete resume");
        }
    };

    const handleSaveResume = async (file) => {
        if (!file) { setIsResumeModalOpen(false); return; }
        const formData = new FormData();
        formData.append("resume", file);
        const loadingToast = toast.loading("Uploading resume...");
        setIsResumeModalOpen(false);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${config.API_URL}/api/profile/resume`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });
            setProfile(prev => ({ ...prev, resumeUrl: res.data.resumeUrl }));
            toast.success("Resume uploaded successfully!", { id: loadingToast });
        } catch (err) {
            toast.error("Failed to upload resume", { id: loadingToast });
        }
    };

    const handleShareProfile = () => {
        const url = `${window.location.origin}/u/${profile._id || profile.id}`;
        if (navigator.share) {
            navigator.share({
                title: `${profile.fullName}'s Profile | Trackpi`,
                text: `Check out ${profile.fullName}'s professional profile on Trackpi.`,
                url: url
            }).catch(() => {
                navigator.clipboard.writeText(url);
                toast.success("Profile link copied!");
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Profile link copied!");
        }
    };

    const handleDeleteDirectSkill = (skill) => {
        setSkillToDelete(skill);
        setShowDeleteSkillModal(true);
    };

    const confirmDeleteDirectSkill = async () => {
        if (!skillToDelete) return;
        const oldSkills = profile.skills || [];
        const skillName = typeof skillToDelete === 'object' ? skillToDelete.name : skillToDelete;
        const updatedSkills = oldSkills.filter(s => (typeof s === 'object' ? s.name : s) !== skillName);
        setProfile(prev => ({ ...prev, skills: updatedSkills }));
        setShowDeleteSkillModal(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { skills: updatedSkills }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Skill deleted");
        } catch (err) {
            setProfile(prev => ({ ...prev, skills: oldSkills }));
            toast.error("Failed to delete skill");
        } finally {
            setSkillToDelete(null);
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        const loadingToast = toast.loading("Updating profile...");
        try {
            const token = localStorage.getItem("token");
            const locationUpdate = {
                city: updatedData.locationCity,
                state: updatedData.locationState,
                country: updatedData.locationCountry || profile.location?.country || "India"
            };
            let updatedEducation = [...(profile.education || [])];
            if (updatedData.educationDegree) {
                if (!updatedEducation.length) {
                    updatedEducation = [{ degree: updatedData.educationDegree, institution: "Unknown", year: "Present" }];
                } else if (updatedEducation.length === 1) {
                    updatedEducation[0] = { ...updatedEducation[0], degree: updatedData.educationDegree };
                }
            }
            const payload = { ...updatedData, location: locationUpdate, education: updatedEducation };
            delete payload.educationDegree; delete payload.locationCity; delete payload.locationState; delete payload.countryCode;

            await axios.post(`${config.API_URL}/api/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditModalOpen(false);
            fetchProfile();
            toast.success("Profile updated!", { id: loadingToast });
        } catch (err) {
            toast.error("Failed to update profile", { id: loadingToast });
        }
    };

    const handleSaveAdditionalDetails = async (updatedDetails) => {
        const loadingToast = toast.loading("Updating details...");
        try {
            const token = localStorage.getItem("token");

            const payload = {
                alternatePhone: updatedDetails.fullAltPhone,
                drivingLicenses: updatedDetails.drivingLicense ? ["Yes"] : [],
                dateOfBirth: updatedDetails.dob,
                careerBreak: updatedDetails.careerBreak,
                preferredWorkMode: updatedDetails.preferredWorkMode,
                maritalStatus: updatedDetails.maritalStatus
            };

            await axios.post(`${config.API_URL}/api/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdditionalDetailsModalOpen(false);
            fetchProfile();
            toast.success("Additional details updated!", { id: loadingToast });
        } catch (err) {
            toast.error("Failed to update additional details", { id: loadingToast });
        }
    };

    const handleSaveSocialLinks = async (updatedSocials) => {
        const loadingToast = toast.loading("Updating social links...");
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { socialLinks: updatedSocials }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsSocialModalOpen(false);
            fetchProfile();
            toast.success("Social links updated!", { id: loadingToast });
        } catch (err) {
            toast.error("Failed to update social links", { id: loadingToast });
        }
    };

    const handleSaveSummary = async (newSummary) => {
        const oldSummary = profile.summary;
        setProfile(prev => ({ ...prev, summary: newSummary }));
        setIsSummaryModalOpen(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { summary: newSummary }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Summary updated");
        } catch (err) {
            setProfile(prev => ({ ...prev, summary: oldSummary }));
            toast.error("Failed to update summary");
        }
    };

    const handleSaveSkills = async (newSkills) => {
        const oldSkills = profile.skills || [];
        setProfile(prev => ({ ...prev, skills: newSkills }));
        setIsSkillsModalOpen(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { skills: newSkills }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Skills updated");
        } catch (err) {
            setProfile(prev => ({ ...prev, skills: oldSkills }));
            toast.error("Failed to update skills");
        }
    };

    const handleToggleSkillStar = async (skillName) => {
        const oldSkills = profile.skills || [];
        const updatedSkills = oldSkills.map(skill => {
            const name = typeof skill === 'object' ? skill.name : skill;
            if (name === skillName) {
                const isCurrentlyStarred = typeof skill === 'object' ? !!skill.isStarred : false;
                
                // If starring, check limit
                if (!isCurrentlyStarred) {
                    const starredCount = oldSkills.filter(s => typeof s === 'object' && s.isStarred).length;
                    if (starredCount >= 4) {
                        toast.error("Maximum 4 skills can be starred.");
                        return skill;
                    }
                }
                
                return { 
                    name: name, 
                    isStarred: !isCurrentlyStarred 
                };
            }
            return skill;
        });

        // Check if any change actually happened (e.g. limit wasn't reached)
        const isChanged = JSON.stringify(oldSkills) !== JSON.stringify(updatedSkills);
        if (!isChanged) return;

        setProfile(prev => ({ ...prev, skills: updatedSkills }));
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { skills: updatedSkills }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`${skillName} ${updatedSkills.find(s => s.name === skillName).isStarred ? 'starred' : 'unstarred'}`);
        } catch (err) {
            setProfile(prev => ({ ...prev, skills: oldSkills }));
            toast.error("Failed to update skill");
        }
    };

    const handleSaveEducation = async (newEducation) => {
        const oldEducation = [...(profile.education || [])];
        let list = [...oldEducation];
        if (educationEditIndex !== null) list[educationEditIndex] = newEducation;
        else list.push(newEducation);
        setProfile(prev => ({ ...prev, education: list }));
        setIsEducationModalOpen(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { education: list }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Education updated");
        } catch (err) {
            setProfile(prev => ({ ...prev, education: oldEducation }));
            toast.error("Failed to update education");
        }
    };

    const handleAddEducation = () => { setCurrentEducation(null); setEducationEditIndex(null); setIsEducationEditing(false); setIsEducationModalOpen(true); };
    const handleEditEducation = (edu, index) => { setCurrentEducation(edu); setEducationEditIndex(index); setIsEducationEditing(true); setIsEducationModalOpen(true); };

    const handleDeleteEducation = (indexToDelete) => {
        setEducationIndexToDelete(indexToDelete);
        setShowDeleteEducationModal(true);
    };

    const confirmDeleteEducation = async () => {
        if (educationIndexToDelete === null) return;
        const old = [...(profile.education || [])];
        const list = old.filter((_, i) => i !== educationIndexToDelete);
        setProfile(prev => ({ ...prev, education: list }));
        setShowDeleteEducationModal(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { education: list }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Education deleted");
        } catch (err) {
            setProfile(prev => ({ ...prev, education: old }));
            toast.error("Failed to delete education");
        } finally {
            setEducationIndexToDelete(null);
        }
    };

    const handleSaveLanguage = async (newLang) => {
        const old = [...(profile.languages || [])];
        let list = [...old];
        if (languageEditIndex !== null) list[languageEditIndex] = newLang;
        else list.push(newLang);
        setProfile(prev => ({ ...prev, languages: list }));
        setIsLanguageModalOpen(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { languages: list }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Languages updated");
        } catch (err) { setProfile(prev => ({ ...prev, languages: old })); toast.error("Failed to update languages"); }
    };

    const handleDeleteLanguage = (indexToDelete) => {
        setIsLanguageModalOpen(false);
        setLanguageIndexToDelete(indexToDelete);
        setShowDeleteLanguageModal(true);
    };

    const confirmDeleteLanguage = async () => {
        if (languageIndexToDelete === null) return;
        const old = [...(profile.languages || [])];
        const list = old.filter((_, i) => i !== languageIndexToDelete);
        setProfile(prev => ({ ...prev, languages: list }));
        setShowDeleteLanguageModal(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { languages: list }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Language deleted");
        } catch (err) {
            setProfile(prev => ({ ...prev, languages: old }));
            toast.error("Failed to delete language");
        } finally {
            setLanguageIndexToDelete(null);
        }
    };

    const handleAddLanguage = () => { setCurrentLanguage(null); setLanguageEditIndex(null); setIsLanguageEditing(false); setIsLanguageModalOpen(true); };
    const handleEditLanguage = (lang, index) => { setCurrentLanguage(lang); setLanguageEditIndex(index); setIsLanguageEditing(true); setIsLanguageModalOpen(true); };

    const handleAddExperience = () => { setCurrentExperience(null); setExperienceEditIndex(null); setIsExperienceEditing(false); setIsExpModalOpen(true); };
    const handleEditExperience = (exp, index) => { setCurrentExperience(exp); setExperienceEditIndex(index); setIsExperienceEditing(true); setIsExpModalOpen(true); };

    const handleSaveExperience = async (expData) => {
        const old = [...(profile.workExperience || [])];
        let list = [...old];
        if (experienceEditIndex !== null) list[experienceEditIndex] = expData;
        else list.push(expData);
        setProfile(prev => ({ ...prev, workExperience: list }));
        setIsExpModalOpen(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { workExperience: list }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Experience updated");
        } catch (err) { setProfile(prev => ({ ...prev, workExperience: old })); toast.error("Failed to update experience"); }
    };

    const handleDeleteExperience = (indexToDelete) => {
        setIsExpModalOpen(false);
        setExperienceIndexToDelete(indexToDelete);
        setShowDeleteExperienceModal(true);
    };

    const confirmDeleteExperience = async () => {
        if (experienceIndexToDelete === null) return;
        const old = [...(profile.workExperience || [])];
        const list = old.filter((_, i) => i !== experienceIndexToDelete);
        setProfile(prev => ({ ...prev, workExperience: list }));
        setShowDeleteExperienceModal(false);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { workExperience: list }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Experience deleted");
        } catch (err) {
            setProfile(prev => ({ ...prev, workExperience: old }));
            toast.error("Failed to delete experience");
        } finally {
            setExperienceIndexToDelete(null);
        }
    };

    const handleSaveAllExperiences = async (list) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { workExperience: list }, { headers: { Authorization: `Bearer ${token}` } });
            setProfile(prev => ({ ...prev, workExperience: list }));
            setIsExpListOpen(false);
            toast.success("All experiences updated!");
        } catch (err) { toast.error("Failed to update experiences"); fetchProfile(); }
    };

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const validTypes = type === "resume" ? ["application/pdf"] : ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) { toast.error("Invalid file type."); return; }
        const formData = new FormData();
        formData.append(type === "cover" ? "coverImage" : type === "profile" ? "profileImage" : "resume", file);
        const loadingToast = toast.loading("Uploading...");
        try {
            const token = localStorage.getItem("token");
            const endpoint = type === "cover" ? "cover-image" : type === "profile" ? "profile-image" : "resume";
            const res = await axios.post(`${config.API_URL}/api/profile/${endpoint}`, formData, { headers: { Authorization: `Bearer ${token}` } });
            setProfile(res.data.profile || res.data);
            toast.success("Upload successful!", { id: loadingToast });
        } catch (err) { toast.error("Upload failed.", { id: loadingToast }); }
    };

    const handleDeleteCoverImage = () => {
        if (!profile.coverImage) return;
        setShowDeleteCoverModal(true);
    };

    const confirmDeleteCoverImage = async () => {
        setShowDeleteCoverModal(false);
        const old = profile.coverImage;
        const loadingToast = toast.loading("Deleting...");
        setProfile(prev => ({ ...prev, coverImage: null }));
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${config.API_URL}/api/profile/cover-image`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Cover photo deleted", { id: loadingToast });
        } catch (err) { setProfile(prev => ({ ...prev, coverImage: old })); toast.error("Failed to delete", { id: loadingToast }); }
    };

    const handleDeleteProfileImage = () => {
        if (!profile.profileImage) return;
        setShowDeleteProfileImageModal(true);
    };

    const confirmDeleteProfileImage = async () => {
        setShowDeleteProfileImageModal(false);
        const old = profile.profileImage;
        const loadingToast = toast.loading("Deleting...");
        setProfile(prev => ({ ...prev, profileImage: null }));
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${config.API_URL}/api/profile/profile-image`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Profile picture deleted", { id: loadingToast });
        } catch (err) { setProfile(prev => ({ ...prev, profileImage: old })); toast.error("Failed to delete", { id: loadingToast }); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div></div>;

    if (error && !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => { setLoading(true); setError(""); fetchProfile(); }}
                        className="w-full bg-[#FFB300] hover:bg-[#e6a200] text-black font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const { isComplete } = calculateProfileStrength(profile);

    return (
        <div className="bg-white min-h-screen font-sans pb-20 overflow-x-hidden">
            <Toaster position="top-center" />
            <Navbar />
            <ProfileHeader 
                profile={profile} 
                onEdit={() => setIsEditModalOpen(true)} 
                onCoverUpload={(e) => handleUpload(e, "cover")} 
                onDeleteCover={handleDeleteCoverImage} 
                onProfileImageUpload={(e) => handleUpload(e, "profile")} 
                onDeleteProfileImage={handleDeleteProfileImage} 
                onShare={handleShareProfile} 
                onToggleSkillStar={handleToggleSkillStar}
            />
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative">
                <div className="flex flex-col lg:flex-row gap-[24px] lg:justify-between">
                    <div className="flex-1 lg:max-w-[822px]">
                        <div id="summary-section"><ProfileSummary summary={profile.summary} onEdit={() => { setIsSummaryEditing(true); setIsSummaryModalOpen(true); }} onAdd={() => { setIsSummaryEditing(false); setIsSummaryModalOpen(true); }} /></div>
                        <div id="experience-section"><ExperienceSection workExperience={profile.workExperience} onAddExperience={handleAddExperience} onManage={() => setIsExpListOpen(true)} /></div>
                        <div id="skills-section"><SkillsSection skills={profile.skills} onEdit={() => { setIsSkillsAddMode(false); setIsSkillsModalOpen(true); }} onAdd={() => { setIsSkillsAddMode(true); setIsSkillsModalOpen(true); }} onDelete={handleDeleteDirectSkill} /></div>
                        <div id="education-section"><EducationSection education={profile.education} onAdd={handleAddEducation} onManage={() => setIsEduListOpen(true)} /></div>
                        <div id="language-section"><LanguageSection languages={profile.languages} onAdd={handleAddLanguage} onManage={() => setIsLangListOpen(true)} /></div>
                        <ResumeSection resumeUrl={profile.resumeUrl} onAdd={() => { setIsResumeEditing(false); setIsResumeModalOpen(true); }} onEdit={() => { setIsResumeEditing(true); setIsResumeModalOpen(true); }} onDelete={handleDeleteResume} isGlobalComplete={isComplete} />
                    </div>
                    <ProfileSidebar profile={profile} onAction={handleAction} />
                </div>
                <JobListing limit={3} />
            </div>
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} profileData={profile} onSave={handleUpdateProfile} />
            <EditSummaryModal isOpen={isSummaryModalOpen} onClose={() => setIsSummaryModalOpen(false)} currentSummary={profile.summary} onSave={handleSaveSummary} isEditing={isSummaryEditing} />
            <BulkEditExperienceModal isOpen={isExpListOpen} onClose={() => setIsExpListOpen(false)} initialExperiences={profile.workExperience} onSave={handleSaveAllExperiences} dob={profile.dateOfBirth} />
            <SectionListModal isOpen={isEduListOpen} onClose={() => setIsEduListOpen(false)} title="Education" onAdd={handleAddEducation}>{profile.education?.map((edu, idx) => <EducationCard key={idx} education={edu} showEdit={true} onEdit={() => handleEditEducation(edu, idx)} onDelete={() => handleDeleteEducation(idx)} />)}</SectionListModal>
            <SectionListModal isOpen={isLangListOpen} onClose={() => setIsLangListOpen(false)} title="Language" onAdd={handleAddLanguage}>{profile.languages?.map((lang, idx) => <LanguageRow key={idx} language={{ ...lang, language: lang.name }} showEdit={true} onEdit={() => handleEditLanguage(lang, idx)} />)}</SectionListModal>
            <EditExperienceModal isOpen={isExpModalOpen} onClose={() => setIsExpModalOpen(false)} experienceData={currentExperience} onSave={handleSaveExperience} isEditing={isExperienceEditing} dob={profile.dateOfBirth} onDelete={() => handleDeleteExperience(experienceEditIndex)} />
            <EditSkillsModal isOpen={isSkillsModalOpen} onClose={() => setIsSkillsModalOpen(false)} currentSkills={profile.skills || []} onSave={handleSaveSkills} />
            <EditEducationModal isOpen={isEducationModalOpen} onClose={() => setIsEducationModalOpen(false)} educationData={currentEducation} onSave={handleSaveEducation} isEditing={isEducationEditing} onDelete={() => handleDeleteEducation(educationEditIndex)} />
            <EditLanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} languageData={currentLanguage} onSave={handleSaveLanguage} isEditing={isLanguageEditing} onDelete={() => handleDeleteLanguage(languageEditIndex)} />
            <EditResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} onSave={handleSaveResume} currentResumeUrl={profile.resumeUrl} isEditing={isResumeEditing} />
            <DeleteConfirmationModal isOpen={showDeleteResumeModal} onClose={() => setShowDeleteResumeModal(false)} onConfirm={confirmDeleteResume} title="Are you sure you want to delete the resume?" />
            <DeleteConfirmationModal isOpen={showDeleteCoverModal} onClose={() => setShowDeleteCoverModal(false)} onConfirm={confirmDeleteCoverImage} title="Are you sure you want to delete the cover photo?" />
            <DeleteConfirmationModal isOpen={showDeleteProfileImageModal} onClose={() => setShowDeleteProfileImageModal(false)} onConfirm={confirmDeleteProfileImage} title="Are you sure you want to delete the profile picture?" />
            <DeleteConfirmationModal
                isOpen={showDeleteSkillModal}
                onClose={() => { setShowDeleteSkillModal(false); setSkillToDelete(null); }}
                onConfirm={confirmDeleteDirectSkill}
                title={`Are you sure you want to delete "${skillToDelete?.name || skillToDelete || ""}"?`}
            />
            <DeleteConfirmationModal
                isOpen={showDeleteEducationModal}
                onClose={() => { setShowDeleteEducationModal(false); setEducationIndexToDelete(null); }}
                onConfirm={confirmDeleteEducation}
                title={educationIndexToDelete !== null && profile.education[educationIndexToDelete] ? `Are you sure you want to delete ${profile.education[educationIndexToDelete].degree}?` : "Are you sure you want to delete this education?"}
            />
            <DeleteConfirmationModal
                isOpen={showDeleteExperienceModal}
                onClose={() => { setShowDeleteExperienceModal(false); setExperienceIndexToDelete(null); }}
                onConfirm={confirmDeleteExperience}
                title={experienceIndexToDelete !== null && profile.workExperience[experienceIndexToDelete] ? `Are you sure you want to delete ${profile.workExperience[experienceIndexToDelete].jobTitle} at ${profile.workExperience[experienceIndexToDelete].company}?` : "Are you sure you want to delete this experience?"}
            />
            <DeleteConfirmationModal
                isOpen={showDeleteLanguageModal}
                onClose={() => { setShowDeleteLanguageModal(false); setLanguageIndexToDelete(null); }}
                onConfirm={confirmDeleteLanguage}
                title={languageIndexToDelete !== null && profile.languages[languageIndexToDelete] ? `Are you sure you want to delete the language ${profile.languages[languageIndexToDelete].name}?` : "Are you sure you want to delete this language?"}
            />
            <EditAdditionalDetailsModal isOpen={isAdditionalDetailsModalOpen} onClose={() => setIsAdditionalDetailsModalOpen(false)} details={profile} onSave={handleSaveAdditionalDetails} />
            <EditSocialLinksModal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} socialLinks={profile.socialLinks} onSave={handleSaveSocialLinks} />
        </div>
    );
};

export default Profile;
