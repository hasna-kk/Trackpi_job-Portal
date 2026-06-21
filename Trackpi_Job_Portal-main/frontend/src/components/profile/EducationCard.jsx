import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-gray-400 hover:text-black transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const DeleteIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-gray-400 hover:text-red-500 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const UniPlaceholder = () => (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path d="M20 6L34 13V15H6V13L20 6Z" fill="#D1D5DB" />
        <rect x="9" y="16" width="4" height="12" rx="1" fill="#D1D5DB" />
        <rect x="18" y="16" width="4" height="12" rx="1" fill="#D1D5DB" />
        <rect x="27" y="16" width="4" height="12" rx="1" fill="#D1D5DB" />
        <rect x="6" y="28" width="28" height="3" rx="1.5" fill="#D1D5DB" />
    </svg>
);

const EducationLogo = ({ education }) => {
    const [src, setSrc] = React.useState(
        education.domain ? `https://logo.clearbit.com/${education.domain}` : null
    );
    const [step, setStep] = React.useState(0);

    if (!src) return <UniPlaceholder />;

    return (
        <img
            src={src}
            alt="University logo"
            className="w-full h-full object-contain"
            onError={() => {
                if (step === 0 && education.domain) {
                    setSrc(`https://www.google.com/s2/favicons?domain=${education.domain}&sz=128`);
                    setStep(1);
                } else {
                    setSrc(null);
                }
            }}
        />
    );
};

const EducationCard = ({ education, showEdit, onEdit, onDelete }) => {
    return (
        <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition rounded-lg px-2 -mx-2">
            {/* Logo */}
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-full overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                <EducationLogo education={education} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-sm text-black leading-tight mb-1">{education.institution}</h3>
                        <p className="text-sm text-gray-900 font-medium leading-tight mb-1">
                            {education.degree}{education.course ? ` ${education.course}` : ''}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mb-1.5">
                            {education.courseType || 'Full time'} <span className="mx-1">|</span> {education.startDate} - {education.endDate || 'Present'}
                        </p>
                        {education.grade && (
                            <p className="text-xs text-black font-semibold">
                                Grade: {education.grade}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    {showEdit && (
                        <div className="flex gap-3 ml-4">
                            <EditIcon className="w-4 h-4" onClick={onEdit} />
                            {onDelete && <DeleteIcon className="w-4 h-4" onClick={onDelete} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EducationCard;
