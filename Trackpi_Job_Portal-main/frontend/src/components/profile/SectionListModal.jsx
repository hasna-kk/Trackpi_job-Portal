import React from 'react';

const PlusIcon = ({ onClick }) => (
    <svg onClick={onClick} className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const BackIcon = ({ onClick }) => (
    <svg onClick={onClick} className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const SectionListModal = ({ isOpen, onClose, title, onAdd, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]" onClick={onClose}>
            <div className="bg-white rounded-[24px] w-full max-w-[700px] h-[80vh] mx-4 relative shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <BackIcon onClick={onClose} />
                        <h2 className="text-xl font-bold text-black">{title}</h2>
                    </div>
                    <PlusIcon onClick={onAdd} />
                </div>

                {/* Body (Scrollable) */}
                <div className="p-8 overflow-y-auto flex-1">
                    <div className="space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionListModal;
