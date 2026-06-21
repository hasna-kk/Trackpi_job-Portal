import { Navigate, Outlet } from "react-router-dom";

const RedirectIfAuthenticated = () => {
    // Single source of truth: localStorage
    const token = localStorage.getItem("token");

    // If token exists, block access to Login/Signup and redirect to Profile
    if (token) {
        return <Navigate to="/profile" replace />;
    }

    // Render public auth routes via Outlet
    return <Outlet />;
};

export default RedirectIfAuthenticated;
