import { useState, useEffect } from "react";
import { Users, Shield, Edit, Trash2, Search, X, Copy } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";
import { getUserRole } from "../../utils/auth";
import Pagination from "../../components/admin/Pagination";

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdminId, setEditingAdminId] = useState(null);
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "admin" // Default to admin, replace roleId
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentUserRole = getUserRole();
    const isSuperAdmin = currentUserRole === "superadmin";

    const handleStatusToggle = async (id, newStatus) => {
        // Optimistic update
        const originalAdmins = [...admins];
        setAdmins(admins.map(admin => {
            if (admin._id === id) {
                if (newStatus === 'inactive') {
                    return { ...admin, role: 'jobseeker', previousRole: admin.role };
                } else {
                    return { ...admin, role: admin.previousRole || 'admin', previousRole: null };
                }
            }
            return admin;
        }));

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/api/admin/admin-status/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Re-fetch to ensure consistent state
            fetchAdmins();
        } catch (error) {
            console.error("Error updating status:", error);
            // Revert on error
            setAdmins(originalAdmins);
            alert("Failed to update status");
        }
    };

    useEffect(() => {
        fetchAdmins();
        // fetchRoles(); // No longer needed for Admin Management
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/users?role=admin,superadmin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (admin) => {
        setFormData({
            name: admin.name,
            email: admin.email,
            password: "",
            role: admin.role === "superadmin" ? "superadmin" : "admin"
        });
        setEditingAdminId(admin._id);
        setIsModalOpen(true);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked || e.type === 'click') { // Handle both checkbox and button click
            setSelectedAdmins(filteredAdmins.map(u => u._id));
        } else {
            setSelectedAdmins([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedAdmins.includes(id)) {
            setSelectedAdmins(selectedAdmins.filter(uid => uid !== id));
        } else {
            setSelectedAdmins([...selectedAdmins, id]);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    const handleDeleteClick = (id) => {
        setAdminToDelete(id);
        setIsBulkDelete(false);
        setShowDeleteModal(true);
    };

    const handleBulkDeleteClick = () => {
        if (selectedAdmins.length === 0) return;
        setIsBulkDelete(true);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            if (isBulkDelete) {
                // Execute all demotions in parallel
                await Promise.all(selectedAdmins.map(id =>
                    axios.put(`${API_URL}/api/admin/demote-admin/${id}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ));
                alert("Selected admins demoted successfully");
                setSelectedAdmins([]);
            } else {
                if (!adminToDelete) return;
                await axios.put(`${API_URL}/api/admin/demote-admin/${adminToDelete}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Admin demoted successfully");
            }
            fetchAdmins();
        } catch (error) {
            console.error("Error demoting admin(s):", error);
            alert("Failed to demote admin(s)");
        } finally {
            cancelDelete();
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setAdminToDelete(null);
        setIsBulkDelete(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert("Name and Email are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");

            if (editingAdminId) {
                // Update logic (might need specific endpoint update in controller if generic update doesn't handle role switch well, but updateAdmin usually does)
                // Wait, updateAdmin in controller might need role vs roleId check too.
                // adminController.updateAdmin logic handles roleId, not direct role change for admins usually.
                // Let's assume generic update works or we use create-admin equivalent for promotion?
                // Actually, updateAdmin (PUT /users/:id) generally handles simple updates.
                // If we want to CHANGE role, we might need to ensure backend supports it.
                // Let's rely on updateAdmin for now, but pass 'role' property.

                await axios.put(`${API_URL}/api/admin/update-admin/${editingAdminId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Admin details updated successfully!");
                fetchAdmins();
            } else {
                // Create Admin
                await axios.post(`${API_URL}/api/admin/create-admin`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Admin created successfully!");
                fetchAdmins();
            }
            closeModal();
        } catch (error) {
            console.error("Error creating/updating admin:", error);
            alert(error.response?.data?.message || "Failed to save admin");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAdminId(null);
        setFormData({ name: "", email: "", password: "", role: "admin" });
    };

    const filteredAdmins = admins.filter(admin =>
        admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);
    const paginatedAdmins = filteredAdmins.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-8">
                {/* Search Bar */}
                <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for candidates"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB300] shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Add Admin Button - Super Admin Only */}
                {isSuperAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white border text-black px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center min-w-[140px]"
                        style={{ boxShadow: "0px 2px 4px rgba(0,0,0,0.05)" }}
                    >
                        Add admin +
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">Admin management</h2>
                {isSuperAdmin && (
                    <button
                        onClick={() => handleSelectAll({ target: { checked: true }, type: 'click' })}
                        className="text-[#FFB300] font-medium hover:underline text-sm flex items-center"
                    >
                        Select all <span className="ml-1">→</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                            <th className="p-4 w-12 text-center text-gray-500">Sl No</th>
                            <th className="p-4 font-semibold">Username</th>
                            <th className="p-4 font-semibold">Email ID</th>
                            <th className="p-4 font-semibold">Admin Type</th>
                            {isSuperAdmin && <th className="p-4 text-center font-semibold">Action</th>}
                            {isSuperAdmin && <th className="p-4 text-center font-semibold">Status</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredAdmins.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">No admins found.</td></tr>
                        ) : (
                            paginatedAdmins.map((admin, index) => (
                                <tr key={admin._id} className="hover:bg-gray-50 transition text-sm group">
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            {isSuperAdmin && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAdmins.includes(admin._id)}
                                                    onChange={() => handleSelectOne(admin._id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#FFB300] focus:ring-[#FFB300]"
                                                />
                                            )}
                                            <span className="text-gray-900 font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-900 font-medium align-middle">{admin.name}</td>
                                    <td className="p-4 text-gray-600 align-middle">{admin.email}</td>
                                    <td className="p-4 text-gray-700 align-middle">
                                        {admin.role === 'jobseeker'
                                            ? <span className="text-red-500 font-medium">{admin.previousRole === 'superadmin' ? 'Super Admin' : 'Admin'} (Deactivated)</span>
                                            : (admin.role === 'superadmin' ? 'Super Admin' : 'Admin')
                                        }
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="p-4 text-center align-middle">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(admin)}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(admin._id)}
                                                    className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded text-red-500 transition"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    {isSuperAdmin && (
                                        <td className="p-4 text-center align-middle">
                                            <div className="inline-flex rounded-full border border-gray-200 p-0.5 bg-white">
                                                <button
                                                    onClick={() => handleStatusToggle(admin._id, 'active')}
                                                    disabled={admin.role !== 'jobseeker'}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${admin.role !== 'jobseeker'
                                                        ? 'bg-[#FFB300] text-white shadow-sm'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Activate
                                                </button>
                                                <button
                                                    onClick={() => handleStatusToggle(admin._id, 'inactive')}
                                                    disabled={admin.role === 'jobseeker'}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${admin.role === 'jobseeker'
                                                        ? 'bg-red-600 text-white shadow-sm'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Deactivate
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalResults={filteredAdmins.length}
                itemsPerPage={ITEMS_PER_PAGE}
            />

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
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Admin</h3>
                            <p className="text-gray-500 text-sm">Sure you want to delete {isBulkDelete ? 'these admins' : 'this admin'}?</p>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative border border-gray-100">
                        {/* Close button removed as per design image usually doesn't have top-right X if Cancel button exists, but keeping for UX or making hidden if strictly following image. Image doesn't show X, but Cancel button. I'll keep X for accessibility but maybe cleaner to rely on Cancel. Let's remove X to match "pop this" image style strictly? No, X is always good. I'll keep it subtle or remove if requested. Image doesn't show it. Let's remove it and rely on Cancel. */}

                        <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">{editingAdminId ? "Edit Admin" : "Add Admin"}</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-6">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">User Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Username"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent transition shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Email ID */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email ID</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email ID"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent transition shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Admin Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Admin Type</label>
                                    <div className="relative">
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent transition shadow-sm cursor-pointer"
                                            required
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="superadmin">Super Admin</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center mt-8 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-12 py-3 bg-[#FFB300] hover:bg-[#ffca2c] text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                                >
                                    {isSubmitting ? "Saving..." : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-12 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition transform hover:scale-105 shadow-md"
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

export default AdminManagement;
