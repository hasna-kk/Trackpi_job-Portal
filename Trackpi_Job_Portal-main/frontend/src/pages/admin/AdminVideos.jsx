import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

const AdminVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [formData, setFormData] = useState({ department: "UI UX Design" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const departments = ["UI UX Design", "Graphic Design", "Video editing"];

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/videos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVideos(res.data.data);
        } catch (error) {
            toast.error("Failed to load videos");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (video = null) => {
        if (video) {
            setSelectedVideo(video);
            setFormData({ department: video.department });
            setPreview(video.video.url);
        } else {
            setSelectedVideo(null);
            setFormData({ department: "UI UX Design" });
            setPreview(null);
        }
        setFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("department", formData.department);
        if (file) fd.append("video", file);

        const loadingToast = toast.loading(selectedVideo ? "Updating video..." : "Adding video...");
        try {
            if (selectedVideo) {
                await axios.put(`${API_URL}/api/videos/admin/${selectedVideo._id}`, fd, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Video updated successfully", { id: loadingToast });
            } else {
                await axios.post(`${API_URL}/api/videos/admin`, fd, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Video added successfully", { id: loadingToast });
            }
            fetchVideos();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed", { id: loadingToast });
        }
    };

    const handleDeleteClick = (video) => {
        setSelectedVideo(video);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/videos/admin/${selectedVideo._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Video deleted");
            fetchVideos();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="p-6 md:p-10 bg-white min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Video management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#FFB300] hover:bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all transform hover:scale-105 active:scale-95"
                >
                    Add more +
                </button>
            </div>

            {/* Table-like Container */}
            <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                <div className="px-8 py-5 border-b-2 border-yellow-400 flex items-center justify-between font-bold text-gray-700 text-sm tracking-widest uppercase">
                    <div className="w-1/4">Department</div>
                    <div className="w-1/2 text-center">Video</div>
                    <div className="w-1/4 text-right">Action</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-20 text-center text-gray-400 flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-medium">Loading videos...</span>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="p-20 text-center text-gray-300 italic">No videos found. Click "Add more +" to start.</div>
                    ) : (
                        videos.map((v) => (
                            <div key={v._id} className="px-8 py-10 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                <div className="w-1/4 font-black text-gray-900 text-lg">{v.department}</div>
                                <div className="w-1/2 flex justify-center px-10">
                                    <div className="relative w-full max-w-[400px] h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-lg border-4 border-white group-hover:shadow-yellow-100 transition-all">
                                        <video
                                            src={v.video.url}
                                            className="w-full h-full object-cover"
                                            muted
                                            onMouseOver={(e) => e.target.play()}
                                            onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                </div>
                                <div className="w-1/4 flex justify-end gap-3">
                                    <button
                                        onClick={() => handleOpenModal(v)}
                                        className="p-2.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl shadow-sm transition-all hover:scale-110"
                                    >
                                        <Pencil size={18} fill="white" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(v)}
                                        className="p-2.5 bg-red-100 hover:bg-red-200 text-red-500 rounded-xl shadow-sm transition-all hover:scale-110"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-8 top-8 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Add Video</h3>
                            <label className="block text-xl font-bold text-gray-900 mb-6">Add Department</label>

                            <div className="relative group max-w-sm mx-auto">
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ department: e.target.value })}
                                    className="w-full px-8 py-4 rounded-3xl border-2 border-gray-100 focus:border-yellow-400 outline-none font-bold text-gray-500 bg-white transition-all appearance-none cursor-pointer shadow-sm text-lg"
                                    disabled={selectedVideo}
                                >
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-800">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-10">
                            <label className="block text-xl font-bold text-gray-900 mb-6">Add Video</label>
                            <div className="relative rounded-3xl overflow-hidden h-40 bg-gray-100 group shadow-md max-w-md mx-auto">
                                {preview ? (
                                    <video src={preview} className="w-full h-full object-cover" autoPlay loop />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <Upload size={32} className="text-gray-400" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center gap-2 cursor-pointer group">
                                    <label className="cursor-pointer flex items-center gap-2 text-yellow-400 font-black text-lg drop-shadow-md">
                                        Upload video <Upload size={24} className="text-yellow-400" />
                                        <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 max-w-md mx-auto">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex-1 py-4 bg-gradient-to-b from-yellow-100 to-yellow-500 text-black font-black text-xl rounded-2xl shadow-lg hover:shadow-yellow-200/50 hover:scale-[1.02] transition-all border border-yellow-200"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => { setFile(null); setPreview(null); }}
                                className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-900 font-bold text-xl rounded-2xl hover:bg-gray-50 transition-all"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Department Video"
                message={`Are you sure you want to remove the background video for ${selectedVideo?.department}?`}
            />
        </div>
    );
};

export default AdminVideos;
