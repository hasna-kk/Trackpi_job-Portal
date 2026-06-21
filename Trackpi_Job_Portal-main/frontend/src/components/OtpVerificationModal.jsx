import React, { useState, useRef, useEffect } from "react";
import otpShield from "../assets/illustrations/otp-shield.jpg"; // Adjust path if needed

const OtpVerificationModal = ({ isOpen, onClose, phone, onVerify, onResend }) => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (isOpen) {
            setOtp(["", "", "", ""]);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace behavior
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 4).split("");
        if (pastedData.length > 0) {
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (i < 4 && !isNaN(char)) newOtp[i] = char;
            });
            setOtp(newOtp);
            inputRefs.current[Math.min(pastedData.length, 3)]?.focus();
        }
    };

    const handleSubmit = () => {
        onVerify(otp.join(""));
    };

    if (!isOpen) return null;

    // Mask phone number: 91*******45
    // Assuming phone comes in full format like +919876543210 or 919876543210
    // We want to show first 2 and last 2 digits approx.
    const maskedPhone = phone && phone.length > 4
        ? `${phone.slice(0, 2)}*******${phone.slice(-2)}`
        : phone;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white rounded-[20px] p-8 w-[400px] relative shadow-2xl flex flex-col items-center text-center">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-xl"
                >
                    ✕
                </button>

                {/* Illustration */}
                <div className="mb-4">
                    <img src={otpShield} alt="Security Shield" className="h-32 w-auto object-contain" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-black mb-2">Verify your code</h2>

                {/* Subtitle */}
                <p className="text-xs text-gray-500 mb-6 max-w-[250px]">
                    We have sent a code to your WhatsApp number is {maskedPhone}
                </p>

                {/* OTP Inputs */}
                <div className="flex gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-12 h-12 border border-[#FFB300] rounded-lg text-center text-xl font-bold outline-none focus:ring-2 focus:ring-[#FFB300] bg-[#FFF9E5]"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-[#FFB300] text-black font-bold py-3 rounded-xl hover:bg-[#ffaa00] transition active:scale-95 mb-4"
                >
                    Verify
                </button>

                {/* Resend Link */}
                <p className="text-sm text-gray-600">
                    Didn't receive code?{" "}
                    <button
                        onClick={onResend}
                        className="text-[#FFB300] font-bold hover:underline"
                    >
                        Resend
                    </button>
                </p>

            </div>
        </div>
    );
};

export default OtpVerificationModal;
