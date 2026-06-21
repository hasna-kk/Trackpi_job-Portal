import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { redirectAfterLogin } from "../utils/redirectAfterLogin";

const LinkedInCallback = () => {
    const navigate = useNavigate();

    const called = useRef(false);

    useEffect(() => {
        const run = async () => {
            if (called.current) return; // 🛑 Prevent double execution
            called.current = true;

            try {
                const params = new URLSearchParams(window.location.search);
                const code = params.get("code");
                const error = params.get("error");
                const state = params.get("state");

                if (error) {
                    alert("LinkedIn login cancelled");
                    navigate("/login");
                    return;
                }

                if (!code) {
                    // If no code, maybe it's just a remount or empty URL, don't alert yet
                    return;
                }

                // ===== CSRF CHECK =====
                const storedState = localStorage.getItem("linkedin_oauth_state");
                if (!storedState || storedState !== state) {
                    alert("Invalid OAuth state. Please try again.");
                    navigate("/login");
                    return;
                }

                // ===== Send code to backend =====
                const res = await axios.post(`${config.API_URL}/api/auth/linkedin`, {
                    code,
                });

                // ===== Cleanup =====
                localStorage.removeItem("linkedin_oauth_state");

                // ===== Save auth =====
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                redirectAfterLogin(navigate);
            } catch (err) {
                console.error("LinkedIn callback error:", err.response?.data || err.message);
                const errorMessage = err.response?.data?.message || err.message || "Unknown error";
                alert(`LinkedIn login failed: ${errorMessage}`);
                navigate("/login");
            }
        };

        run();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center text-xl font-bold">
            Logging you in with LinkedIn...
        </div>
    );
};

export default LinkedInCallback;
