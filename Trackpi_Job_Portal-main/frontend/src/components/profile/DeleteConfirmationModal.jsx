import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-[20px] shadow-xl w-[90%] md:w-[757px] h-auto md:h-[140px] flex flex-col items-center justify-center gap-4 animate-scaleIn relative overflow-hidden px-4 py-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-center text-gray-900">
                    {title || "Are you sure?"}
                </h3>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={onConfirm}
                        className="w-[140px] h-[40px] rounded-lg text-black font-semibold shadow-md transition-transform active:scale-95 bg-gradient-to-r from-[#FFFFFF] to-[#FFB300] border border-gray-100/50 flex items-center justify-center"
                        style={{
                            background: "linear-gradient(90deg, #FFFFFF 0%, #FFB300 100%)"
                        }}
                    >
                        Delete
                    </button>

                    <button
                        onClick={onClose}
                        className="w-[140px] h-[40px] rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
