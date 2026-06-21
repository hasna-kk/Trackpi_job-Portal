import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    UserPlus,
    Users,
    FileText,
    Handshake,
    MessageSquare,
    ShieldCheck,
    Lock,
    FileInput,
    Megaphone,
    Trophy,
    Video,
    Award,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Settings,
} from "lucide-react";
import logo from "../assets/logo.png";
import { PERMISSIONS } from "../constants/permissions";
import { getUserRole, getDecodedToken } from "../utils/auth";

const AdminLayout = () => {
    // Add scrollbar-hide CSS
    const scrollbarHideStyle = {
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none'
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openDropdowns, setOpenDropdowns] = useState({});
    const location = useLocation();
    const navigate = useNavigate();

    const toggleDropdown = (name) => {
        setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
        if (!isSidebarOpen) setIsSidebarOpen(true);
    };

    // Auth State
    const role = getUserRole();
    const decodedToken = getDecodedToken();
    const userPermissions = decodedToken?.permissions || [];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin/login");
    };

    // DEBUG: Fetch fresh permissions on mount
    const [debugPermissions, setDebugPermissions] = useState(null);
    useState(() => {
        const fetchMe = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setDebugPermissions(data.permissions);
            } catch (error) {
                console.error("Debug fetch failed:", error);
            }
        };
        fetchMe();
    }, []);

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW },
        {
            name: "Jobs",
            icon: Briefcase,
            children: [
                { name: "Job Posts", path: "/admin/jobs", icon: Briefcase, permission: PERMISSIONS.JOBS_VIEW },
                { name: "Job applicants", path: "/admin/candidates/applicants", icon: Users, permission: PERMISSIONS.APPLICANTS_VIEW },
            ]
        },
        { name: "Signup candidates", path: "/admin/candidates/signup", icon: UserPlus, permission: PERMISSIONS.SIGNUP_VIEW },
        { name: "Resume candidates", path: "/admin/candidates/resume", icon: FileText, permission: PERMISSIONS.RESUME_VIEW },
        { name: "Our hiring partners", path: "/admin/partners", icon: Handshake, permission: PERMISSIONS.PARTNERS_VIEW },
        { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquare, permission: PERMISSIONS.TESTIMONIALS_VIEW },
        { name: "Our team", path: "/admin/team", icon: Users, permission: PERMISSIONS.TEAM_VIEW },
        {
            name: "Role Management",
            icon: ShieldCheck,
            children: [
                { name: "Admin management", path: "/admin/management", icon: ShieldCheck, permission: PERMISSIONS.ADMIN_VIEW },
                { name: "User permission", path: "/admin/permissions", icon: Lock, permission: PERMISSIONS.ROLES_VIEW },
                { name: "User management", path: "/admin/users", icon: Users, permission: PERMISSIONS.USERS_VIEW },
            ]
        },
        { name: "Form management", path: "/admin/forms", icon: FileInput, permission: PERMISSIONS.FORMS_MANAGE },
        { name: "System Settings", path: "/admin/settings", icon: Settings, permission: PERMISSIONS.SETTINGS_MANAGE },
        {
            name: "Talent League",
            icon: Trophy,
            children: [
                { name: "Ad competition", path: "/admin/competition", icon: Megaphone, permission: PERMISSIONS.COMPETITION_VIEW },
                { name: "competition Testimonials", path: "/admin/competition/testimonials", icon: MessageSquare, permission: PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW },
                { name: "competition candidates", path: "/admin/competition/candidates", icon: Trophy, permission: PERMISSIONS.COMPETITION_CANDIDATES_VIEW },
                { name: "Video management", path: "/admin/competition/videos", icon: Video, permission: PERMISSIONS.VIDEO_VIEW },
                { name: "Previous Winners", path: "/admin/winners", icon: Award, permission: PERMISSIONS.WINNERS_VIEW },
            ]
        },
    ];

    return (
        <div className="flex h-screen bg-white font-sans">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-[326px]" : "w-20"
                    } transition-all duration-300 flex flex-col fixed h-full z-20`}
                style={{
                    background: "linear-gradient(85.95deg, #FBFAF8 6.86%, #D9D9D9 80.11%)",
                    border: "1px solid #827E7E"
                }}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-10 bg-yellow-400 p-1 rounded-full shadow-md hover:bg-yellow-500 transition"
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* Logo */}
                <div className="h-20 flex items-center justify-center">
                    {isSidebarOpen ? (
                        <img src={logo} alt="TrackPi" className="h-10 mt-4" style={{ mixBlendMode: 'screen', filter: 'brightness(0.9) contrast(1.5)' }} />
                    ) : (
                        <span className="text-xl font-bold text-yellow-500 mt-4">TP</span>
                    )}
                </div>

                {/* Navigation */}
                <nav 
                    className="flex-1 overflow-y-auto pt-[20px] pb-4"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    <style>
                        {`
                          nav::-webkit-scrollbar {
                            display: none;
                          }
                          main::-webkit-scrollbar {
                            display: none;
                          }
                        `}
                    </style>
                    <ul className="space-y-[4px] px-0">
                        {menuItems.map((item, index) => {
                            // Filter Logic
                            if (role !== "superadmin" && role !== "admin") {
                                if (item.superAdminOnly) return null;
                                if (item.children) {
                                    const visibleChildren = item.children.filter(child => userPermissions.includes(child.permission));
                                    if (visibleChildren.length === 0) return null;
                                } else if (item.permission && !userPermissions.includes(item.permission)) {
                                    return null;
                                }
                            }

                            // Additional check for Safe Admin Mode for Admin role
                            if (role === "admin" && item.superAdminOnly) {
                                return null;
                            }

                            // Dropdown Menu Item
                            if (item.children) {
                                const isActive = item.children.some((child) => location.pathname === child.path);
                                const isOpen = openDropdowns[item.name];

                                return (
                                    <li key={index} className="space-y-1 ml-[11px]">
                                        <button
                                            onClick={() => toggleDropdown(item.name)}
                                            className={`
                                                w-[314px] h-[51px] flex items-center justify-between px-4 transition-all duration-200 rounded-[5px]
                                                ${isActive || isOpen
                                                    ? "bg-[#FFA500] text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={20} className={isActive || isOpen ? "text-white" : "text-gray-500"} />
                                                {isSidebarOpen && (
                                                    <span className="font-medium text-sm whitespace-nowrap">
                                                        {item.name}
                                                    </span>
                                                )}
                                            </div>
                                            {isSidebarOpen && (
                                                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isActive || isOpen ? "text-white" : "text-gray-400"}`} />
                                            )}
                                        </button>

                                        {isSidebarOpen && isOpen && (
                                            <ul className="mt-1 space-y-1">
                                                {item.children.map((child, childIdx) => {
                                                    if (role !== "superadmin" && role !== "admin" && !userPermissions.includes(child.permission)) return null;

                                                    const isChildActive = location.pathname === child.path;
                                                    return (
                                                        <li key={childIdx} className="mt-1">
                                                            <Link
                                                                to={child.path}
                                                                className={`
                                                                    flex items-center gap-3 w-[314px] h-[40px] px-4 pl-11 transition-all duration-200 rounded-[5px]
                                                                    ${isChildActive
                                                                        ? "bg-[#FFA500] text-white shadow-md font-bold"
                                                                        : "bg-white text-gray-600 hover:bg-gray-50 border-t border-gray-50"
                                                                    }
                                                                `}
                                                            >
                                                                <child.icon size={16} className={isChildActive ? "text-white" : "text-gray-400"} />
                                                                <span className="font-medium text-sm whitespace-nowrap">
                                                                    {child.name}
                                                                </span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }

                            // Standard Nav Item
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={index} className="ml-[11px]">
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 w-[314px] h-[51px] px-4 transition-all duration-200 rounded-[5px] ${isActive ? "bg-[#FFA500] text-white shadow-md font-bold" : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"}`}
                                    >
                                        <item.icon size={20} className={isActive ? "text-white" : "text-gray-500"} />
                                        {isSidebarOpen && (
                                            <span className="font-medium text-sm whitespace-nowrap">
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className={`
              flex items-center gap-2 w-[314px] h-[51px] px-6 transition-all rounded-[5px] ml-[11px]
              ${!isSidebarOpen ? "justify-center" : "justify-start"}
              text-[#FFA500] bg-white hover:bg-gray-50 shadow-sm
            `}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
                    </button>
                    {isSidebarOpen && (
                        <div className="mt-2 text-xs font-bold text-gray-400 text-center uppercase tracking-wider">
                            {role === "superadmin" ? "Super Admin" : role === "admin" ? "Admin" : "Super User"}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[326px]" : "ml-20"
                    } p-8 overflow-y-auto`}
                style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
