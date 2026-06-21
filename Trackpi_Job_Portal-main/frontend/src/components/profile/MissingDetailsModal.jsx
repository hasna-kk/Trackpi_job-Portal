import React, { useEffect } from 'react';
import ProfileStrengthCircle from './ProfileStrengthCircle';
import { calculateProfileStrength } from '../../utils/profileUtils';

const MissingDetailItem = ({ icon, label, score, onClick }) => (
    <div className="flex items-center justify-between py-2 group">
        <div className="flex items-center gap-3">
            <span className="text-xl text-black w-6 flex justify-center">{icon}</span>
            <span className="text-[13px] font-medium text-black">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold px-2 py-1 rounded-full flex items-center justify-center min-w-[50px]">
                ↑ {score}
            </span>
            <button
                onClick={onClick}
                className="bg-[#FFF9E5] text-[#FFB300] text-[10px] font-bold px-3 py-1 rounded-full border border-[#FFB300] hover:bg-[#FFB300] hover:text-white transition-colors min-w-[50px] flex justify-center"
            >
                Add
            </button>
        </div>
    </div>
);

const MissingDetailsModal = ({ isOpen, onClose, profile, onAction }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const { strength, isComplete } = calculateProfileStrength(profile);
    const strengthStatus = strength >= 100 ? "Excellent" : strength >= 70 ? "Good" : strength >= 50 ? "Intermediate" : "Beginner";

    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)*\/?$/i;

    // Define all possible items with their check logic and score
    // Scores must match utils/profileUtils.js
    const allItems = [
        {
            id: 'language',
            label: 'Add language',
            score: '05%',
            icon: <i className="ri-translate-2 text-xl"></i>,
            isMissing: !profile.languages || profile.languages.length === 0,
            action: 'language'
        },
        {
            id: 'skills',
            label: 'Add skills',
            score: '10%',
            icon: <i className="ri-brain-line text-xl"></i>,
            isMissing: !profile.skills || profile.skills.length === 0,
            action: 'skills'
        },
        {
            id: 'education',
            label: 'Add education',
            score: '10%',
            icon: <i className="ri-graduation-cap-line text-xl"></i>,
            isMissing: !profile.education || profile.education.length === 0,
            action: 'education'
        },
        {
            id: 'summary',
            label: 'Add summary',
            score: '10%',
            icon: <i className="ri-user-smile-line text-xl"></i>,
            isMissing: !profile.summary || profile.summary.trim() === "",
            action: 'summary'
        },
        {
            id: 'experience',
            label: 'Add experience',
            score: '10%',
            icon: <i className="ri-briefcase-line text-xl"></i>,
            isMissing: !profile.workExperience || profile.workExperience.length === 0,
            action: 'experience'
        },
        {
            id: 'resume',
            label: 'Add your resume',
            score: '10%',
            icon: <i className="ri-file-user-line text-xl"></i>,
            isMissing: !profile.resumeUrl || profile.resumeUrl.trim() === "",
            action: 'resume'
        },
        {
            id: 'photo',
            label: 'Add profile photo',
            score: '10%',
            icon: <i className="ri-camera-line text-xl"></i>,
            isMissing: !profile.profileImage,
            action: 'photo'
        },
        {
            id: 'jobTitle',
            label: 'Add job title',
            score: '05%',
            icon: <i className="ri-id-card-line text-xl"></i>,
            isMissing: !profile.jobTitle,
            action: 'social' // Opens EditProfileModal where Job Title is
        },
        {
            id: 'social',
            label: 'Add social links',
            score: '05%',
            icon: <i className="ri-link text-xl"></i>,
            isMissing: !profile.socialLinks || !Object.values(profile.socialLinks).some(link => link && link.trim() !== "" && urlPattern.test(link.trim())),
            action: 'social'
        },
        {
            id: 'phone',
            label: 'Add phone number',
            score: '05%',
            icon: <i className="ri-phone-fill text-xl"></i>,
            isMissing: !profile.phone || profile.phone.length < 10,
            action: 'phone'
        },
        {
            id: 'marital',
            label: 'Add marital status',
            score: '05%',
            icon: <i className="ri-vip-diamond-line text-xl"></i>,
            isMissing: !profile.maritalStatus,
            action: 'marital'
        },
        {
            id: 'dob',
            label: 'Add date of birth',
            score: '05%',
            icon: <i className="ri-calendar-event-line text-xl"></i>,
            isMissing: !profile.dateOfBirth,
            action: 'dob'
        }
    ];

    const missingItems = allItems.filter(item => item.isMissing);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-[32px] p-8 w-full max-w-[800px] relative max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-black transition p-2 hover:bg-gray-100 rounded-full"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 mt-2">
                    <h2 className="text-lg font-bold text-black mb-6">I am looking for job</h2>

                    {/* Centered Strength Circle */}
                    <div className="relative mb-4">
                        <ProfileStrengthCircle strength={strength} className="w-[180px] h-[180px]" />
                    </div>

                    <div className="text-center mt-2">
                        <span className="text-[14px] text-black font-medium mr-1">Profile Strength:</span>
                        <span className="text-[14px] font-bold text-[#FFB300]">{strengthStatus}</span>
                    </div>
                </div>

                {/* Grid of details */}
                {missingItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 relative px-4 md:px-8">
                        {/* Vertical Divider for MD screens - Only if enough items to span columns? Keep simpler logic */}
                        {missingItems.length > 1 && (
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#FFB300]/20 transform -translate-x-1/2"></div>
                        )}

                        {/* Rendering mapped items. 
                             To split into two columns specifically like visually requested might be tricky with simple map in grid.
                             But grid-flow-row (default) fills left then right? No, grid fills row by row: 1 2, 3 4.
                             To get Col 1 then Col 2, we need grid-flow-col or explicit columns.
                             Let's just iterate.
                        */}
                        {missingItems.map((item) => (
                            <MissingDetailItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                score={item.score}
                                onClick={() => onAction(item.action)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p className="text-lg font-bold text-[#16A34A] mb-2">🎉 Profile Complete!</p>
                        <p className="text-sm">You have filled all recommended details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissingDetailsModal;
