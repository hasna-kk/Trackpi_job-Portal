import React, { useRef, useState } from 'react';

const EditResumeModal = ({ isOpen, onClose, onSave, currentResumeUrl, isEditing }) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileError(null);
        if (file) {
            if (file.type !== "application/pdf") {
                setFileError("Only PDF files are allowed.");
                setSelectedFile(null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setFileError("File size must be less than 5MB.");
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if (!selectedFile) {
            setFileError("Please select a PDF file to upload.");
            return;
        }
        onSave(selectedFile);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-black">Resume</h2>
                    <div className="flex gap-4">
                        <svg className="w-[18px] h-[18px] cursor-pointer text-black hover:text-gray-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <svg className="w-[18px] h-[18px] cursor-pointer text-black hover:text-gray-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <svg className="w-[18px] h-[18px] cursor-pointer text-black hover:text-gray-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                </div>

                {/* Preview / Import Area */}
                <div className={`relative border rounded-lg h-64 bg-gray-50 overflow-hidden flex items-center justify-center mb-2 ${fileError ? 'border-red-400' : 'border-gray-300'}`}>
                    {/* Background Preview */}
                    <div className="absolute inset-0 opacity-20 flex flex-col p-8 pointer-events-none select-none">
                        <div className="h-4 w-32 bg-black mb-2"></div>
                        <div className="h-2 w-24 bg-gray-500 mb-8"></div>
                        <div className="flex gap-8">
                            <div className="flex-1 space-y-2">
                                <div className="h-2 w-full bg-gray-400"></div>
                                <div className="h-2 w-full bg-gray-400"></div>
                                <div className="h-2 w-3/4 bg-gray-400"></div>
                            </div>
                            <div className="w-1/3 space-y-2">
                                <div className="h-2 w-full bg-gray-400"></div>
                                <div className="h-2 w-full bg-gray-400"></div>
                            </div>
                        </div>
                    </div>

                    {/* Overlay Box */}
                    <div
                        onClick={handleImportClick}
                        className="relative z-10 bg-gray-300/80 hover:bg-gray-300 transition cursor-pointer px-8 py-4 rounded shadow-sm backdrop-blur-sm text-center"
                    >
                        <span className="font-medium text-black block">
                            {selectedFile ? selectedFile.name : "Import your file here"}
                        </span>
                        {!selectedFile && (
                            <span className="text-xs text-gray-500 mt-1 block">PDF only · Max 5 MB</span>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf"
                    />
                </div>

                {/* Inline File Error */}
                {fileError && (
                    <p className="text-red-500 text-xs mb-6 flex items-center gap-1 font-medium">
                        <span>⚠</span>{fileError}
                    </p>
                )}

                {/* Success indicator */}
                {selectedFile && !fileError && (
                    <p className="text-green-600 text-xs mb-6 flex items-center gap-1 font-medium">
                        <span>✓</span> {selectedFile.name} selected
                    </p>
                )}

                {/* Buttons */}
                <div className="flex justify-center gap-6 mt-4">
                    <button
                        onClick={handleSubmit}
                        className={`font-bold py-2 px-10 rounded-lg shadow-sm transition min-w-[140px] border ${selectedFile && !fileError
                            ? 'bg-gradient-to-b from-[#FFE587] to-[#FFB300] text-black hover:shadow-md border-[#FFB300]/50'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                            }`}
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white border border-gray-400 text-black font-bold py-2 px-10 rounded-lg hover:bg-gray-50 transition min-w-[140px]"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditResumeModal;
