import React from 'react';
import { Trash2 } from "lucide-react";

const DeleteUserModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 3D Icon Placeholder - Using Lucide + CSS to mimic from PermissionManagement */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {/* Back folder part */}
                        <div className="absolute top-0 left-0 w-16 h-12 bg-[#FFD137] rounded-lg -rotate-6 transform origin-bottom-left"></div>
                        {/* Front folder part */}
                        <div className="relative w-16 h-12 bg-[#FFB300] rounded-lg shadow-lg flex items-center justify-center z-10">
                            {/* Red delete badge */}
                            <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-md border-2 border-white">
                                <Trash2 size={16} className="text-white" />
                            </div>
                            <div className="w-8 h-1 bg-white/30 rounded-full mb-1"></div>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title || "Delete Item"}</h3>
                    <p className="text-gray-500 text-sm">{message || "Sure you want to delete"}</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-[#FFB300] text-[#FFB300] font-semibold hover:bg-yellow-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFB300] text-black font-bold shadow-md hover:shadow-lg hover:bg-[#ffca2c] transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;
