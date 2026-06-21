import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-black hover:text-gray-600 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const TrashIcon = ({ className, onClick }) => (
    <svg onClick={onClick} className={`cursor-pointer text-black hover:text-gray-600 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const DownloadIcon = ({ className }) => (
    <svg className={`cursor-pointer text-black hover:text-gray-600 transition ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const getDownloadUrl = (url) => {
    if (!url) return '';
    try {
        if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
            let filename = decodeURIComponent(url.split('/').pop());
            if (!filename.toLowerCase().endsWith('.pdf')) {
                filename += '.pdf';
            }
            return url.replace('/upload/', `/upload/fl_attachment:${encodeURIComponent(filename)}/`);
        }
    } catch(e) {
        // Fallback
    }
    return url;
};

const ResumeSection = ({ resumeUrl, onAdd, onEdit, onDelete, isGlobalComplete, readOnly = false }) => {
    const navigate = useNavigate();

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            // Attempt to fetch and create a blob to force explicit local download with the correct extension
            const response = await fetch(resumeUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            let filename = decodeURIComponent(resumeUrl.split('/').pop());
            if (!filename.toLowerCase().endsWith('.pdf')) {
                filename += '.pdf';
            }
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (err) {
            // Fallback to opening in new tab if CORS prevents fetching
            window.open(resumeUrl, '_blank');
        }
    };

    const handleATSClick = () => {
        if (readOnly) return;
        navigate("/resume-gen", { state: { from: "/profile" } });
    };

    return (
        <div className="pt-5 pb-0">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-black">Resume</h2>
                <div className="flex gap-4 items-center">
                    {/* Import/Download Icon */}
                    {resumeUrl && (
                        <a href="#" onClick={handleDownload} className="text-black hover:text-gray-600 transition" title="Download Resume">
                            <DownloadIcon className="w-[18px] h-[18px]" />
                        </a>
                    )}

                    {/* Edit Icon */}
                    {!readOnly && <EditIcon className="w-[18px] h-[18px]" onClick={onEdit} />}

                    {/* Delete Icon */}
                    {!readOnly && resumeUrl && (
                        <TrashIcon className="w-[18px] h-[18px]" onClick={onDelete} />
                    )}
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-2 max-w-[400px] bg-white">
                <div className="flex gap-4 items-center">
                    {resumeUrl ? (
                        <>
                            <div className="w-12 h-16 bg-red-50 border border-red-100 rounded flex flex-col items-center justify-center relative">
                                <span className="text-[10px] font-bold text-red-500">PDF</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate" title={resumeUrl.split('/').pop()}>{decodeURIComponent(resumeUrl.split('/').pop())}</p>
                                <a href="#" onClick={handleDownload} className="text-xs text-[#FFB300] hover:underline">Download Resume</a>
                            </div>
                        </>
                    ) : (
                        <div className={`w-full h-20 flex flex-col items-center justify-center text-gray-400 ${!readOnly ? 'cursor-pointer hover:bg-gray-50' : ''} transition`} onClick={!readOnly ? onAdd : undefined}>
                            <span className="text-sm">No resume uploaded</span>
                            {!readOnly && <span className="text-xs text-[#FFB300] font-medium mt-1">Click to upload</span>}
                        </div>
                    )}
                </div>
            </div>

            {!readOnly && (
                <button
                    onClick={handleATSClick}
                    style={{
                        width: '238px',
                        height: '46px',
                        borderRadius: '8px',
                        border: '1px solid #827E7E',
                        background: 'linear-gradient(90deg, #D9D9D9 0%, rgba(153, 153, 153, 0.00) 76%)'
                    }}
                    className={`mt-4 font-bold text-sm shadow-sm flex items-center justify-center text-black hover:shadow-md transition`}
                >
                    Create ATS friendly CV
                </button>
            )}
        </div>
    );
};

export default ResumeSection;
