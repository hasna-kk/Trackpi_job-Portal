import React from 'react';
import LanguageRow from './LanguageRow';

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

const LanguageSection = ({ languages, onAdd, onManage }) => {
    // Helper to convert proficiency string to 1-4 level
    const getLevel = (proficiency) => {
        switch (proficiency?.toLowerCase()) {
            case 'beginner': return 1;
            case 'intermediate': return 2;
            case 'expert': return 3;
            case 'native': return 4;
            default: return 1;
        }
    };

    return (
        <div className="py-5 border-b border-black">
            <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-lg text-black">Language</h2>
                <div className="flex gap-4">
                    <EditIcon className="w-[18px] h-[18px]" onClick={onManage} />
                    <PlusIcon onClick={onAdd} />
                </div>
            </div>

            {languages?.length > 0 ? (
                <div className="flex flex-col gap-4 max-w-lg">
                    {languages.map((lang, idx) => (
                        <div key={idx} onClick={onManage} className="px-2 -mx-2 cursor-pointer hover:bg-gray-50 rounded-lg transition">
                            <LanguageRow
                                language={{ language: lang.name, proficiency: getLevel(lang.proficiency) }}
                                showEdit={false}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic">No languages added.</p>
            )}
        </div>
    );
};

export default LanguageSection;
