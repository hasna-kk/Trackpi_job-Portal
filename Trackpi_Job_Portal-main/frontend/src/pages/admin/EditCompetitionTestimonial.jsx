import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Star, Upload, Video, ArrowLeft } from "lucide-react";

const EditCompetitionTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    about: "",
    rating: 5
  });

  const [files, setFiles] = useState({
    coverImage: null,
    video: null
  });

  const [previews, setPreviews] = useState({
    coverImage: null,
    video: null
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-testimonials/admin/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || "Failed to load testimonial");

        const t = data.data || data;

        setFormData({
          name: t.name || "",
          jobTitle: t.jobTitle || "",
          about: t.about || "",
          rating: t.rating || 5
        });

        setPreviews({
          coverImage: t.coverImage?.url || null,
          video: t.video?.url || null
        });
      } catch (error) {
        toast.error(error.message || "Failed to load testimonial");
        navigate("/admin/competition/testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRating = (r) => setFormData({ ...formData, rating: r });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles({ ...files, [e.target.name]: file });
    setPreviews({
      ...previews,
      [e.target.name]: URL.createObjectURL(file)
    });
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    if (!formData.name || !formData.jobTitle || !formData.about) {
        return toast.error("Please fill all required text fields");
    }

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    
    // Only append files if they were changed
    if (files.coverImage) fd.append("coverImage", files.coverImage);
    if (files.video) fd.append("video", files.video);

    const loadingToast = toast.loading("Updating competition testimonial...");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-testimonials/admin/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      
      toast.success("Competition testimonial updated successfully", { id: loadingToast });
      navigate("/admin/competition/testimonials");
    } catch (error) {
      toast.error(error.message || "Update failed", { id: loadingToast });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  );

  /* ================= UI ================= */
  return (
    <div className="p-8 bg-white min-h-screen max-w-5xl mx-auto rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-10">
        <button 
            onClick={() => navigate("/admin/competition/testimonials")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Competition Testimonial</h1>
      </div>

      {/* NAME */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
        <input
          name="name"
          placeholder="Type name"
          value={formData.name}
          onChange={handleChange}
          className="border-b-2 py-3 w-full outline-none focus:border-yellow-400 transition-colors text-lg"
        />
      </div>

      {/* JOB TITLE */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Job title</label>
        <input
          name="jobTitle"
          placeholder="Type job title"
          value={formData.jobTitle}
          onChange={handleChange}
          className="border-b-2 py-3 w-full outline-none focus:border-yellow-400 transition-colors text-lg"
        />
      </div>

      {/* ABOUT */}
      <div className="mb-10">
        <label className="block text-sm font-semibold text-gray-700 mb-2">About your experience</label>
        <textarea
          name="about"
          placeholder="Type your experience"
          value={formData.about}
          onChange={handleChange}
          className="border-2 rounded-2xl p-6 w-full h-44 outline-none focus:border-yellow-400 transition-all resize-none text-gray-600 bg-gray-50/30 shadow-inner"
        />
      </div>

      {/* RATING */}
      <div className="mb-10">
        <label className="block text-sm font-semibold text-gray-700 mb-4">Add Review rate</label>
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                    key={s}
                    size={28}
                    onClick={() => handleRating(s)}
                    className={`cursor-pointer transition-all hover:scale-110 ${s <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
      </div>

      {/* MEDIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MediaBox
          preview={previews.coverImage}
          label="Upload cover image"
          name="coverImage"
          icon={<Upload size={24} />}
          onChange={handleFileChange}
        />

        <MediaBox
          preview={previews.video}
          label="Upload video"
          name="video"
          icon={<Video size={24} />}
          onChange={handleFileChange}
          isVideo
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-end pt-16 gap-6">
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="px-14 py-4 rounded-xl bg-gradient-to-r from-yellow-300 to-yellow-500
                     text-black font-bold shadow-lg hover:shadow-yellow-200/50 hover:scale-[1.02] transition-all"
        >
          Update
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/competition/testimonials")}
          className="px-14 py-4 rounded-xl border-2 border-gray-300 font-bold text-gray-600 
                     hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ================= MEDIA BOX ================= */
const MediaBox = ({ preview, label, name, icon, onChange, isVideo }) => (
  <div className={`relative rounded-3xl overflow-hidden w-full h-64 bg-gray-200 border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-colors group flex items-center justify-center`}>
    
    {preview ? (
        isVideo ? (
            <video src={preview} className="w-full h-full object-cover" controls />
        ) : (
            <img src={preview} className="w-full h-full object-cover" />
        )
    ) : (
        <div className="flex flex-col items-center gap-3 text-gray-400">
            {icon}
            <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
        </div>
    )}

    {/* Overlay on hover for changing */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
         <label className="cursor-pointer text-white font-bold flex items-center gap-2 bg-yellow-400/80 px-6 py-2 rounded-full">
            {preview ? "Change ⬆" : "Upload ⬆"}
            <input
                type="file"
                name={name}
                onChange={onChange}
                className="hidden"
            />
        </label>
    </div>
  </div>
);

export default EditCompetitionTestimonial;
