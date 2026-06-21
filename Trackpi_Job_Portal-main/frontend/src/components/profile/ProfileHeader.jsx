import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditIcon = ({ className, onClick, children }) => (
    <div onClick={(e) => { e.stopPropagation(); onClick(e); }} className={`cursor-pointer transition flex items-center justify-center ${className}`}>
        {children || (
            <svg className="w-full h-full text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        )}
    </div>
);

const VerifiedIcon = () => (
    <div className="group relative flex items-center justify-center cursor-help ml-1.5" title="Verified User">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 1L14.6 3.9L18.4 3.1L18.9 7L22.4 8.6L20.5 12L22.4 15.4L18.9 17L18.4 20.9L14.6 20.1L12 23L9.4 20.1L5.6 20.9L5.1 17L1.6 15.4L3.5 12L1.6 8.6L5.1 7L5.6 3.1L9.4 3.9L12 1Z" fill="#FFB300" />
            <path d="M10 16.5L6.5 13L7.9 11.6L10 13.7L16.1 7.6L17.5 9L10 16.5Z" fill="white" />
        </svg>
    </div>
);

const Tag = ({ label, deletable, onClick }) => (
    <span 
        onClick={onClick}
        className={`border border-[#FFB300] px-4 py-1.5 rounded-lg bg-white text-black text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap transition-all ${onClick ? 'cursor-pointer hover:bg-yellow-50 hover:scale-105 active:scale-95' : ''}`}
        title={onClick ? `Click to unstar ${label}` : ""}
    >
        <span className="text-[#FFB300] text-lg leading-none">★</span> {label} {deletable && <span className="text-gray-400 cursor-pointer ml-1 hover:text-red-500 text-lg leading-none">×</span>}
    </span>
);

const ProfileHeader = ({ profile, onEdit, onCoverUpload, onProfileImageUpload, onDeleteCover, onDeleteProfileImage, onShare, onToggleSkillStar }) => {
    const navigate = useNavigate();
    const coverInputRef = React.useRef(null);
    const profileInputRef = React.useRef(null);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const editMenuRef = useRef(null);
    const [isProfilePicMenuOpen, setIsProfilePicMenuOpen] = useState(false);
    const profilePicMenuRef = useRef(null);

    const profileUrl = `${window.location.origin}/u/${profile._id || profile.id}`;

    const handleCopyLink = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(profileUrl)
            .then(() => toast.success("Link copied to clipboard!"))
            .catch(() => toast.error("Failed to copy link"));
    };

    const locationString = profile.location
        ? `${profile.location.city || ''}, ${profile.location.state || ''}, ${profile.location.country || ''}`.replace(/^, |, $/g, '')
        : "Add Location";

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editMenuRef.current && !editMenuRef.current.contains(event.target)) {
                setIsEditMenuOpen(false);
            }
            if (profilePicMenuRef.current && !profilePicMenuRef.current.contains(event.target)) {
                setIsProfilePicMenuOpen(false);
            }
        };
 
        if (isEditMenuOpen || isProfilePicMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditMenuOpen, isProfilePicMenuOpen]);

    return (
        <div className="relative pt-[64px]">
            {/* Hidden Inputs */}
            <input
                type="file"
                ref={coverInputRef}
                onChange={onCoverUpload}
                className="hidden"
                accept="image/*"
            />
            <input
                type="file"
                ref={profileInputRef}
                onChange={onProfileImageUpload}
                className="hidden"
                accept="image/*"
            />

            {/* --- Banner --- */}
            <div className="relative w-full h-[266px] bg-gray-100 group">
                {profile.coverImage ? (
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${profile.coverImage}')` }}
                    >
                        <div className="w-full h-full bg-black/5"></div>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-end justify-center">
                        <img src="/cover-placeholder.png" alt="Add cover" className="h-[200px] object-contain cursor-pointer opacity-90 hover:opacity-100 transition" onClick={() => coverInputRef.current?.click()} />
                    </div>
                )}

                <div className="absolute inset-0 w-full flex justify-center pointer-events-none">
                    <div className="relative w-full max-w-[1440px] px-4 md:px-12 h-full">
                        {/* Unified Edit Menu */}
                        <div className="absolute top-6 right-4 md:right-12 pointer-events-auto z-50" ref={editMenuRef}>
                            {/* pencil Button */}
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditMenuOpen(!isEditMenuOpen); }}
                                className="bg-white hover:bg-gray-50 w-[45px] h-[45px] rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>

                            {/* Redesigned Dropdown Menu */}
                            {isEditMenuOpen && (
                                <div className="absolute top-[60px] right-2 bg-white/20 backdrop-blur-lg rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-5 min-w-[280px] z-50 animate-fadeIn border border-white/10">
                                    {/* Triangle Notch */}
                                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white/20 backdrop-blur-lg rotate-45 border-l border-t border-white/10"></div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => {
                                                coverInputRef.current?.click();
                                                setIsEditMenuOpen(false);
                                            }}
                                            className="w-full bg-[#FFB300] hover:bg-[#ffaa00] text-white font-bold py-3 px-6 rounded-full transition-all shadow-md active:scale-95"
                                        >
                                            Edit cover image
                                        </button>
                                        {/* "Edit profile image" moved to profile picture on-click */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative">
                <div className="flex flex-col md:flex-row gap-8 relative -mt-[100px] mb-8">

                    {/* Profile Picture */}
                    <div className="flex-shrink-0 relative group" ref={profilePicMenuRef}>
                        <div
                            className="w-[220px] h-[220px] rounded-full bg-white p-1 shadow-sm relative cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); setIsProfilePicMenuOpen(!isProfilePicMenuOpen); }}
                        >
                            <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden relative">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover transition duration-300 group-hover:brightness-90" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#F1F1F1] text-[#1E1E1E] transition duration-300 group-hover:brightness-90">
                                        <svg className="opacity-90" width="88" height="66" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <mask id="profile-image-mask">
                                                    <rect width="120" height="90" fill="white" />
                                                    <circle cx="94" cy="28" r="10" fill="black" />
                                                    <path d="M 54 78 L 86 44 L 112 78 Z" fill="black" />
                                                    <path d="M 12 78 L 52 34 L 92 78 Z" fill="black" />
                                                    <path d="M 52 34 L 92 78" stroke="white" strokeWidth="8" strokeLinecap="round" />
                                                </mask>
                                            </defs>
                                            <rect width="120" height="90" rx="12" fill="currentColor" mask="url(#profile-image-mask)" />
                                        </svg>
                                    </div>
                                )}
                                
                                {/* Overlay hover effect */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white pointer-events-none">
                                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <span className="text-sm font-medium">Edit Photo</span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Picture Menu */}
                        {isProfilePicMenuOpen && (
                            <div className="absolute top-[230px] left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-4 min-w-[220px] z-50 animate-fadeIn border border-white/30">
                                {/* Triangle Notch */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 backdrop-blur-xl rotate-45 border-l border-t border-white/30"></div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            profileInputRef.current?.click();
                                            setIsProfilePicMenuOpen(false);
                                        }}
                                        className="w-full bg-[#FFB300] hover:bg-[#e6a200] text-white font-bold py-2.5 px-4 rounded-full transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        Upload New
                                    </button>
                                    
                                    {profile.profileImage && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if(onDeleteProfileImage) onDeleteProfileImage();
                                                setIsProfilePicMenuOpen(false);
                                            }}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-4 rounded-full transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Name & Basic Info */}
                    <div className="pt-[115px] flex-1">
                        <div className="flex justify-between items-start">
                            <div className="relative w-full max-w-[600px]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{profile.fullName}</h1>
                                            <VerifiedIcon />
                                        </div>
                                        <p className="text-xl text-gray-600 font-medium mb-4">{profile.jobTitle || "Add your job title"}</p>
                                    </div>
                                    <EditIcon className="w-5 h-5 text-gray-500 hover:text-black mb-6 mr-4" onClick={onEdit} />
                                </div>


                                <div className="flex flex-wrap gap-3 mb-4">
                                    {profile.skills && profile.skills.some(s => s && typeof s === 'object' ? s.isStarred : false) ? (
                                        profile.skills
                                            .filter(skill => skill && typeof skill === 'object' && skill.isStarred)
                                            .slice(0, 4)
                                            .map((skill, index) => (
                                                <Tag 
                                                    key={index} 
                                                    label={skill.name} 
                                                    onClick={() => onToggleSkillStar && onToggleSkillStar(skill.name)} 
                                                />
                                            ))
                                    ) : (
                                        <span
                                            className="text-gray-400 text-sm italic cursor-pointer hover:text-[#FFB300] transition-colors"
                                            onClick={onEdit}
                                        >
                                            {profile.skills && profile.skills.length > 0 
                                                ? "Star your top skills to showcase them here" 
                                                : "Add skills to showcase your expertise"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 mt-2">
                                {/* More tools link */}
                                <div className="hidden md:flex relative group items-center z-40">
                                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity min-h-[34px] py-4">
                                        <i className="ri-tools-fill text-[#52514F] text-[18px]"></i>
                                        <span
                                            className="text-[16px] font-medium"
                                            style={{
                                                background: 'linear-gradient(90deg, #222121 24%, #FFB300 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            More tools
                                        </span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFB300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-200 group-hover:rotate-90">
                                            <path d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>

                                    {/* Hover Dropdown */}
                                    <div className="absolute top-[80%] right-0 pt-2 w-[280px] hidden group-hover:block z-50">
                                        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
                                            {/* Create ATS Friendly CV */}
                                            <div 
                                                onClick={() => navigate("/resume-gen", { state: { from: "/profile" } })}
                                                className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition text-center"
                                            >
                                                <span className="text-sm font-bold text-black">Create ATS Friendly CV</span>
                                            </div>

                                            {/* Profile Link Section */}
                                            <div className="px-3 py-3 bg-white flex items-center justify-between gap-2 overflow-hidden">
                                                <a 
                                                    href={profileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#FFB300] text-xs truncate flex-1 hover:underline font-medium"
                                                >
                                                    {profileUrl.replace(/^https?:\/\//, '')}
                                                </a>
                                                <div className="flex items-center gap-2">
                                                    {/* Send Icon */}
                                                    <button onClick={onShare} className="text-[#FFB300] hover:scale-110 transition p-0.5">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                                    </button>
                                                    {/* Copy Icon */}
                                                    <button onClick={handleCopyLink} className="text-[#FFB300] hover:scale-110 transition p-0.5" title="Copy profile link">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
