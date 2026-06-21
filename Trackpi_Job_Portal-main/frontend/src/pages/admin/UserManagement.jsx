import { useState, useEffect } from "react";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";
import { getUserRole } from "../../utils/auth";
import Pagination from "../../components/admin/Pagination";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [editingUser, setEditingUser] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roles, setRoles] = useState([]); // To populate Permission dropdown
    const [formData, setFormData] = useState({
        name: "",
        employeeId: "", // Not in DB yet, but in UI
        email: "",
        permission: "" // Role ID or Permission name
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentUserRole = getUserRole();
    const canManage = currentUserRole === "superadmin" || currentUserRole === "admin";

    const formatLastSeen = (lastActiveString) => {
        if (!lastActiveString) return "Never";
        const lastActive = new Date(lastActiveString);
        if (isNaN(lastActive)) return "Never";

        const now = new Date();
        const timeDiff = now - lastActive; // Difference in milliseconds
        const fiveMinutes = 5 * 60 * 1000;

        if (timeDiff < fiveMinutes) {
            return (
                <span className="flex items-center gap-2 text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active
                </span>
            );
        }

        const day = lastActive.getDate().toString().padStart(2, '0');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[lastActive.getMonth()];

        let hour = lastActive.getHours();
        const ampm = hour >= 12 ? 'pm' : 'am';
        hour = hour % 12;
        hour = hour ? hour : 12;
        const formattedHour = hour.toString().padStart(2, '0');

        const minute = lastActive.getMinutes().toString().padStart(2, '0');

        return <span className="text-gray-500">{day} {month} {formattedHour}:{minute} {ampm}</span>;
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const findUserRole = (userId) => {
        // Robustly check if user exists in any role group
        if (!roles || roles.length === 0) return null;
        return roles.find(role => role.users?.some(u => {
            if (!u) return false;
            const id = u._id || u;
            return String(id) === String(userId);
        }));
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            // Filter by role=superuser
            const response = await axios.get(`${API_URL}/api/admin/users?role=superuser`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const mappedUsers = response.data.map(user => ({
                ...user,
                // Use real employeeId or fallback
                employeeId: user.employeeId || "",
                lastSeen: user.lastActive ? formatLastSeen(user.lastActive) : "Never",
            }));
            setUsers(mappedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/permissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u._id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(uid => uid !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (user) => {
        // use findUserRole to consistently get the role
        const matchedRole = findUserRole(user._id);


        setFormData({
            name: user.name,
            employeeId: user.employeeId || "",
            email: user.email,
            permission: matchedRole ? String(matchedRole._id) : ""
        });
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsBulkDelete(false);
        setShowDeleteModal(true);
    };

    const handleBulkDeleteClick = () => {
        if (selectedUsers.length === 0) return;
        setIsBulkDelete(true);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            if (isBulkDelete) {
                // Execute all demotions in parallel
                await Promise.all(selectedUsers.map(id =>
                    axios.put(`${API_URL}/api/admin/remove-superuser/${id}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ));
                alert("Selected users demoted successfully");
                setSelectedUsers([]);
            } else {
                if (!userToDelete) return;
                await axios.put(`${API_URL}/api/admin/remove-superuser/${userToDelete._id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("User demoted successfully");
            }
            fetchUsers();
            // Refresh roles too as user list in roles changes
            fetchRoles();
        } catch (error) {
            alert("Failed to demote user(s)");
        } finally {
            cancelDelete();
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
        setIsBulkDelete(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                name: formData.name,
                email: formData.email,
                employeeId: formData.employeeId,
                roleId: formData.permission
            };

            if (editingUser) {
                await axios.put(`${API_URL}/api/admin/superuser/${editingUser._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("User updated successfully");
            } else {
                await axios.post(`${API_URL}/api/admin/create-superuser`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("User created successfully");
            }

            setIsModalOpen(false);
            setEditingUser(null);

            // Await these to ensure UI updates after backend is definitely done
            await fetchUsers();
            await fetchRoles();

            setFormData({ name: "", employeeId: "", email: "", permission: "" });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-8 bg-white min-h-screen font-sans">
            <h2 className="text-2xl font-bold text-black mb-6">User management</h2>

            <div className="flex justify-between items-center mb-6">
                {/* Search Bar */}
                <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search Employee id  or  User name"
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Add User Button */}
                {canManage && (
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setFormData({ name: "", employeeId: "", email: "", permission: "" });
                            setIsModalOpen(true);
                        }}
                        className="bg-[#FFB300] hover:bg-[#ffca2c] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm text-black"
                    >
                        Add user +
                    </button>
                )}
            </div>

            <div className="flex justify-end mb-2">
                <button className="text-yellow-500 text-sm hover:underline">Select all &rarr;</button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                                {canManage && (
                                    <th className="p-4 pl-6 w-12">
                                        {/* Header Checkbox Removed */}
                                    </th>
                                )}
                                <th className="p-4">Employee I D</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Permission</th>
                                <th className="p-4">Last seen</th>
                                {canManage && <th className="p-4 pr-6 text-right">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No users found.</td></tr>
                            ) : (
                                paginatedUsers.map((user) => {
                                    const role = findUserRole(user._id);
                                    return (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            {canManage && (
                                                <td className="p-4 pl-6 align-middle">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user._id)}
                                                        onChange={() => handleSelectOne(user._id)}
                                                        className="w-5 h-5 rounded border-gray-300 focus:ring-[#FFB300]"
                                                    />
                                                </td>
                                            )}
                                            <td className="p-4 align-middle text-gray-700">{user.employeeId}</td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{user.name}</span>
                                                    <span className="text-gray-500 text-sm">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-gray-700">
                                                {role ? role.name : "Custom / None"}
                                            </td>
                                            <td className="p-4 align-middle text-gray-700">{user.lastSeen}</td>
                                            {canManage && (
                                                <td className="p-4 align-middle text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="p-1.5 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(user)}
                                                            className="p-1.5 bg-red-100 rounded text-red-500 hover:bg-red-200 transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={filteredUsers.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        {/* 3D Icon Placeholder */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                {/* Back folder part */}
                                <div className="absolute top-0 left-0 w-16 h-12 bg-[#FFD137] rounded-lg -rotate-6 transform origin-bottom-left"></div>
                                {/* Front folder part */}
                                <div className="relative w-16 h-12 bg-[#FFB300] rounded-lg shadow-lg flex items-center justify-center z-10">
                                    {/* Red delete badge */}
                                    <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-md border-2 border-white">
                                        <Trash2 size={16} className="text-white" />
                                    </div>
                                    <div className="w-8 h-1 bg-white/30 rounded-full mb-1"></div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Super User</h3>
                            <p className="text-gray-500 text-sm">Sure you want to delete {isBulkDelete ? 'these users' : 'this user'}?</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-[#FFB300] text-[#FFB300] font-semibold hover:bg-yellow-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFB300] text-black font-bold shadow-md hover:shadow-lg hover:bg-[#ffca2c] transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-2xl relative border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">{editingUser ? "Edit User" : "User information"}</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-8 mb-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400"
                                            placeholder="Aleena thomas"
                                            required
                                        />
                                    </div>

                                    {/* User Name (Email) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">User name</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400"
                                            placeholder="Aleena@thomas1245"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Employee ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={formData.employeeId}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400"
                                            placeholder="46863225"
                                        // Optional since backend doesn't support it yet
                                        />
                                    </div>

                                    {/* Permission */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Permission</label>
                                        <div className="relative">
                                            <select
                                                name="permission"
                                                value={formData.permission}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-400 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-yellow-400 bg-white"
                                                required
                                            >
                                                <option value="" disabled>Select Permission</option>
                                                {roles.map(role => (
                                                    <option key={role._id} value={role._id}>{role.name}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                                <span className="text-xs">▼</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-center gap-6 mt-12">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-12 py-2 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black font-medium rounded shadow-sm hover:shadow-md transition"
                                >
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-12 py-2 border border-gray-400 text-black font-medium rounded hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
