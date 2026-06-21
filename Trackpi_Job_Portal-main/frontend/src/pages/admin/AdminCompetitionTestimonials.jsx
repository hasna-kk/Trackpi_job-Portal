import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, Play, Search, Star, X } from "lucide-react";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

const AdminCompetitionTestimonials = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedTestimonialForAbout, setSelectedTestimonialForAbout] = useState(null);

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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-testimonials/admin`, {
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

  /* FILTER */
  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.jobTitle.toLowerCase().includes(search.toLowerCase())
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
        await Promise.all(
          selectedIds.map((id) =>
            fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-testimonials/admin/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
            })
          )
        );
        toast.success("Competition testimonials deleted successfully");
        setSelectedIds([]);
      } else {
        if (!deleteId) return;
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-testimonials/admin/${deleteId}`, {
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
    <div className="p-6 bg-white min-h-screen font-sans">
      {/* TOPBAR */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
        <div className="relative w-[500px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            placeholder="Search for candidates or job title"
            className="w-full h-14 bg-white border border-gray-200 px-6 pl-14 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-medium placeholder:text-gray-400 shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {hasPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_ADD) && (
          <button
            onClick={() => navigate("/admin/competition/testimonials/add")}
            className="bg-[#FFB300] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#e5a100] transition-all shadow-lg shadow-yellow-200/50 hover:scale-[1.02] transform"
          >
            Add more +
          </button>
        )}
      </div>

      <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Testimonials</h2>
          {hasPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_DELETE) && (
            <button
                onClick={toggleSelectAll}
                className="text-sm font-black text-[#FFB300] hover:text-[#e5a100] hover:underline uppercase tracking-widest"
            >
                {selectedIds.length === filteredTestimonials.length && filteredTestimonials.length > 0
                ? "Unselect all →"
                : "Select all →"}
            </button>
         )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-yellow-400/30 text-gray-700 font-bold text-sm uppercase tracking-widest">
                <th className="p-6 pl-8 w-[60px]"></th>
                <th className="p-6">Name</th>
                <th className="p-6">Department</th>
                <th className="p-6 text-center">Video</th>
                <th className="p-6 w-1/3">About</th>
                <th className="p-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="p-16 text-center text-gray-400 font-medium italic">Loading testimonials...</td></tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr><td colSpan="6" className="p-16 text-center text-gray-400 font-medium italic">No competition testimonials found.</td></tr>
              ) : (
                filteredTestimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-yellow-50/20 transition-all duration-200 group">
                    <td className="p-6 pl-8">
                      {hasPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_DELETE) && (
                        <div className="flex items-center justify-center">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded-lg border-2 border-gray-300 text-yellow-400 focus:ring-yellow-400 cursor-pointer transition-all checked:bg-yellow-400"
                                checked={selectedIds.includes(t._id)}
                                onChange={() => toggleSelect(t._id)}
                            />
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-lg">{t.name}</span>
                            <div className="flex gap-0.5 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                ))}
                            </div>
                        </div>
                    </td>
                    <td className="p-6 text-gray-600 font-semibold">{t.jobTitle}</td>
                    <td className="p-6 text-center">
                      <div className="w-[120px] h-[60px] bg-gray-200 flex items-center justify-center rounded-2xl border-2 border-gray-50 mx-auto overflow-hidden relative shadow-inner group-hover:border-yellow-200 transition-all">
                        {t.coverImage ? (
                            <img src={t.coverImage.url} alt="Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="absolute inset-0 bg-gray-200" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-4 h-4 fill-yellow-500 text-yellow-500 ml-0.5" />
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-gray-500 italic leading-relaxed">
                      <div className="line-clamp-2 h-[40px] overflow-hidden">"{t.about}"</div>
                      <button 
                        onClick={() => setSelectedTestimonialForAbout(t)}
                        className="text-[#FFB300] font-bold hover:underline block mt-1 not-italic"
                      >
                        See more.....
                      </button>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex gap-2">
                          {hasPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_EDIT) && (
                            <button
                              onClick={() => navigate(`/admin/competition/testimonials/edit/${t._id}`)}
                              className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-yellow-400 hover:text-white hover:shadow-lg transition-all"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                          {hasPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_DELETE) && (
                            <button
                              onClick={() => handleDeleteClick(t._id)}
                              className="p-3 bg-red-50 rounded-xl text-red-500 hover:bg-red-500 hover:text-white hover:shadow-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                        {hasPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW_DETAILS) && (
                          <button
                            onClick={() => navigate(`/admin/competition/testimonials/${t._id}`)}
                            className="flex items-center gap-1.5 text-yellow-600 text-xs hover:underline font-black uppercase tracking-widest"
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
      </div>

      {/* FOOTER ACTIONS */}
      {selectedIds.length > 0 && (
        <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-100 rounded-[1.5rem] text-sm text-gray-700 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            Selected <span className="text-yellow-600 font-black text-lg">{selectedIds.length}</span> items
          </div>
          {hasPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_DELETE) && (
            <button
              onClick={handleBulkDeleteClick}
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-200"
            >
              Delete selected items
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
        message={isBulkDelete ? `Are you sure you want to delete ${selectedIds.length} testimonials?` : "Are you sure you want to delete this testimonial?"}
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
                        <p className="text-yellow-600 font-bold uppercase tracking-widest text-xs mt-1">{testimonial.jobTitle}</p>
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

export default AdminCompetitionTestimonials;
