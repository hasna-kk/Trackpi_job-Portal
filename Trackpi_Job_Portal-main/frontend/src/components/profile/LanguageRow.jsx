import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-gray-400 hover:text-black transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const LanguageRow = ({ language, showEdit, onEdit }) => {
    return (
        <div className="flex items-center w-full py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded">
            <span className="font-bold text-sm text-black w-32 shrink-0 truncate text-left">{language.language}</span>
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map(dot => (
                        <div key={dot} className={`w-3.5 h-3.5 rounded-full ${dot <= language.proficiency ? 'bg-[#FFB300] shadow-sm' : 'border border-gray-300 bg-transparent'}`}></div>
                    ))}
                </div>
                {showEdit && <EditIcon className="w-4 h-4" onClick={onEdit} />}
            </div>
        </div>
    );
};

export default LanguageRow;
