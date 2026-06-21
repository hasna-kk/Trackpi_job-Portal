import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../utils/auth";

const RedirectIfSuperAdmin = ({ children }) => {
    const role = getUserRole();

    // If user is a superadmin, redirect to admin dashboard
    // If user is a superadmin, redirect to admin dashboard
    // REMOVED: User wants access to main site. Only redirect if explicit navigation to admin dashboard occurs.
    /*
    if (role === "superadmin") {
        return <Navigate to="/admin/dashboard" replace />;
    }
    */

    // Otherwise render children or Outlet
    return children ? children : <Outlet />;
};

export default RedirectIfSuperAdmin;
