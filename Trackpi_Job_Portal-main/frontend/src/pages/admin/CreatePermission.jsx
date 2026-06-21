import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PERMISSIONS } from "../../constants/permissions";
import { API_URL } from "../../config";

const MODULES_CONFIG = [
    {
        label: "Dashboard",
        key: "dashboard",
        permissions: [
            { label: "View Dashboard", value: PERMISSIONS.DASHBOARD_VIEW, isView: true }
        ]
    },
    {
        label: "Jobs",
        key: "jobs",
        permissions: [
            { label: "View", value: PERMISSIONS.JOBS_VIEW, isView: true },
            { label: "Post job", value: PERMISSIONS.JOBS_POST },
            { label: "job status", value: PERMISSIONS.JOBS_UPDATE_STATUS },
            { label: "View more about job", value: PERMISSIONS.JOBS_VIEW_DETAILS },
            { label: "Pending candidates", value: PERMISSIONS.JOBS_VIEW_PENDING_CANDIDATES },
            { label: "All candidates", value: PERMISSIONS.JOBS_VIEW_ALL_CANDIDATES },
            { label: "New/Urgent Job", value: PERMISSIONS.JOBS_NEW_URGENT_JOB },
            { label: "Edit", value: PERMISSIONS.JOBS_EDIT },
        ]
    },
    {
        label: "Signup candidates",
        key: "signup_candidates",
        permissions: [
            { label: "View", value: PERMISSIONS.SIGNUP_VIEW, isView: true },
            { label: "Download Resume", value: PERMISSIONS.SIGNUP_DOWNLOAD_RESUME },
            { label: "View Details", value: PERMISSIONS.SIGNUP_VIEW_DETAILS },
            { label: "Delete", value: PERMISSIONS.SIGNUP_DELETE },
        ]
    },
    {
        label: "Job applicants",
        key: "job_applicants",
        permissions: [
            { label: "View", value: PERMISSIONS.APPLICANTS_VIEW, isView: true },
            { label: "Download Resume", value: PERMISSIONS.APPLICANTS_DOWNLOAD_RESUME },
            { label: "View Details", value: PERMISSIONS.APPLICANTS_VIEW_DETAILS },
            { label: "Delete", value: PERMISSIONS.APPLICANTS_DELETE },
        ]
    },
    {
        label: "Resume build candidates",
        key: "resume_build_candidates",
        permissions: [
            { label: "View", value: PERMISSIONS.RESUME_VIEW, isView: true },
            { label: "Download Resume", value: PERMISSIONS.RESUME_DOWNLOAD },
            { label: "Delete", value: PERMISSIONS.RESUME_DELETE },
        ]
    },
    {
        label: "Hiring partners",
        key: "hiring_partners",
        permissions: [
            { label: "View", value: PERMISSIONS.PARTNERS_VIEW, isView: true },
            { label: "Add", value: PERMISSIONS.PARTNERS_ADD },
            { label: "View Details", value: PERMISSIONS.PARTNERS_VIEW_DETAILS },
            { label: "Edit", value: PERMISSIONS.PARTNERS_EDIT },
            { label: "Delete", value: PERMISSIONS.PARTNERS_DELETE },
        ]
    },
    {
        label: "Testimonials",
        key: "testimonials",
        permissions: [
            { label: "View", value: PERMISSIONS.TESTIMONIALS_VIEW, isView: true },
            { label: "Add", value: PERMISSIONS.TESTIMONIALS_ADD },
            { label: "View Details", value: PERMISSIONS.TESTIMONIALS_VIEW_DETAILS },
            { label: "Edit", value: PERMISSIONS.TESTIMONIALS_EDIT },
            { label: "Delete", value: PERMISSIONS.TESTIMONIALS_DELETE },
        ]
    },
    {
        label: "Form management",
        key: "form_management",
        permissions: [
            { label: "View", value: PERMISSIONS.FORMS_MANAGE, isView: true },
        ]
    },
    {
        label: "Ad competition",
        key: "ad_competition",
        permissions: [
            { label: "View", value: PERMISSIONS.COMPETITION_VIEW, isView: true },
            { label: "Add", value: PERMISSIONS.COMPETITION_ADD },
            { label: "Edit", value: PERMISSIONS.COMPETITION_EDIT },
        ]
    },
    {
        label: "Competition Testimonials",
        key: "competition_testimonials",
        permissions: [
            { label: "View", value: PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW, isView: true },
            { label: "Edit", value: PERMISSIONS.COMPETITION_TESTIMONIALS_EDIT },
            { label: "Delete", value: PERMISSIONS.COMPETITION_TESTIMONIALS_DELETE },
        ]
    },
    {
        label: "Competition Candidates",
        key: "competition_candidates",
        permissions: [
            { label: "View", value: PERMISSIONS.COMPETITION_CANDIDATES_VIEW, isView: true },
        ]
    },
    {
        label: "Video management",
        key: "video_management",
        permissions: [
            { label: "View", value: PERMISSIONS.VIDEO_VIEW, isView: true },
            { label: "Add", value: PERMISSIONS.VIDEO_ADD },
            { label: "Edit", value: PERMISSIONS.VIDEO_EDIT },
            { label: "Delete", value: PERMISSIONS.VIDEO_DELETE },
        ]
    },
    {
        label: "Previous Winners",
        key: "previous_winners",
        permissions: [
            { label: "View", value: PERMISSIONS.WINNERS_VIEW, isView: true },
            { label: "Add", value: PERMISSIONS.WINNERS_ADD },
            { label: "Edit", value: PERMISSIONS.WINNERS_EDIT },
            { label: "Delete", value: PERMISSIONS.WINNERS_DELETE },
        ]
    },
    {
        label: "System Settings",
        key: "system_settings",
        permissions: [
            { label: "View & Manage Settings", value: PERMISSIONS.SETTINGS_MANAGE, isView: true },
        ]
    }
];

const CreatePermission = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [roleName, setRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAdmins();
        if (isEditMode) {
            fetchRoleDetails();
        }
    }, [id]);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/users?role=superuser`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    const fetchRoleDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const role = response.data.find(r => r._id === id);
            if (role) {
                setRoleName(role.name);
                setSelectedPermissions(role.permissions);
                setSelectedAdmins(role.users.map(u => u._id));
            }
        } catch (error) {
            console.error("Error fetching role details:", error);
        }
    };

    const handleTogglePermission = (permission) => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
        } else {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };

    // Helper to toggle all in a section
    const handleToggleSection = (sectionPermissions) => {
        // Only target NON-HIDDEN permissions for UI toggling
        // OR target ALL for selection, but filter "isView" for deselection logic? 
        // Simplest: Toggle all real permissions. The "isView" one is auto-handled on save.
        // Wait, if we toggle ON, we should select all visible. If OFF, deselect all.
        // The "isView" perm will also be selected/deselected internally to keep state consistent?
        // Actually, let's just toggle ALL values including hidden ones so state is clean.
        // But if hidden ones are not in UI, user can't uncheck them individually. 

        const allValues = sectionPermissions.map(p => p.value);
        // Check if any *visible* permission is selected to decide toggle state
        // OR just check if any in the list (including hidden) is selected.
        // Let's check based on *any* selected to determine if we turn OFF or ON.
        const hasSomeSelected = allValues.some(val => selectedPermissions.includes(val));

        if (hasSomeSelected) {
            // Deselect All (including hidden)
            setSelectedPermissions(selectedPermissions.filter(p => !allValues.includes(p)));
        } else {
            // Select All (including hidden)
            // This ensures if user toggles module ON, they get view access + all access.
            const newPerms = [...selectedPermissions];
            allValues.forEach(val => {
                if (!newPerms.includes(val)) newPerms.push(val);
            });
            setSelectedPermissions(newPerms);
        }
    };

    // Check if section is active (if ANY permission is selected)
    const isSectionSelected = (sectionPermissions) => {
        if (!sectionPermissions || sectionPermissions.length === 0) return false;
        return sectionPermissions.some(p => selectedPermissions.includes(p.value));
    };

    const handleToggleAdmin = (adminId) => {
        if (selectedAdmins.includes(adminId)) {
            setSelectedAdmins(selectedAdmins.filter(id => id !== adminId));
        } else {
            setSelectedAdmins([...selectedAdmins, adminId]);
        }
    };

    const handleSubmit = async () => {
        if (!roleName) {
            alert("Please enter a permission name");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            // Auto-inject hidden "View" permissions if any other permission in the module is selected
            let finalPermissions = [...selectedPermissions];

            MODULES_CONFIG.forEach(module => {
                const modulePermissionValues = module.permissions.map(p => p.value);
                const hasSelectedInModule = modulePermissionValues.some(val => finalPermissions.includes(val));

                if (hasSelectedInModule) {
                    const viewPerm = module.permissions.find(p => p.isView);
                    if (viewPerm && !finalPermissions.includes(viewPerm.value)) {
                        finalPermissions.push(viewPerm.value);
                    }
                }
            });

            const payload = {
                name: roleName,
                permissions: finalPermissions,
                users: selectedAdmins
            };

            if (isEditMode) {
                await axios.put(`${API_URL}/api/admin/permissions/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${API_URL}/api/admin/permissions`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            navigate("/admin/permissions");
        } catch (error) {
            console.error("Error saving permission:", error);
            alert("Failed to save permission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-xl font-bold mb-8 text-center">{isEditMode ? "Update" : "Create"} team role</h2>

                {/* Name Input */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Please enter your permission name"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                </div>

                {/* User Assignment - Moved to top or bottom as per design? Design has it separate, let's keep it here first or after. Design doesn't clearly show order. I'll keep modules first then users as per previous logic, or maybe users first? 
                   The provided image shows "Update team role" title, Name, and then Modules directly. 
                   So Users might be in a different tab or at bottom. I'll place Admin Assignment at the bottom.
                */}

                {/* Modules List */}
                <div className="space-y-8">
                    {MODULES_CONFIG.map((module) => {
                        const isSelected = isSectionSelected(module.permissions);

                        return (
                            <div key={module.key} className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 border-b border-gray-100 pb-6 last:border-0">
                                {/* Left: Label & Main Toggle */}
                                <div className="w-full md:w-48 flex items-center justify-between md:justify-start gap-4 shrink-0">
                                    <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out border-2 border-transparent ${isSelected ? 'bg-[#FFD137]' : 'bg-gray-200'}`}>
                                        <span
                                            area-hidden="true"
                                            className={`${isSelected ? 'translate-x-5' : 'translate-x-0'}
                                                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                                            `}
                                        />
                                        {/* Actual clickable area overlay */}
                                        <div
                                            className="absolute inset-0 z-10"
                                            onClick={() => handleToggleSection(module.permissions)}
                                        ></div>
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">{module.label}</span>
                                </div>

                                {/* Right: Grid of Sub-Permissions */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
                                    {module.permissions.filter(p => !p.isView).map((perm) => (
                                        <label key={perm.value} className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-[#FFB300] checked:bg-[#FFB300] hover:border-[#FFB300]"
                                                    checked={selectedPermissions.includes(perm.value)}
                                                    onChange={() => handleTogglePermission(perm.value)}
                                                />
                                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity peer-checked:opacity-100">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3 text-white"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 select-none">
                                                {perm.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Admin Assignment */}
                <div className="mb-8 mt-12 bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold mb-4 text-gray-800">Assign Super Users</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {admins.map((admin) => (
                            <div key={admin._id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#FFB300] transition-colors">
                                <input
                                    type="checkbox"
                                    id={`admin-${admin._id}`}
                                    checked={selectedAdmins.includes(admin._id)}
                                    onChange={() => handleToggleAdmin(admin._id)}
                                    className="w-5 h-5 text-[#FFB300] rounded focus:ring-[#FFB300]"
                                />
                                <label htmlFor={`admin-${admin._id}`} className="flex flex-col cursor-pointer">
                                    <span className="font-medium text-gray-800 text-sm">{admin.name}</span>
                                    <span className="text-xs text-gray-500">{admin.email}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    {admins.length === 0 && <p className="text-gray-500 text-sm">No Super users found.</p>}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8 pb-8">
                    <button
                        onClick={() => navigate("/admin/permissions")}
                        className="px-10 py-2.5 rounded-full border border-gray-800 text-gray-800 hover:bg-gray-100 font-bold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-10 py-2.5 rounded-full border border-gray-800 text-gray-800 hover:bg-gray-100 font-bold transition-all"
                    >
                        {/* Button style in image is actually white with black text/border, wait, image says "Create" and "Cancel" buttons at bottom right. */}
                        {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePermission;
