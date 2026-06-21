import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Plus, Pencil, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

const AdminPreviousWinners = () => {
  const token = localStorage.getItem("token");

  const [winners, setWinners] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editWinner, setEditWinner] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    about: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);


  /* FETCH */
  const fetchWinners = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-winners/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setWinners(data.data || []);
      else toast.error(data.message);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  /* FILTER */
  const filteredWinners = winners.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.department.toLowerCase().includes(search.toLowerCase())
  );

  /* HANDLERS */
  const handleOpenAddModal = () => {
    setEditWinner(null);
    setFormData({ name: "", department: "", about: "" });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (winner) => {
    setEditWinner(winner);
    setFormData({
      name: winner.name,
      department: winner.department,
      about: winner.about
    });
    setImageFile(null);
    setImagePreview(winner.image?.url || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.about) {
      return toast.error("Please fill all required fields");
    }

    if (!editWinner && !imageFile) {
      return toast.error("Please upload an image");
    }

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("department", formData.department);
    fd.append("about", formData.about);
    if (imageFile) fd.append("image", imageFile);

    setSubmitLoading(true);
    const loadingToast = toast.loading(editWinner ? "Updating winner..." : "Adding winner...");

    try {
      const url = editWinner 
        ? `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-winners/admin/${editWinner._id}`
        : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-winners/admin`;
      
      const res = await fetch(url, {
        method: editWinner ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(editWinner ? "Winner updated!" : "Winner added!", { id: loadingToast });
        setIsModalOpen(false);
        fetchWinners();
      } else {
        toast.error(data.message, { id: loadingToast });
      }
    } catch {
      toast.error("Process failed", { id: loadingToast });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-winners/admin/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchWinners();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
        <div className="relative w-[500px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            placeholder="Search for winners..."
            className="w-full h-14 bg-white border border-gray-200 px-6 pl-14 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-medium placeholder:text-gray-400 shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

      </div>

      <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-8">Previous winner</h2>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-yellow-400/30 text-gray-700 font-bold text-sm uppercase tracking-widest">
                <th className="p-6">Name</th>
                <th className="p-6">Department</th>
                <th className="p-6 text-center">Image</th>
                <th className="p-6 w-1/3">About</th>
                <th className="p-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-16 text-center text-gray-400 font-medium italic">Loading winners...</td></tr>
              ) : filteredWinners.length === 0 ? (
                <tr><td colSpan="5" className="p-16 text-center text-gray-400 font-medium italic">No winners found.</td></tr>
              ) : (
                filteredWinners.map((w) => (
                  <tr key={w._id} className="hover:bg-yellow-50/20 transition-all duration-200 group">
                    <td className="p-6">
                        <span className="font-bold text-gray-900 text-lg">{w.name}</span>
                    </td>
                    <td className="p-6 text-gray-600 font-semibold">{w.department}</td>
                    <td className="p-6 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-gray-50 mx-auto overflow-hidden shadow-sm group-hover:border-yellow-200 transition-all">
                        {w.image?.url ? (
                            <img src={w.image.url} alt={w.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ImageIcon size={24} />
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-sm text-gray-700 font-bold leading-relaxed">
                      {w.about}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-3">
                        {hasPermission(PERMISSIONS.WINNERS_EDIT) && (
                          <button
                            onClick={() => handleOpenEditModal(w)}
                            className="p-3 bg-yellow-100/50 rounded-xl text-yellow-600 hover:bg-yellow-400 hover:text-white transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        {hasPermission(PERMISSIONS.WINNERS_DELETE) && (
                          <button
                            onClick={() => handleDeleteClick(w._id)}
                            className="p-3 bg-red-50 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          >
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
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-8 top-8 text-gray-400 hover:text-gray-900 transition-all hover:rotate-90"
                >
                    <X size={28} />
                </button>

                <h2 className="text-3xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-100">
                    {editWinner ? "Edit Winner" : "Add New Winner"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Annriya Thomas"
                            className="w-full h-14 px-6 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-yellow-400 transition-all font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                        <input
                            type="text"
                            required
                            placeholder="UI UX Designer"
                            className="w-full h-14 px-6 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-yellow-400 transition-all font-medium"
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">About (Winner Story)</label>
                        <textarea
                            required
                            placeholder="Describe their achievement..."
                            className="w-full h-32 p-6 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-yellow-400 transition-all font-medium resize-none shadow-inner"
                            value={formData.about}
                            onChange={(e) => setFormData({...formData, about: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4">Winner Image</label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-3xl overflow-hidden border-2 border-gray-100 flex items-center justify-center relative group">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={32} className="text-gray-300" />
                                )}
                            </div>
                            
                            <label className="flex-1 cursor-pointer">
                                <div className="h-16 px-8 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-3 text-gray-500 hover:border-yellow-400 hover:text-yellow-600 transition-all font-bold">
                                    <Upload size={20} />
                                    {imageFile ? imageFile.name : "Choose winner image"}
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="px-10 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-200/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {submitLoading ? "Saving..." : editWinner ? "Update Winner" : "Add Winner"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}


      {/* DELETE MODAL */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Winner"
        message="Are you sure you want to delete this winner profile?"
      />
    </div>
  );
};

export default AdminPreviousWinners;
