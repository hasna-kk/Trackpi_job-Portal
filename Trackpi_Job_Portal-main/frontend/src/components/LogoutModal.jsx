import React from "react";
import logoutIllustration from "../assets/logout_illustration.png";

const LogoutModal = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            {/* Modal Content */}
            <div className="bg-white rounded-[24px] p-8 w-[90%] max-w-[400px] flex flex-col items-center shadow-2xl relative animate-scaleUp">

                {/* Illustration */}
                <div className="w-full h-[200px] flex items-center justify-center mb-4">
                    <img
                        src={logoutIllustration}
                        alt="Logout Illustration"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Text */}
                <h2 className="text-[22px] font-bold text-black mb-2 text-center">
                    Are you logging out?
                </h2>
                <p className="text-[14px] text-gray-500 mb-8 text-center font-medium">
                    You can always back at any time.
                </p>

                {/* Buttons */}
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-[8px] bg-gradient-to-b from-[#FFE580] to-[#FFCC00] text-black font-semibold border-none hover:opacity-90 transition-opacity text-sm shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-[8px] bg-white text-black font-semibold border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
