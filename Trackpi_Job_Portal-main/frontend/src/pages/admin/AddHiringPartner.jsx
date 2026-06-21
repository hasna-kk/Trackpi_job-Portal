import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddHiringPartner = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        organizationname: "",
        email: "",
        aboutcompany: ""
    });

    const [files, setFiles] = useState({});
    const [previews, setPreviews] = useState({
        logo: null
    });

    /* ================= HANDLERS ================= */
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 500 * 1024) {
            toast.error("Image size must be less than 500KB");
            return;
        }

        setFiles({ ...files, [e.target.name]: file });
        setPreviews({
            ...previews,
            [e.target.name]: URL.createObjectURL(file)
        });
    };

    /* ================= SAVE ================= */
    const handleSubmit = async () => {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
        Object.entries(files).forEach(([k, v]) => fd.append(k, v));

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/hiringpartners`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to add partner");
            toast.success("Hiring Partner added successfully");
            navigate("/admin/partners");
        } catch (err) {
            toast.error(err.message);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="p-8 bg-white">
            <h1 className="text-2xl font-bold mb-6">Add Hiring Partner</h1>

            {/* ORGANIZATION NAME */}
            <div className="mb-6">
                <label className="block text-sm mb-1">Organization Name</label>
                <input
                    name="organizationname"
                    value={formData.organizationname}
                    onChange={handleChange}
                    className="border-b py-2 w-full outline-none"
                    placeholder="e.g. Google"
                />
            </div>

            {/* EMAIL */}
            <div className="mb-6">
                <label className="block text-sm mb-1">Email</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-b py-2 w-full outline-none"
                    placeholder="e.g. contact@google.com"
                />
            </div>

            {/* ABOUT COMPANY */}
            <div className="mb-8">
                <label className="block text-sm mb-2">About Company</label>
                <textarea
                    name="aboutcompany"
                    value={formData.aboutcompany}
                    onChange={handleChange}
                    className="border rounded-lg p-4 w-full h-32"
                    placeholder="Describe the company..."
                />
            </div>

            {/* LOGO */}
            <div className="mb-8 pl-1">
                <label className="block text-sm mb-2">Company Logo</label>
                <div className="w-1/3">
                    <div className="relative rounded-2xl overflow-hidden w-full h-56 bg-gray-100 border border-gray-300 group">
                        {previews.logo ? (
                            <img src={previews.logo} className="w-full h-full object-contain block" alt="Preview" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                No Image
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <label className="cursor-pointer text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full hover:bg-black/70 transition-colors">
                                Upload Logo ⬆
                                <input
                                    type="file"
                                    name="logo"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-medium">Recommended: 1:1 square ratio, max size 2MB (PNG or JPG).</p>
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end pt-10 gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/admin/partners")}
                    className="px-10 py-3 rounded-lg border font-medium"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-yellow-300 to-yellow-500
                     text-black px-10 py-3 rounded-lg font-medium shadow"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default AddHiringPartner;
