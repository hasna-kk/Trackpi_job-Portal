import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save, X } from "lucide-react";

/**
 * REUSABLE MEDIA BOX COMPONENT
 */
const MediaBox = ({ preview, label, name, onChange }) => (
  <div className="relative rounded-[30px] overflow-hidden w-[320px] h-56 bg-[#2D2D2D] group">
    {preview ? (
      <img src={preview} className="w-full h-full object-contain block p-2" alt="Preview" />
    ) : null}
 
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
      <label className="cursor-pointer flex items-center gap-2 group-hover:scale-105 transition-transform">
        <span className="text-[#FFB300] font-normal text-[13px] font-lato">
          {label}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="#FFB300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="hidden"
          accept="image/*"
        />
      </label>
    </div>
  </div>
);

const AddTeamMember = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    order: 0,
    isActive: true,
    facebook: "",
    twitter: "",
    linkedin: ""
  });

  const [files, setFiles] = useState({
    image: null
  });

  const [previews, setPreviews] = useState({
    image: null
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error("Image size must be less than 500KB");
      return;
    }

    setFiles({ ...files, [e.target.name]: file });
    setPreviews({ ...previews, [e.target.name]: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.designation) {
      return toast.error("Name and designation are required");
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (files.image) data.append("image", files.image);

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/team`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Team member added!");
        navigate("/admin/team");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm w-full max-w-[1100px] mx-auto flex flex-col p-8 gap-5">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate("/admin/team")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 leading-none">Add Team Member</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: INFO */}
          <div className="space-y-6">
            <div>
              <label className="block text-[18px] mb-1 font-semibold text-black">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter member's full name"
                className="border-b border-gray-200 py-2 w-full outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1 font-semibold text-black">Designation</label>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter job title / role"
                className="border-b border-gray-200 py-2 w-full outline-none text-gray-800"
              />
            </div>

             <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-[18px] mb-1 font-semibold text-black">Display Order</label>
                 <input
                   type="number"
                   name="order"
                   value={formData.order}
                   onChange={handleChange}
                   className="border-b border-gray-200 py-2 w-full outline-none text-gray-800"
                 />
               </div>
               <div className="flex items-end pb-2 gap-2">
                 <input
                   type="checkbox"
                   id="isActive"
                   name="isActive"
                   checked={formData.isActive}
                   onChange={handleChange}
                   className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500"
                 />
                 <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">Is Active</label>
               </div>
             </div>
          </div>

          {/* RIGHT: IMAGE & SOCIALS */}
          <div className="space-y-6">
             <div>
               <label className="block text-[18px] mb-2 font-semibold text-black">Profile Image</label>
               <MediaBox
                 label="Upload Image"
                 name="image"
                 preview={previews.image}
                 onChange={handleFileChange}
               />
               <p className="text-[12px] text-red-500 mt-2 font-medium text-center w-[320px]">Maximum file size: 500KB.</p>

               {/* ACTIONS (Moved below image) */}
               <div className="flex justify-start pt-10 gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/team")}
                  className="bg-white text-gray-700 px-12 py-2 rounded-[6px] font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                  style={{ width: "167.6px", height: "35.3px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  Cancel
                </button>
                
                <button
                  disabled={loading}
                  className="bg-gradient-to-b from-[#FFF0CA] to-[#FFB300] text-black px-12 py-2 rounded-[6px] font-medium shadow-sm hover:opacity-90 transition-opacity border border-[#FFD067]"
                  style={{ width: "170px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
             </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AddTeamMember;
