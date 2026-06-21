import React, { useState, useEffect } from "react";

const EditSocialLinksModal = ({ isOpen, onClose, socialLinks, onSave }) => {
    const [formData, setFormData] = useState({
        linkedin: "",
        twitter: "",
        facebook: "",
        portfolio: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (socialLinks) {
            setFormData({
                linkedin: socialLinks.linkedin || "",
                twitter: socialLinks.twitter || "",
                facebook: socialLinks.facebook || "",
                portfolio: socialLinks.portfolio || ""
            });
        }
    }, [socialLinks, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newErrors = { ...errors };

        if (value.trim()) {
            const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)*\/?$/i;
            if (!urlPattern.test(value.trim())) {
                newErrors[name] = "Please enter a valid URL.";
            } else {
                delete newErrors[name];
            }
        } else {
            delete newErrors[name];
        }

        setErrors(newErrors);
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (Object.keys(errors).length > 0) return;
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn" onClick={onClose}>
            <div className="bg-white w-[600px] rounded-[24px] p-8 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <h2 className="text-xl font-bold text-black mb-6">Social Links</h2>

                <div className="space-y-6">
                    {/* LinkedIn */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                Linkedin
                            </span>
                        </div>
                        <input
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="www.linkedin.com/in/username"
                            className={`w-full border-b-[2px] py-2 text-sm text-[#FFB300] placeholder-gray-300 outline-none transition-colors bg-transparent ${errors.linkedin ? 'border-red-500' : 'border-[#FFB300] focus:border-[#e6a100]'}`}
                        />
                        {errors.linkedin && <p className="text-[#FF0000] text-xs mt-1">{errors.linkedin}</p>}
                    </div>

                    {/* Twitter */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                Twitter
                            </span>
                        </div>
                        <input
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleChange}
                            placeholder="twitter.com/username"
                            className={`w-full border-b-[2px] py-2 text-sm text-[#FFB300] placeholder-gray-300 outline-none transition-colors bg-transparent ${errors.twitter ? 'border-red-500' : 'border-[#FFB300] focus:border-[#e6a100]'}`}
                        />
                        {errors.twitter && <p className="text-[#FF0000] text-xs mt-1">{errors.twitter}</p>}
                    </div>

                    {/* Facebook */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                Facebook
                            </span>
                        </div>
                        <input
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                            placeholder="www.facebook.com/username"
                            className={`w-full border-b-[2px] py-2 text-sm text-[#FFB300] placeholder-gray-300 outline-none transition-colors bg-transparent ${errors.facebook ? 'border-red-500' : 'border-[#FFB300] focus:border-[#e6a100]'}`}
                        />
                        {errors.facebook && <p className="text-[#FF0000] text-xs mt-1">{errors.facebook}</p>}
                    </div>

                    {/* Behance */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
                                <i className="ri-behance-fill text-[16px]"></i>
                                Behance
                            </span>
                        </div>
                        <input
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleChange}
                            placeholder="behance.net/username"
                            className={`w-full border-b-[2px] py-2 text-sm text-[#FFB300] placeholder-gray-300 outline-none transition-colors bg-transparent ${errors.portfolio ? 'border-red-500' : 'border-[#FFB300] focus:border-[#e6a100]'}`}
                        />
                        {errors.portfolio && <p className="text-[#FF0000] text-xs mt-1">{errors.portfolio}</p>}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center gap-4 mt-10">
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-2 rounded-lg bg-gradient-to-r from-[#FFD572] to-[#FEBD38] text-black font-bold text-sm shadow-sm hover:shadow-md transition transform hover:scale-105"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="px-12 py-2 rounded-lg border border-gray-300 text-black font-medium text-sm hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditSocialLinksModal;
