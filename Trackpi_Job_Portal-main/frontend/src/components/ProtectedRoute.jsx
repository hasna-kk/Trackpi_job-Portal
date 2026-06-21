import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    // Single source of truth: localStorage
    const token = localStorage.getItem("token");

    // If no token, strictly block access and redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Render child routes via Outlet
    return <Outlet />;
};

export default ProtectedRoute;
