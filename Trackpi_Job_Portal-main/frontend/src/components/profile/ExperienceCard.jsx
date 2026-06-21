import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-gray-400 hover:text-black transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const ExperienceCard = ({ experience, showEdit, onEdit }) => {
    // Helper to join non-empty values with a pipe
    const joinValues = (...values) => values.filter(v => v).join(" | ");

    return (
        <div className="flex gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition rounded-lg items-start">
            {/* Logo Section */}
            <div className="w-[50px] h-[50px] bg-[#FFB300] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {/* Try to fetch logo, fallback to Placeholder */}
                <img
                    src={`https://logo.clearbit.com/${experience.company?.replace(/\s/g, '').toLowerCase()}.com`}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                    alt={experience.company}
                    className="w-full h-full object-contain p-1"
                />
                <span className="hidden text-[10px] font-bold text-white text-center leading-tight">
                    {experience.company?.substring(0, 2).toUpperCase() || "EXP"}
                </span>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-[16px] text-gray-900 leading-tight">
                            {experience.jobTitle}
                        </h3>
                        <p className="text-[14px] text-gray-700 mt-1">
                            {experience.company}
                        </p>
                    </div>
                    {showEdit && <EditIcon className="w-5 h-5" onClick={onEdit} />}
                </div>

                {/* Type | Date */}
                <div className="text-[14px] text-gray-600 mt-1">
                    {joinValues(
                        experience.employmentType,
                        `${experience.startDate} - ${experience.endDate || 'Present'}`
                    )}
                </div>

                {/* Location | Salary | Mode */}
                <div className="text-[14px] text-gray-600 mt-1">
                    {joinValues(
                        experience.location,
                        experience.salary,
                        experience.workMode
                    )}
                </div>

                {/* Description */}
                {experience.description && (
                    <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                        {experience.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ExperienceCard;
