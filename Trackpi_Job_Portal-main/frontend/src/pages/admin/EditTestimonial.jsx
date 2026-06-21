import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    about: ""
  });

  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({
    coverImage: null,
    thumbnailImage: null,
    video: null
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/admin/testimonials/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        if (!res.ok) throw new Error();

        const t = json.data || json;

        setFormData({
          name: t.name,
          jobTitle: t.jobTitle,
          about: t.about
        });

        setPreviews({
          coverImage: t.coverImage?.url,
          thumbnailImage: t.thumbnailImage?.url,
          video: t.video?.url
        });
      } catch {
        toast.error("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate video if it's the video field
    if (e.target.name === "video") {
      // 1. Check file size (< 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Video size must be under 50MB");
        e.target.value = ""; // Reset input
        return;
      }

      // 2. Check resolution (1080p: 1920x1080)
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(this.src);
        if (this.videoWidth !== 1920 || this.videoHeight !== 1080) {
          toast.error("Video must be 1080p (1920x1080)");
          e.target.value = ""; // Reset input
          return;
        }
        // If resolution is correct, set the file
        setFiles((prev) => ({ ...prev, [e.target.name]: file }));
        setPreviews((prev) => ({
          ...prev,
          [e.target.name]: URL.createObjectURL(file)
        }));
      };
      video.src = URL.createObjectURL(file);
      return; // Handled in onloadedmetadata
    }

    // Validate image if it's an image field
    if (e.target.name === "coverImage" || e.target.name === "thumbnailImage") {
      const maxImgSize = 200 * 1024; // 200KB
      if (file.size > maxImgSize) {
        toast.error("Image size must be under 200KB", {
          style: { background: "#ff4b4b", color: "#fff" }
        });
        e.target.value = ""; // Reset input
        return;
      }
    }

    setFiles((prev) => ({ ...prev, [e.target.name]: file }));
    setPreviews((prev) => ({
      ...prev,
      [e.target.name]: URL.createObjectURL(file)
    }));
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    Object.entries(files).forEach(([k, v]) => fd.append(k, v));

    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/testimonials/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Testimonial updated");
      navigate("/admin/testimonials");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  /* ================= UI ================= */
  return (
    <div
      className="bg-white rounded-lg shadow-sm w-full max-w-[1100px] mx-auto flex flex-col p-8 gap-5"
    >
      <h1 className="text-3xl font-bold text-gray-900 leading-none">Testimonials</h1>

      {/* NAME & JOB TITLE WRAPPER */}
      <div
        style={{
          width: "971.2646484375px",
          height: "145px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        {/* NAME */}
        <div>
          <label className="block text-sm mb-1 font-semibold text-gray-700">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border-b border-gray-200 py-2 w-full outline-none text-gray-800"
          />
        </div>

        {/* JOB TITLE */}
        <div>
          <label className="block text-sm mb-1 pt-2 font-semibold text-gray-700">Job title</label>
          <input
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="border-b border-gray-200 py-2 w-full outline-none text-gray-800"
          />
        </div>
      </div>

      {/* ABOUT WRAPPER */}
      <div
        style={{
          width: "971.2646484375px",
          height: "167px",
          display: "flex",
          flexDirection: "column",
          gap: "21px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        <label className="text-sm font-semibold pt-4 text-gray-700">About your experience</label>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          className="border rounded-lg p-4 w-full h-full"
        />
      </div>

      {/* MEDIA WRAPPER */}
      <div
        style={{
          width: "971.2646484375px",
          height: "189px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        <div className="flex gap-[15px] h-full">
          <div className="flex flex-col gap-1">
            <MediaBox
              preview={previews.coverImage}
              label="Upload cover image"
              name="coverImage"
              onChange={handleFileChange}
              style={{ width: "208px", height: "189px" }}
            />
            <p className="text-[11px] text-red-500 text-center font-medium">Max 200KB</p>
          </div>

          <div className="flex flex-col gap-1">
            <MediaBox
              preview={previews.thumbnailImage}
              label="Thumbnail cover image"
              name="thumbnailImage"
              onChange={handleFileChange}
              style={{ width: "208px", height: "189px" }}
            />
            <p className="text-[11px] text-red-500 text-center font-medium">Max 200KB</p>
          </div>

          <div className="flex flex-col gap-1">
            <MediaBox
              preview={previews.video}
              label="Change video"
              name="video"
              onChange={handleFileChange}
              isVideo
              style={{ width: "496px", height: "189px" }}
            />
            <p className="text-[11px] text-red-500 font-medium text-center">1080p (1920x1080) • Max 50MB</p>
          </div>
        </div>
      </div>


      {/* FOOTER */}
      <div className="flex items-center justify-between pt-4">
        {/* LEFT — View Profile */}
        <button
          type="button"
          onClick={() => navigate(`/admin/testimonials/${id}`)}
          className="text-[#FFBD3D] font-medium flex items-center gap-2 hover:underline"
        >
          View Profile
          <span className="text-lg">→</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#FFF0CA] to-[#FFB300] text-black px-12 py-2 rounded-[6px] font-medium shadow-sm hover:opacity-90 transition-opacity border border-[#FFD067]"
            style={{ width: "167.6px", height: "35.3px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/testimonials")}
            className="bg-white text-gray-700 px-12 py-2 rounded-[6px] font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            style={{ width: "167.6px", height: "35.3px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= MEDIA BOX ================= */
const MediaBox = ({ preview, label, name, onChange, isVideo, style }) => (
  <div className="relative rounded-[30px] overflow-hidden bg-[#2D2D2D] group" style={style}>
    {preview ? (
      isVideo ? (
        <video src={preview} controls className="w-full h-full object-contain block" />
      ) : (
        <img src={preview} className="w-full h-full object-contain block" alt="Preview" />
      )
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-[30px]">
        No Media
      </div>
    )}

    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
      <label className="cursor-pointer flex items-center gap-2 group-hover:scale-105 transition-transform">
        <span className="text-[#FFB300] font-normal text-[13px] font-lato">
          {label}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="#FFB300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
    {disclaimer && <p className="mt-[6px] text-xs text-gray-500 font-medium text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{disclaimer}</p>}
  </div>
);

export default EditTestimonial;
