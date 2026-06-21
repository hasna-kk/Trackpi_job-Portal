import { useState, useEffect } from "react";
import axios from "axios";
import { Search, FileDown, Trash2, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "../../components/admin/Pagination";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AdminResumeCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

    const fetchCandidates = async (page = 1, search = "") => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/api/admin/resume-candidates`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit: pagination.limit, search }
            });

            if (res.data.success) {
                setCandidates(res.data.data);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching resume candidates:", error);
            toast.error("Failed to load candidates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchCandidates(1, searchTerm);
        }, 500);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(candidates.map((c) => c._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = async (idOrArray) => {
        const idsToDelete = Array.isArray(idOrArray) ? idOrArray : [idOrArray];
        if (idsToDelete.length === 0) return;

        if (!window.confirm(`Are you sure you want to delete ${idsToDelete.length} candidate(s)?`)) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`${API_URL}/api/admin/resume-candidates/bulk`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: idsToDelete }
            });

            if (res.data.success) {
                toast.success(res.data.message || "Candidates deleted successfully");
                setSelectedIds([]);
                fetchCandidates(pagination.page, searchTerm);
            }
        } catch (error) {
            console.error("Error deleting candidates:", error);
            toast.error(error.response?.data?.message || "Failed to delete candidates");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
    };

    return (
        <div className="bg-white rounded-lg shadow min-h-[calc(100vh-4rem)] p-6 relative">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for candidates"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Resume build candidates</h2>
                <button
                    onClick={() => {
                        if (selectedIds.length === candidates.length && candidates.length > 0) {
                            setSelectedIds([]);
                        } else {
                            setSelectedIds(candidates.map((c) => c._id));
                        }
                    }}
                    className="text-yellow-500 font-medium hover:text-yellow-600 transition flex items-center gap-1 text-sm border-b border-transparent hover:border-yellow-500"
                >
                    Select all <span className="text-lg">→</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border-t border-x border-gray-200 rounded-t-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-yellow-400">
                            <th className="py-4 px-6 font-semibold text-gray-800 w-[5%]"></th>
                            <th className="py-4 px-6 font-semibold text-gray-800 w-[25%]">Name</th>
                            <th className="py-4 px-6 font-semibold text-gray-800 w-[20%]">Phone number</th>
                            <th className="py-4 px-6 font-semibold text-gray-800 w-[20%]">Create date</th>
                            <th className="py-4 px-6 font-semibold text-gray-800 w-[15%] text-center">Resume</th>
                            <th className="py-4 px-6 font-semibold text-gray-800 w-[15%] text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && candidates.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500 flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-2"></div>
                                    Loading...
                                </td>
                            </tr>
                        ) : candidates.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">
                                    No candidates found.
                                </td>
                            </tr>
                        ) : (
                            candidates.map((candidate) => (
                                <tr key={candidate._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                                            checked={selectedIds.includes(candidate._id)}
                                            onChange={() => handleSelectOne(candidate._id)}
                                        />
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-800">{candidate.name || "N/A"}</td>
                                    <td className="py-4 px-6 text-gray-800 font-medium">{candidate.phone || "N/A"}</td>
                                    <td className="py-4 px-6 text-gray-600">{formatDate(candidate.createdAt)}</td>
                                    <td className="py-4 px-6 text-center">
                                        <a
                                            href={candidate.cloudinaryUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded cursor-pointer transition-colors"
                                            download={`${candidate.name || 'Resume'}_Candidate.pdf`}
                                        >
                                            <FileDown size={18} />
                                        </a>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => handleDelete(candidate._id)}
                                            className="inline-flex justify-center items-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded cursor-pointer transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => fetchCandidates(page, searchTerm)}
                totalResults={pagination.total}
                itemsPerPage={pagination.limit}
            />

            {/* Bottom Floating Action Bar for Selected Items matching UI */}
            {selectedIds.length > 0 && (
                <div className="mt-8 flex items-center text-sm px-2">
                    <div className="flex flex-col">
                        <span className="text-gray-800 mb-1 font-medium">Selected <span className="text-yellow-500 font-bold">{selectedIds.length}</span> items</span>
                        <button
                            onClick={() => handleDelete(selectedIds)}
                            disabled={selectedIds.length === 0}
                            className={`text-yellow-500 border-b border-transparent hover:border-yellow-500 flex items-center w-max ${selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            Delete <span className="text-lg leading-none ml-1">→</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminResumeCandidates;
