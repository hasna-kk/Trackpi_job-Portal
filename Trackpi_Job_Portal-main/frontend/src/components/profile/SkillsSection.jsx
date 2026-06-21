import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-black hover:text-gray-600 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const Tag = ({ label, isStarred, deletable, onDelete, onClick }) => (
    <span
        onClick={onClick}
        className="border border-[#FFB300] px-4 py-1.5 rounded-lg bg-white text-gray-700 text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer hover:bg-yellow-50 transition"
    >
        {isStarred && <span className="text-[#FFB300] text-lg leading-none">★</span>}
        {label}
        {deletable && (
            <span
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-gray-400 cursor-pointer ml-1 hover:text-red-500 text-lg leading-none"
            >
                ×
            </span>
        )}
    </span>
);

const PlusIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`w-5 h-5 cursor-pointer hover:text-black text-gray-400 transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
);

const SkillsSection = ({ skills, onEdit, onAdd, onDelete }) => {
    return (
        <div className="py-5 border-b border-black">
            <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-lg text-black">Skills</h2>
                <div className="flex gap-4">
                    <PlusIcon onClick={onAdd} />
                </div>
            </div>
            <div className="flex flex-wrap gap-3">
                {skills?.map((skill, idx) => {
                    const isObj = typeof skill === 'object' && skill !== null;
                    const label = isObj ? skill.name : skill;
                    const isStarred = isObj ? skill.isStarred : false;
                    return <Tag key={idx} label={label} isStarred={isStarred} deletable onDelete={() => onDelete(skill)} onClick={onEdit} />;
                })}
            </div>
        </div>
    );
};

export default SkillsSection;
