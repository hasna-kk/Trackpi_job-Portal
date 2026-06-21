import { useNavigate } from "react-router-dom";
import lockImage from "../assets/icons/lock.png";


const LoginRequiredModal = ({ onClose }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-backgroundFade"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Modal Container */}
            <div className="relative bg-gradient-to-tr from-[#FFF5D1] via-white via-40% to-white rounded-[35px] w-[460px] p-8 pb-10 shadow-2xl text-center flex flex-col items-center animate-fadeIn overflow-hidden border border-gray-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-6 text-2xl font-bold text-black hover:scale-110 transition-transform"
                >
                    ✕
                </button>

                {/* Header Text */}
                <h2 className="text-[26px] font-bold text-black mt-4 leading-tight">
                    Your Career Journey Starts Here
                </h2>

                {/* Subheader Text */}
                <p className="text-[15px] font-medium text-[#FFB300] mt-1 mb-4">
                    Please log in/sign up and Find Your Dream Job Faster
                </p>

                {/* Lock Image */}
                <div className="relative w-full flex justify-center mb-6">
                    <img
                        src={lockImage}
                        alt="Security Lock"
                        className="w-[240px] object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Log In Button */}
                <button
                    onClick={() => navigate("/login")}
                    className="w-[70%] bg-gradient-to-r from-white via-[#FFD54F] to-[#FFB300] border-[1.5px] border-black text-black text-lg font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                    Log in
                </button>
            </div>
        </div>
    );
};

export default LoginRequiredModal;
