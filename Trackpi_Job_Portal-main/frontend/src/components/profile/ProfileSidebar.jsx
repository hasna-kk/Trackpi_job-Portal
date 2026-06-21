import React, { useState } from 'react';
import { calculateProfileStrength } from '../../utils/profileUtils';
import ProfileStrengthCircle from './ProfileStrengthCircle';
import MissingDetailsModal from './MissingDetailsModal';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-black hover:text-gray-600 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const StrengthItem = ({ label, score, icon, onClick }) => (
    <div onClick={onClick} className={`flex justify-between items-center text-[12px] font-medium text-black py-1 ${onClick ? 'cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 transition-colors' : ''}`}>
        <div className="flex items-center gap-3">
            <span className="text-black w-5 h-5 flex items-center justify-center">{icon}</span>
            <span>{label}</span>
        </div>
        <span className="bg-[#DCFCE7] text-[#16A34A] text-[9px] font-bold px-2 py-[2px] rounded-full flex items-center gap-1 min-w-[50px] justify-center">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            {score}
        </span>
    </div>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex gap-4 items-start">
        <span className="mt-1 flex-shrink-0 text-black text-xl">{icon}</span>
        <div>
            <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
            <p className="text-sm font-bold text-black">{value}</p>
        </div>
    </div>
);

const SocialLink = ({ platform, url }) => {
    // Icons
    const icons = {
        LinkedIn: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
        Twitter: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
        Facebook: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
        Behance: <i className="ri-behance-fill text-[16px]"></i>
    };

    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-black mb-0.5">
                {icons[platform] || <span className="w-4 h-4 bg-gray-200 rounded-full"></span>}
                {platform}
            </div>
            <a href={url || "#"} className="text-[11px] text-[#FFB300] hover:underline block truncate font-medium pl-6">
                {url ? url.replace(/^https?:\/\//, '') : `www.${platform.toLowerCase()}.com/user`}
            </a>
        </div>
    );
};

const ProfileSidebar = ({ profile, onAction }) => {
    const [isMissingDetailsModalOpen, setIsMissingDetailsModalOpen] = useState(false);

    // Strength Calculation from Util
    const { strength, isComplete } = calculateProfileStrength(profile);

    const strengthStatus = strength >= 100 ? "Excellent" : strength >= 70 ? "Good" : strength >= 50 ? "Intermediate" : "Beginner";

    return (
        <div className="flex-1 lg:max-w-[425px] lg:ml-auto lg:-mt-[100px] relative z-20">

            {/* 1. Profile Strength */}
            <div
                className={`bg-white rounded-[14px] border ${isComplete ? 'border-[#FFB300] shadow-[0_4px_12px_rgba(255,179,0,0.12)]' : 'border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.06)]'} p-4 mb-4 flex flex-col items-center overflow-hidden`}
            >
                {isComplete ? (
                    <div className="flex flex-col items-center justify-center w-full py-4">
                        {/* 1. Top Strength Text */}
                        <div className="text-center mb-2">
                            <span className="text-[14px] font-bold text-[#262626]">Profile Strength </span>
                            <span className="text-[14px] font-bold text-[#FFB300]">100%</span>
                        </div>

                        {/* 2. Congratulations Text with Stars */}
                        <div className="relative mt-2">
                            <h3 className="font-bold text-[32px] text-[#FFB300] tracking-wide text-center leading-tight" style={{ textShadow: '0px 2px 4px rgba(255, 179, 0, 0.2)' }}>
                                Congratulations
                            </h3>

                            {/* Decorative Stars */}
                            <svg className="absolute -top-1 -left-4 w-4 h-4 text-[#FFB300] animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            <svg className="absolute top-4 -left-8 w-3 h-3 text-[#FFB300] animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            <svg className="absolute -top-2 -right-3 w-4 h-4 text-[#FFB300] animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            <svg className="absolute -bottom-1 -right-4 w-4 h-4 text-[#FFB300] animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="font-semibold text-[14px] text-black mb-2 text-center">
                            I am looking for job
                        </h3>

                        <div className="scale-[0.7] -my-2">
                            <ProfileStrengthCircle strength={strength} />
                        </div>

                        <p className="text-[12px] text-gray-500 mb-2">
                            {strengthStatus}
                        </p>

                        {/* Compact Missing Items */}
                        <div className="w-full space-y-1 transition-all">
                            {(!profile.languages || profile.languages.length === 0) &&
                                <StrengthItem label="Add language" score="+05%" icon={<i className="ri-translate-2 text-sm"></i>} onClick={() => onAction && onAction('language')} />
                            }
                            {(!profile.skills || profile.skills.length === 0) &&
                                <StrengthItem label="Add skills" score="+10%" icon={<i className="ri-brain-line text-sm"></i>} onClick={() => onAction && onAction('skills')} />
                            }
                            {(!profile.education || profile.education.length === 0) &&
                                <StrengthItem label="Add education" score="+10%" icon={<i className="ri-graduation-cap-line text-sm"></i>} onClick={() => onAction && onAction('education')} />
                            }
                            {!profile.summary &&
                                <StrengthItem label="Add summary" score="+10%" icon={<i className="ri-user-smile-line text-sm"></i>} onClick={() => onAction && onAction('summary')} />
                            }
                            {(!profile.workExperience || profile.workExperience.length === 0) &&
                                <StrengthItem label="Add experience" score="+10%" icon={<i className="ri-briefcase-line text-sm"></i>} onClick={() => onAction && onAction('experience')} />
                            }
                            {!profile.profileImage &&
                                <StrengthItem label="Add photo" score="+10%" icon={<i className="ri-camera-line text-sm"></i>} onClick={() => onAction && onAction('photo')} />
                            }
                            {(!profile.resume && (!profile.resumeUrl || profile.resumeUrl.trim() === "")) &&
                                <StrengthItem label="Add resume" score="+10%" icon={<i className="ri-file-user-line text-sm"></i>} onClick={() => onAction && onAction('resume')} />
                            }
                        </div>

                        <div className="w-full relative group mt-4">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFB300] to-[#EAB308] rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
                            <button
                                onClick={() => setIsMissingDetailsModalOpen(true)}
                                className="relative w-full bg-[#FFF9E5] text-black font-bold py-2.5 rounded-xl text-xs hover:bg-[#ffeebb] transition shadow-sm border border-[#FFB300]/20"
                            >
                                See all missing details
                            </button>
                        </div>
                    </>
                )}
            </div>

            <MissingDetailsModal
                isOpen={isMissingDetailsModalOpen}
                onClose={() => setIsMissingDetailsModalOpen(false)}
                profile={profile}
                onAction={(action) => {
                    onAction(action);
                    setIsMissingDetailsModalOpen(false);
                }}
            />

            {/* 2. Additional Details */}
            <div
                className="bg-white rounded-[32px] border border-gray-200 p-8 mb-8 shadow-[0_0_15px_rgba(0,0,0,0.08)] flex flex-col pt-6"
                style={{ width: '100%', maxWidth: '425px', minHeight: '550px' }}
            >
                <div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Additional Details</h3>
                        <EditIcon className="w-[18px] h-[18px]" onClick={() => onAction && onAction('additional')} />
                    </div>
                    {/* Light Gray Underline */}
                    <div className="w-full h-[1px] bg-gray-100 mt-3 mb-6"></div>
                </div>

                <div className="space-y-6 flex-1">
                    {/* Alternate Phone */}
                    <DetailItem
                        icon={<i className="ri-phone-line"></i>}
                        label="Alternate Phone Number"
                        value={profile.alternatePhone || "Add alternate phone"}
                    />
                    {/* Driving License */}
                    <DetailItem
                        icon={<i className="ri-id-card-line"></i>}
                        label="Driving License"
                        value={profile.drivingLicenses?.length ? "Yes" : "No"}
                    />
                    {/* Date of Birth */}
                    <DetailItem
                        icon={<i className="ri-calendar-event-line"></i>}
                        label="Date of Birth"
                        value={profile.dateOfBirth || "Add DOB"}
                    />
                    {/* Career Break */}
                    <DetailItem
                        icon={<i className="ri-loop-right-line"></i>}
                        label="Career Break"
                        value={profile.careerBreak ? `Yes | ${profile.careerBreakDuration || 'Duration not specified'}` : "No"}
                    />
                    {/* Preferred Work Mode */}
                    <DetailItem
                        icon={<i className="ri-briefcase-line"></i>}
                        label="Preferred Work Mode"
                        value={profile.preferredWorkMode || "Add preference"}
                    />
                    {/* Marital Status */}
                    <DetailItem
                        icon={<i className="ri-vip-diamond-line"></i>}
                        label="Marital Status"
                        value={profile.maritalStatus || "Add status"}
                    />
                </div>
            </div>

            {/* 3. Social Links */}
            <div
                className="bg-white rounded-[32px] border border-gray-200 p-8 mb-0 shadow-[0_0_15px_rgba(0,0,0,0.08)] flex flex-col pt-6"
                style={{ width: '100%', maxWidth: '425px', minHeight: '356px' }}
            >
                <div>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Social Links</h3>
                        <EditIcon className="w-[18px] h-[18px]" onClick={() => onAction && onAction('social')} />
                    </div>
                    {/* Yellow Underline */}
                    <div className="w-full h-[1.5px] bg-[#FFB300] mt-3 mb-6"></div>
                </div>

                <div className="flex-1 flex flex-col space-y-2">
                    {profile.socialLinks?.linkedin ? (
                        <SocialLink platform="LinkedIn" url={profile.socialLinks.linkedin} />
                    ) : (
                        <div className="text-sm text-gray-400 italic">No LinkedIn profile added</div>
                    )}

                    {profile.socialLinks?.twitter ? (
                        <SocialLink platform="Twitter" url={profile.socialLinks.twitter} />
                    ) : (
                        <div className="text-sm text-gray-400 italic">No Twitter profile added</div>
                    )}

                    {profile.socialLinks?.facebook ? (
                        <SocialLink platform="Facebook" url={profile.socialLinks.facebook} />
                    ) : (
                        <div className="text-sm text-gray-400 italic">No Facebook profile added</div>
                    )}

                    {profile.socialLinks?.portfolio ? (
                        <SocialLink platform="Behance" url={profile.socialLinks.portfolio} />
                    ) : (
                        <div className="text-sm text-gray-400 italic">No Portfolio/Behance added</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProfileSidebar;
