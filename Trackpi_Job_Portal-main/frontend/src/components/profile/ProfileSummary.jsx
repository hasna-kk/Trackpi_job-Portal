import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-black hover:text-gray-600 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const ProfileSummary = ({ summary, onEdit, onAdd }) => {
    return (
        <div className="py-6 border-b border-black">
            <div className="flex justify-between items-start mb-4">
                <h2 className="font-bold text-xl text-black">Profile Summary</h2>
                <EditIcon className="w-5 h-5 text-black hover:text-gray-600" onClick={summary ? onEdit : onAdd} />
            </div>
            {summary ? (
                <p
                    className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap cursor-pointer hover:bg-gray-50 rounded p-2 -m-2 transition"
                    onClick={onEdit}
                >
                    {summary}
                </p>
            ) : (
                <p
                    className="text-gray-400 text-sm italic cursor-pointer hover:text-[#FFB300] transition-colors"
                    onClick={onAdd}
                >
                    Add a summary about yourself...
                </p>
            )}
        </div>
    );
};

export default ProfileSummary;
