import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, Play, Search, X } from "lucide-react";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import Pagination from "../../components/admin/Pagination";

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // ID for single delete
  const [isBulkDelete, setIsBulkDelete] = useState(false); // Flag for bulk delete
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTestimonialForAbout, setSelectedTestimonialForAbout] = useState(null);
  const ITEMS_PER_PAGE = 10;

  /* SELECT */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTestimonials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTestimonials.map((t) => t._id));
    }
  };

  /* FETCH */
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/testimonials?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTestimonials(data.data || []);
      else toast.error(data.message);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* FILTER */
  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const paginatedTestimonials = filteredTestimonials.slice(
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
            fetch(`${import.meta.env.VITE_API_URL}/api/admin/testimonials/${id}`, {
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
        await fetch(`${import.meta.env.VITE_API_URL}/api/admin/testimonials/${deleteId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Deleted");
      }
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      setIsBulkDelete(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* TOP */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            placeholder="Search for candidates or job title"
            className="w-[420px] h-[45px] border px-4 pl-10 rounded-lg outline-none focus:border-[#FFB300] transition-colors"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {hasPermission(PERMISSIONS.TESTIMONIALS_ADD) && (
          <button
            onClick={() => navigate("/admin/testimonials/add")}
            className="bg-[#FFB300] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#e5a100] transition"
          >
            Add more +
          </button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-800">Testimonials</h2>

      <div className="flex justify-end mb-2">
        {hasPermission(PERMISSIONS.TESTIMONIALS_DELETE) && (
          <button
            onClick={toggleSelectAll}
            className="text-sm font-medium text-[#FFB300] hover:text-[#e5a100]"
          >
            {selectedIds.length === filteredTestimonials.length && filteredTestimonials.length > 0
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
                <th className="p-4">Name</th>
                <th className="p-4">Job Title</th>
                <th className="p-4 text-center">Video</th>
                <th className="p-4 w-1/3">About</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No testimonials found.</td></tr>
              ) : (
                paginatedTestimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-yellow-50/10 transition-colors">
                    <td className="p-4 pl-6">
                      {hasPermission(PERMISSIONS.TESTIMONIALS_DELETE) && (
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-[#FFB300] focus:ring-[#FFB300] cursor-pointer"
                          checked={selectedIds.includes(t._id)}
                          onChange={() => toggleSelect(t._id)}
                        />
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{t.name}</td>
                    <td className="p-4 text-gray-700 font-medium">{t.jobTitle}</td>
                    <td className="p-4 text-center">
                      <div className="w-[100px] h-[40px] bg-gray-300 flex items-center justify-center rounded border border-gray-200 mx-auto">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                          <Play className="w-4 h-4 fill-[#FFB300] text-[#FFB300] ml-0.5" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="line-clamp-2 h-[40px] overflow-hidden">"{t.about}"</div>
                      <button 
                        onClick={() => setSelectedTestimonialForAbout(t)}
                        className="text-[#FFB300] font-bold hover:underline block mt-1"
                      >
                        See more.....
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex gap-2">
                          {hasPermission(PERMISSIONS.TESTIMONIALS_EDIT) && (
                            <button
                              onClick={() => navigate(`/admin/testimonials/edit/${t._id}`)}
                              className="p-2 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {hasPermission(PERMISSIONS.TESTIMONIALS_DELETE) && (
                            <button
                              onClick={() => handleDeleteClick(t._id)}
                              className="p-2 bg-red-100 rounded text-red-500 hover:bg-red-200 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        {hasPermission(PERMISSIONS.TESTIMONIALS_VIEW_DETAILS) && (
                          <button
                            onClick={() => navigate(`/admin/testimonials/${t._id}`)}
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
          totalResults={filteredTestimonials.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {/* Footer Selection Status */}
      {selectedIds.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 flex items-center gap-4">
          <span>
            Selected <span className="text-[#FFB300] font-bold">{selectedIds.length}</span> items
          </span>
          {hasPermission(PERMISSIONS.TESTIMONIALS_DELETE) && (
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
        title={isBulkDelete ? "Delete testimonials" : "Delete testimonial"}
        message={isBulkDelete ? `Sure you want to delete ${selectedIds.length} testimonials?` : "Sure you want to delete?"}
      />

      <AboutModal 
        isOpen={!!selectedTestimonialForAbout}
        onClose={() => setSelectedTestimonialForAbout(null)}
        testimonial={selectedTestimonialForAbout}
      />
    </div>
  );
};

/* ================= ABOUT MODAL ================= */
const AboutModal = ({ isOpen, onClose, testimonial }) => {
    if (!isOpen || !testimonial) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-3xl w-full max-w-2xl p-10 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 text-gray-400 hover:text-gray-900 transition-all hover:rotate-90 p-1"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-50">
                    <div className="w-20 h-20 rounded-2xl bg-yellow-100 flex items-center justify-center overflow-hidden border-2 border-yellow-50">
                        {testimonial.coverImage ? (
                            <img src={testimonial.coverImage.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{testimonial.name}</h3>
                        <p className="text-[#FFB300] font-bold uppercase tracking-widest text-xs mt-1">{testimonial.jobTitle}</p>
                    </div>
                </div>

                <div className="mb-10">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Testimonial Story</label>
                    <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-100 shadow-inner">
                        <p className="text-gray-600 leading-relaxed italic text-lg opacity-90">
                            "{testimonial.about}"
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-10 py-3 rounded-xl bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-black shadow-lg hover:shadow-yellow-200/50 hover:scale-[1.02] transition-all uppercase tracking-widest text-xs"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminTestimonials;
