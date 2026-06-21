import axios from "axios";
import { getUserRole } from "./auth";
import config from "../config";

export const redirectAfterLogin = async (navigate) => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    const role = getUserRole();

    // REMOVED: Auto-redirect admins to dashboard
    // If they login via normal site, they should go to normal profile/home.
    // if (role === "superadmin" || role === "admin") {
    //    navigate("/admin/dashboard");
    //    return;
    // }



    try {
        const res = await axios.get(`${config.API_URL}/api/profile/status`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.data?.profileCompleted) {
            navigate("/profile");
        } else {
            navigate("/create-profile");
        }
    } catch (err) {
        console.error("Redirect error:", err);

        // Token invalid or expired → force logout (Scorched Earth Policy)
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Force reload to login to be safe, or just navigate
        window.location.href = "/login";
    }
};


