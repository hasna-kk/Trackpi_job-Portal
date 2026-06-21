import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, Search, UserPlus } from "lucide-react";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import Pagination from "../../components/admin/Pagination";

const AdminTeam = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  /* SELECT */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTeam.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeam.map((t) => t._id));
    }
  };

  /* FETCH */
  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTeam(data.data || []);
      else toast.error(data.message);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  /* FILTER */
  const filteredTeam = team.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.designation.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeam.length / ITEMS_PER_PAGE);
  const paginatedTeam = filteredTeam.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* DELETE HANDLERS */
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const url = isBulkDelete
        ? null // Add bulk logic if backend supports or loop
        : `${import.meta.env.VITE_API_URL}/api/admin/team/${deleteId}`;
      
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Deleted successfully");
        fetchTeam();
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Our Team Members</h1>
        {hasPermission(PERMISSIONS.TEAM_ADD) && (
          <button
            onClick={() => navigate("/admin/team/add")}
            className="bg-[#FFCC00] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-yellow-500 transition-colors"
          >
            <UserPlus size={18} />
            Add Member
          </button>
        )}
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredTeam.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
              </th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Image</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Designation</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Order</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="p-10 text-center text-gray-500">Loading team...</td></tr>
            ) : paginatedTeam.length === 0 ? (
              <tr><td colSpan="7" className="p-10 text-center text-gray-500">No members found.</td></tr>
            ) : (
              paginatedTeam.map((member) => (
                <tr key={member._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member._id)}
                      onChange={() => toggleSelect(member._id)}
                      className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                    />
                  </td>
                  <td className="p-4">
                    <img src={member.image?.url} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{member.name}</td>
                  <td className="p-4 text-sm text-gray-600">{member.designation}</td>
                  <td className="p-4 text-sm text-gray-600">{member.order}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       {hasPermission(PERMISSIONS.TEAM_EDIT) && (
                        <button onClick={() => navigate(`/admin/team/edit/${member._id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={18} />
                        </button>
                      )}
                      {hasPermission(PERMISSIONS.TEAM_DELETE) && (
                        <button onClick={() => handleDeleteClick(member._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Team Member"
          message="Are you sure you want to remove this member from the team?"
        />
      )}
    </div>
  );
};

export default AdminTeam;
