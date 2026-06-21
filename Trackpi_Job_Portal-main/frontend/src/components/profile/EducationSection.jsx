import React from 'react';
import EducationCard from './EducationCard';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-black hover:text-gray-600 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const PlusIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`w-5 h-5 cursor-pointer hover:text-black text-gray-400 transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
);

const EducationSection = ({ education, onAdd, onManage }) => {
    return (
        <div className="py-5 border-b border-black">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-black">Education</h2>
                <div className="flex gap-4">
                    <EditIcon className="w-[18px] h-[18px]" onClick={onManage} />
                    <PlusIcon onClick={onAdd} />
                </div>
            </div>
            {education?.map((edu, idx) => (
                <div key={idx} onClick={onManage} className="cursor-pointer hover:bg-gray-50 rounded-lg transition p-1 -m-1">
                    <EducationCard education={edu} showEdit={false} />
                </div>
            ))}
            {(!education || education.length === 0) && <p className="text-sm text-gray-400 italic">No education added.</p>}
        </div>
    );
};

export default EducationSection;
