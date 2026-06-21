import React, { useState, useEffect } from "react";

const EditSummaryModal = ({ isOpen, onClose, currentSummary, onSave, isEditing }) => {
    const [summary, setSummary] = useState(currentSummary || "");

    // Calculate word count
    const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
    const isOverLimit = wordCount > 150;

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setSummary(currentSummary || "");
            } else {
                setSummary("");
            }
        }
    }, [currentSummary, isOpen, isEditing]);

    const handleSave = () => {
        if (isOverLimit) return;
        onSave(summary);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl w-full max-w-[600px] mx-4 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing ? "Edit Summary" : "Add Summary"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all text-xl font-light"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        Describe yourself in a few concise sentences (max 150 words)
                    </p>
                </div>

                {/* Body */}
                <div className="px-8 py-6">
                    <div className={`relative rounded-xl border transition-all duration-200 ${isOverLimit
                            ? "border-red-400 bg-red-50 ring-2 ring-red-200"
                            : "border-gray-200 bg-gray-50 focus-within:border-[#FFB300] focus-within:ring-2 focus-within:ring-[#FFB300]/20 focus-within:bg-white"
                        }`}>
                        <textarea
                            className="w-full h-44 px-4 pt-4 pb-8 outline-none resize-none text-gray-800 text-sm leading-relaxed placeholder-gray-400 font-normal bg-transparent rounded-xl"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Write a brief summary about yourself..."
                            autoFocus
                        />
                        {/* Word count inside textarea bottom-right */}
                        <div className={`absolute bottom-2 right-3 text-xs font-semibold ${isOverLimit ? "text-red-500" : "text-gray-400"
                            }`}>
                            {wordCount} / 150 words
                        </div>
                    </div>

                    {isOverLimit && (
                        <p className="text-red-500 text-xs mt-2 font-medium">
                            ⚠ Exceeded word limit. Please shorten your summary.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isOverLimit}
                        className={`flex-1 py-3 font-bold rounded-xl text-sm transition-all duration-200 ${isOverLimit
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFB300] text-black hover:bg-[#FFA000] shadow-md hover:shadow-lg active:scale-95"
                            }`}
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-white text-gray-700 font-bold rounded-xl text-sm border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSummaryModal;
