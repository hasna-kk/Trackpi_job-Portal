import React from 'react';
import ExperienceCard from './ExperienceCard';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-black hover:text-gray-600 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const PlusIcon = ({ className }) => (
    <svg className={`cursor-pointer text-black hover:text-gray-600 transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const ExperienceSection = ({ workExperience, onAddExperience, onManage, readOnly }) => {
    return (
        <div className="py-6 border-b border-black">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-black">Experience</h2>
                <div className="flex items-center gap-3">
                    <EditIcon className="w-5 h-5" onClick={onManage} />
                    <div onClick={() => onAddExperience && onAddExperience()}><PlusIcon className="w-6 h-6" /></div>
                </div>
            </div>
            {workExperience && workExperience.length > 0 ? (
                <div className="space-y-6">
                    {workExperience.map((exp, idx) => (
                        <div key={idx} onClick={onManage} className="cursor-pointer hover:bg-gray-50 rounded-lg transition p-2 -m-2">
                            <ExperienceCard experience={exp} showEdit={false} />
                        </div>
                    ))}
                </div>
            ) : <p className="text-sm text-gray-400 italic">No experience added.</p>}
        </div>
    );
};

export default ExperienceSection;
