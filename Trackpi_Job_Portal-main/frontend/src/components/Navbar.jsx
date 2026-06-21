import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "remixicon/fonts/remixicon.css";
import logo from "../assets/logo.png";
import LogoutModal from "./LogoutModal";

const Navbar = ({ mode = "auto" }) => {
    const [open, setOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // If mode is "public", force token to null for rendering purposes
    // If mode is "private", use actual tokens
    // If mode is "auto", use actual token (default behavior)
    const storedToken = localStorage.getItem("token");
    const token = mode === "public" ? null : storedToken;

    // Handle of Logout Confirmations
    // Handle Logout Confirmations
    // Handle Logout Confirmations
    const confirmLogout = () => {
        // 1. Clear Local Storages
        localStorage.clear();

        // 2. Clear Session Storages
        sessionStorage.clear();

        // 3. Clear Cookies (Manual Hack since we don't have a cookie library imported yet, or we can just hope clearing storage is enough. 
        // Usually tokens are in localStorage as per codes seen. 
        // But let's be safe and try to expire common cookies if possible, though HttpOnly won't be touched.)
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // 4. Force full reloads
        window.location.href = "/";
    };

    const isTransparentPage = ["/", "/about", "/testimonials", "/contact", "/jobs", "/applied-jobs"].includes(location.pathname);

    return (
        <header
            className={`w-full top-0 left-0 z-50 transition-all duration-300 ${isTransparentPage ? "absolute bg-transparent" : "fixed bg-white shadow-md"}`}
        >
            <nav className={`max-w-7xl mx-auto flex items-center justify-start px-6 md:px-10 py-4`}>

                {/* 🔥 LOGO, LEFT */}
                <Link to="/" className="flex items-center">
                    {location.pathname === "/profile" ? (
                        <span className="text-2xl font-bold text-gray-900">My Profile</span>
                    ) : location.pathname === "/testimonials" && token ? (
                        <span className="text-2xl font-bold text-gray-900">Testimonials</span>
                    ) : location.pathname === "/jobs" || location.pathname === "/browse-jobs" ? (
                        <span className="text-2xl font-bold text-gray-900">Browse Jobs</span>
                    ) : location.pathname === "/applied-jobs" ? (
                        <span className="text-2xl font-bold text-gray-900">Applied vacancies</span>
                    ) : (
                        <img
                            src={logo}
                            alt="TrackPi Logo"
                            className="h-12 w-auto object-contain"
                            style={{ 
                                mixBlendMode: "screen",
                                filter: "brightness(0.9) contrast(1.5)"
                            }}
                        />
                    )}
                </Link>

                {/* 🚀 MENU SECTION RIGHT */}
                <div className="flex items-center gap-10 ml-auto">

                    {/* 🌐 NAV LINKS (DESKTOP) */}
                    <ul className="hidden md:flex gap-10 font-medium text-gray-800 items-center text-base">
                        {token ? (
                            // 🟢 Authenticated User Menu
                            <>
                                <Link
                                    to="/profile"
                                    className={`hover:text-[#FFB300] ${location.pathname === "/profile" ? "border-b-2 border-gray-300 pb-1" : ""}`}
                                >
                                    Home
                                </Link>
                                <a href="https://chat.whatsapp.com/E4DcrDNZ3YQBpt8n01Fifv?mode=gi_t" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB300] flex items-center gap-1 text-[#2F80ED] border-b border-[#2F80ED] pb-0.5">
                                    Join our community <i className="ri-external-link-line"></i>
                                </a>
                                <Link
                                    to="/testimonials"
                                    className={`hover:text-[#FFB300] ${location.pathname === "/testimonials" ? "border-b-2 border-gray-300 pb-1" : ""}`}
                                >
                                    Testimonial
                                </Link>
                                <Link
                                    to="/browse-jobs"
                                    className={`hover:text-[#FFB300] ${location.pathname === "/browse-jobs" ? "border-b-2 border-gray-300 pb-1" : ""}`}
                                >
                                    Browse Jobs
                                </Link>
                                <Link
                                    to="/applied-jobs"
                                    className={`hover:text-[#FFB300] ${location.pathname === "/applied-jobs" ? "border-b-2 border-gray-300 pb-1" : ""}`}
                                >
                                    Applied vacancies
                                </Link>
                            </>
                        ) : (
                            // 🔵 Guest / Landing Page Menu
                            <>
                                <Link
                                    to="/"
                                    className={`${location.pathname === "/" ? "text-[#FFB300] border-b-2 border-[#FFB300] pb-1" : "hover:text-[#FFB300]"}`}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/about"
                                    className={`${location.pathname === "/about" ? "text-[#FFB300] border-b-2 border-[#FFB300] pb-1" : "hover:text-[#FFB300]"}`}
                                >
                                    About us
                                </Link>
                                <Link
                                    to="/testimonials"
                                    className={`${location.pathname === "/testimonials" ? "text-[#FFB300] border-b-2 border-[#FFB300] pb-1" : "hover:text-[#FFB300]"}`}
                                >
                                    Testimonial
                                </Link>
                                <Link
                                    to="/talent-league"
                                    className="text-[#1877F2] border-b-2 border-[#1877F2] pb-1"
                                >
                                    Talent League
                                </Link>
                                <Link
                                    to="/contact"
                                    className={`${location.pathname === "/contact" ? "text-[#FFB300] border-b-2 border-[#FFB300] pb-1" : "hover:text-[#FFB300]"}`}
                                >
                                    Contact us
                                </Link>
                            </>
                        )}
                    </ul>

                    {/* 🟡 AUTH BUTTONS (DESKTOP) */}

                    <div className="hidden md:flex gap-3 items-center">
                        {token ? (
                            // Authenticated Logout Button
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="w-[122px] h-[32px] bg-white border border-[#FFB300] rounded-[5px] text-gray-800 font-medium text-base shadow-sm hover:bg-[#FFB300] hover:text-white transition flex items-center justify-center p-0"
                            >
                                Log out
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-6 py-2 hover:text-[#FFB300] transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-2 bg-[#FFB300] rounded-full text-black font-semibold shadow hover:bg-[#ffca2c] transition"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* 📱 MOBILE MENU BUTTON */}
                    <button
                        className="md:hidden text-3xl ml-auto active:scale-90 transition"
                        onClick={() => setOpen(!open)}
                    >
                        {open
                            ? <i className="ri-close-line"></i>
                            : <i className="ri-menu-line"></i>
                        }
                    </button>
                </div>
            </nav>

            {/* 📱 MOBILE DROPDOWN MENU */}

            {open && (
                <div className="md:hidden bg-white py-6 px-6 space-y-6 shadow-lg animate-slideDown z-50 fixed top-[80px] left-0 w-full border-t border-gray-100">
                    <ul className="flex flex-col gap-4 font-medium text-gray-700">
                        {token ? (
                            // 🟢 Authenticated Mobile Menu
                            <>
                                <Link to="/profile" onClick={() => setOpen(false)}>Home</Link>
                                <a href="https://chat.whatsapp.com/E4DcrDNZ3YQBpt8n01Fifv?mode=gi_t" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Join our community</a>
                                <Link to="/testimonials" onClick={() => setOpen(false)}>Testimonial</Link>
                                <Link to="/browse-jobs" onClick={() => setOpen(false)}>Browse Jobs</Link>
                                <Link to="/applied-jobs" onClick={() => setOpen(false)}>Applied vacancies</Link>
                            </>
                        ) : (
                            // 🔵 Guest Mobile Menu

                            <>
                                <Link to="/" onClick={() => setOpen(false)} className={`w-fit ${location.pathname === "/" ? "text-[#FFB300] border-b-2 border-[#FFB300] pb-1" : ""}`}>Home</Link>
                                <Link to="/about" onClick={() => setOpen(false)} className={`w-fit ${location.pathname === "/about" ? "text-[#FFB300] border-b-2 border-[#FFB300] pb-1" : ""}`}>About us</Link>
                                <Link to="/testimonials" onClick={() => setOpen(false)} className={`w-fit ${location.pathname === "/testimonials" ? "text-[#FFB300] border-b-2 border-[#FFB300] pb-1" : ""}`}>Testimonial</Link>
                                <Link to="/talent-league" onClick={() => setOpen(false)} className="w-fit text-[#1877F2] border-b-2 border-[#1877F2] pb-1">Talent League</Link>
                                <Link to="/contact" onClick={() => setOpen(false)} className={`w-fit ${location.pathname === "/contact" ? "text-[#FFB300] border-b-2 border-[#FFB300] pb-1" : ""}`}>Contact us</Link>
                            </>
                        )}
                    </ul>

                    <div className="flex flex-col gap-3 pt-4">
                        {token ? (
                            // Authenticated Mobile Logout
                            <button
                                onClick={() => {
                                    setShowLogoutModal(true);
                                    setOpen(false);
                                }}
                                className="px-6 py-2 bg-white border border-[#FFB300] text-center rounded-lg text-black font-medium hover:bg-[#FFB300] hover:text-white"
                            >
                                Log out
                            </button>
                        ) : (
                            // Default Login/Signup
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                    className="px-6 py-2 border rounded-full font-medium text-center hover:bg-gray-100">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setOpen(false)}
                                    className="px-6 py-2 bg-[#FFB300] text-center rounded-full font-semibold hover:bg-[#ffca2c]">
                                    Get started
                                </Link>
                            </>

                        )}

                    </div>
                </div>
            )}
            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <LogoutModal
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={confirmLogout}
                />
            )}
        </header>
    );
};


export default Navbar;
