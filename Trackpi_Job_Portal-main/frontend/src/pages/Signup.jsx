import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { API_URL } from "../config";

import loginIllustration from "../assets/illustrations/login-illustration.png";
import { redirectAfterLogin } from "../utils/redirectAfterLogin";

import config from "../config";

const Signup = () => {
    const navigate = useNavigate();

    /* ---------------- GOOGLE SIGNUP ---------------- */
    const handleGoogleSignup = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.post(`${config.API_URL}/api/auth/google`, {
                    access_token: tokenResponse.access_token,
                });

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                redirectAfterLogin(navigate);
            } catch (error) {
                console.error("Google signup failed:", error.response?.data || error.message);
                alert("Google signup failed");
            }
        },
        onError: () => alert("Google signup failed"),
    });

    /* ---------------- LINKEDIN SIGNUP (OPENID CONNECT) ---------------- */
    const handleLinkedInAuth = () => {
        const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
        const redirectUri = "http://localhost:5173/linkedin/callback";
        const scope = "openid profile email";

        const state = Math.random().toString(36).substring(2);
        localStorage.setItem("linkedin_oauth_state", state);

        const authUrl =
            "https://www.linkedin.com/oauth/v2/authorization" +
            "?response_type=code" +
            `&client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&state=${state}`;

        window.location.href = authUrl;
    };

    return (
        <section className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F2F2_60%,#A6A6A6_100%)] flex items-center justify-center p-4">
            <div className="max-w-[1280px] w-full flex flex-col md:flex-row items-center justify-between px-4 lg:px-16 gap-10">

                {/* ================= LEFT ================= */}
                <div className="max-w-[564px] text-left">
                    <button onClick={() => navigate(-1)} className="mb-8 font-semibold">
                        ← Back
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-[48px] font-black leading-tight">
                            One Step Closer To <br /> Your Dream Job
                        </h1>

                        <img
                            src={loginIllustration}
                            className="w-full max-w-[360px] my-4"
                            alt="Signup Illustration"
                        />

                        <p className="text-black max-w-[455px] text-center">
                            Trackpi is one of the best business consulting firms in Kerala.
                        </p>
                    </div>
                </div>

                {/* ================= RIGHT CARD ================= */}
                <div className="w-[515px] h-[514px] bg-white border border-black rounded-[50px] p-[55px] flex flex-col justify-center text-center">

                    <h2 className="text-2xl font-bold mb-[35px]">
                        Welcome To <span className="text-[#FFB300]">Trackpi</span>
                    </h2>

                    {/* GOOGLE */}
                    <button
                        onClick={() => handleGoogleSignup()}
                        className="w-full py-2 flex justify-center gap-3 font-semibold"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                            alt="Google"
                        />
                        Sign up with Google
                    </button>

                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-[1.5px] bg-gray-300"></div>
                        <span>Or</span>
                        <div className="flex-1 h-[1.5px] bg-gray-300"></div>
                    </div>

                    {/* LINKEDIN */}
                    <button
                        onClick={handleLinkedInAuth}
                        className="w-full py-2 flex justify-center gap-3 font-semibold"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475661/linkedin-color.svg"
                            className="w-5 h-5"
                            alt="LinkedIn"
                        />
                        Sign up with LinkedIn
                    </button>

                    <p className="text-sm mt-8">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-[#FFB300] cursor-pointer font-semibold"
                        >
                            Login
                        </span>
                    </p>

                </div>
            </div>
        </section>
    );
};
export default Signup;