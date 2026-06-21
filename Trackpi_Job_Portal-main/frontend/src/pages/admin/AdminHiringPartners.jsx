import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, Search } from "lucide-react";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import Pagination from "../../components/admin/Pagination";

const AdminHiringPartners = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [hiringPartners, setHiringPartners] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    /* FETCH */
    const fetchHiringPartners = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/hiringpartners?limit=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setHiringPartners(data.data || []);
            else toast.error(data.message);
        } catch {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHiringPartners();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    /* FILTER */
    const filteredHiringPartners = hiringPartners.filter(
        (t) =>
            t.organizationname.toLowerCase().includes(search.toLowerCase()) ||
            t.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredHiringPartners.length / ITEMS_PER_PAGE);
    const paginatedPartners = filteredHiringPartners.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    /* DELETE HANDLERS */
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsBulkDelete(false);
        setIsDeleteModalOpen(true);
    };

    const handleBulkDeleteClick = () => {
        if (!selectedIds.length) return;
        setIsBulkDelete(true);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (isBulkDelete) {
                // Bulk Delete Logic
                await Promise.all(
                    selectedIds.map((id) =>
                        fetch(`${import.meta.env.VITE_API_URL}/api/admin/hiringpartners/${id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    )
                );
                toast.success("Deleted successfully");
                setSelectedIds([]);
            } else {
                // Single Delete Logic
                if (!deleteId) return;
                await fetch(`${import.meta.env.VITE_API_URL}/api/admin/hiringpartners/${deleteId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Deleted");
            }
            fetchHiringPartners();
        } catch (error) {
            toast.error("Failed to delete");
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteId(null);
            setIsBulkDelete(false);
        }
    };

    /* SELECT */
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredHiringPartners.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredHiringPartners.map((t) => t._id));
        }
    };

    /* RENDER */

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* TOP */}
            <div className="flex justify-between items-center mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        placeholder="Search for hiring partners"
                        className="w-[420px] h-[45px] border px-4 pl-10 rounded-lg outline-none focus:border-[#FFB300] transition-colors"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {hasPermission(PERMISSIONS.PARTNERS_ADD) && (
                    <button
                        onClick={() => navigate("/admin/partners/add")}
                        className="bg-[#FFB300] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#e5a100] transition"
                    >
                        Add more +
                    </button>
                )}
            </div>

            <h2 className="text-xl font-bold mb-6 text-gray-800">Our Hiring Partners</h2>

            <div className="flex justify-end mb-2">
                {hasPermission(PERMISSIONS.PARTNERS_DELETE) && (
                    <button
                        onClick={toggleSelectAll}
                        className="text-sm font-medium text-[#FFB300] hover:text-[#e5a100]"
                    >
                        {selectedIds.length === filteredHiringPartners.length && filteredHiringPartners.length > 0
                            ? "Unselect all →"
                            : "Select all →"}
                    </button>
                )}
            </div>


            {/* TABLE */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                                <th className="p-4 pl-6 w-[50px]"></th>
                                <th className="p-4">Organization name</th>
                                <th className="p-4 text-center">Logo</th>
                                <th className="p-4 text-center">Email</th>
                                <th className="p-4 w-1/3">About company</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredHiringPartners.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No hiring partners found.</td></tr>
                            ) : (
                                paginatedPartners.map((t) => (
                                    <tr key={t._id} className="hover:bg-yellow-50/10 transition-colors">
                                        <td className="p-4 pl-6">
                                            {hasPermission(PERMISSIONS.PARTNERS_DELETE) && (
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-[#FFB300] focus:ring-[#FFB300] cursor-pointer"
                                                    checked={selectedIds.includes(t._id)}
                                                    onChange={() => toggleSelect(t._id)}
                                                />
                                            )}
                                        </td>
                                        <td className="p-4 font-semibold text-gray-800">{t.organizationname}</td>
                                        <td className="p-4">
                                            <div className="w-[100px] h-[40px] bg-gray-50 flex items-center justify-center rounded border border-gray-200 overflow-hidden mx-auto">
                                                {t.logo?.url ? (
                                                    <img src={t.logo.url} alt={t.organizationname} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xs text-gray-400">NA</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 text-center">{t.email}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {t.aboutcompany}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="flex gap-2">
                                                    {hasPermission(PERMISSIONS.PARTNERS_EDIT) && (
                                                        <button
                                                            onClick={() => navigate(`/admin/partners/edit/${t._id}`)}
                                                            className="p-2 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                    )}
                                                    {hasPermission(PERMISSIONS.PARTNERS_DELETE) && (
                                                        <button
                                                            onClick={() => handleDeleteClick(t._id)}
                                                            className="p-2 bg-red-100 rounded text-red-500 hover:bg-red-200 transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                {hasPermission(PERMISSIONS.PARTNERS_VIEW_DETAILS) && (
                                                    <button
                                                        onClick={() => navigate(`/admin/partners/${t._id}`)}
                                                        className="flex items-center gap-1 text-[#DFB31F] text-sm hover:underline font-medium"
                                                    >
                                                        View Details <ExternalLink size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
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
                    totalResults={filteredHiringPartners.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>

            {/* Footer Selection Status */}
            {selectedIds.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 flex items-center gap-4">
                    <span>
                        Selected <span className="text-[#FFB300] font-bold">{selectedIds.length}</span> items
                    </span>
                    {hasPermission(PERMISSIONS.PARTNERS_DELETE) && (
                        <button
                            onClick={handleBulkDeleteClick}
                            className="text-[#FFB300] font-medium hover:underline flex items-center gap-1"
                        >
                            Delete →
                        </button>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={isBulkDelete ? "Delete hiring partners" : "Delete hiring partner"}
                message={isBulkDelete ? `Sure you want to delete ${selectedIds.length} hiring partners?` : "Sure you want to delete?"}
            />
        </div>
    );
};

export default AdminHiringPartners;
