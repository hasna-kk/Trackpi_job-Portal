import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { redirectAfterLogin } from "../../utils/redirectAfterLogin";
import { getUserRole } from "../../utils/auth";
import { API_URL } from "../../config";
import logo from "../../assets/logo.png"; // Assuming logo exists

const AdminLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already logged in as admin
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = getUserRole();
        if (token && (role === "admin" || role === "superadmin" || role === "superuser")) {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const handleAdminLoginSuccess = (user, token) => {
        // Strict Role Check
        if (user.role === "admin" || user.role === "superadmin" || user.role === "superuser") {
            // Save Check
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/admin/dashboard");
        } else {
            // Reject JobSeekers
            setError("Unauthorized: Access restricted to Administrators.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    };

    /* ---------------- GOOGLE LOGIN ---------------- */
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                setError("");
                const res = await axios.post(`${API_URL}/api/auth/google`, {
                    access_token: tokenResponse.access_token,
                });
                handleAdminLoginSuccess(res.data.user, res.data.token);
            } catch (error) {
                console.error("Google login failed (Frontend):", error);
                // Extract precise message if available
                const msg = error.response?.data?.message || "Google login failed. Please try again.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        },
        onError: () => setError("Google login failed"),
    });


    /* ---------------- LINKEDIN LOGIN ---------------- */


    return (
        <div className="min-h-screen bg-[#FFD54F] flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-12 text-center">
                <div className="flex justify-center mb-6">
                    {/* Placeholder for Logo */}
                    {/* Logo */}
                    <img
                        src={logo}
                        alt="TrackPi Logo"
                        className="h-16 w-auto mb-2"
                    />
                </div>

                <h2 className="text-3xl font-bold text-black mb-2">Admin Portal</h2>
                <p className="text-black/80 mb-8">Restricted access for authorized personnel only.</p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* GOOGLE */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-3.5 px-4 flex justify-center items-center gap-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 shadow-sm"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                            alt="Google"
                        />
                        {loading ? "Verifying..." : "Sign in with Google"}
                    </button>

                    {/* LINKEDIN */}

                </div>

                <div className="mt-8 pt-6 border-t border-black/10">
                    <p className="text-xs text-black/60">
                        By signing in, you agree to the internal security protocols.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
