import React, { useState, useEffect } from "react";

const EditLanguageModal = ({ isOpen, onClose, languageData, onSave, isEditing, onDelete }) => {
    const [formData, setFormData] = useState({
        name: "",
        proficiency: "",
        canRead: false,
        canWrite: false,
        canSpeak: false
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setSubmitted(false);
            if (isEditing && languageData) {
                setFormData({
                    name: languageData.name || "",
                    proficiency: languageData.proficiency || "",
                    canRead: languageData.canRead || false,
                    canWrite: languageData.canWrite || false,
                    canSpeak: languageData.canSpeak || false
                });
            } else {
                setFormData({
                    name: "",
                    proficiency: "",
                    canRead: false,
                    canWrite: false,
                    canSpeak: false
                });
            }
        }
    }, [isOpen, languageData, isEditing]);

    const validate = (data) => {
        const newErrors = {};
        if (!data.name) newErrors.name = "Please select a language.";
        if (!data.proficiency) newErrors.proficiency = "Please select a proficiency level.";
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updated = {
            ...formData,
            [name]: type === 'checkbox' || type === 'radio' ? (type === 'checkbox' ? checked : value) : value
        };
        setFormData(updated);
        if (submitted) setErrors(validate(updated));
    };

    const handleSkillChange = (skill) => {
        const updated = { ...formData, [skill]: !formData[skill] };
        setFormData(updated);
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const newErrors = validate(formData);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <h2 className="text-xl font-bold mb-8 text-black">Language</h2>

                <div className="space-y-8">
                    {/* Language & Proficiency Row */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Language */}
                        <div className="flex-1">
                            <div className={`relative border rounded-xl px-4 py-3 bg-white shadow-sm ${errors.name ? 'border-red-400' : 'border-gray-200'}`}>
                                <select
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none text-gray-700 appearance-none"
                                >
                                    <option value="" disabled>Select Language</option>
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Malayalam">Malayalam</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.name}</p>
                            )}
                        </div>

                        {/* Proficiency */}
                        <div className="flex-1">
                            <div className={`relative border rounded-xl px-4 py-3 bg-white shadow-sm ${errors.proficiency ? 'border-red-400' : 'border-gray-200'}`}>
                                <select
                                    name="proficiency"
                                    value={formData.proficiency}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none text-gray-700 appearance-none"
                                >
                                    <option value="" disabled>Select proficiency</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="expert">Expert</option>
                                    <option value="native">Native</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.proficiency && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.proficiency}</p>
                            )}
                        </div>
                    </div>

                    {/* Skills (Read, Write, Speak) */}
                    <div className="flex gap-8">
                        {[
                            { id: 'canRead', label: 'Read' },
                            { id: 'canWrite', label: 'Write' },
                            { id: 'canSpeak', label: 'Speak' }
                        ].map(skill => (
                            <div
                                key={skill.id}
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => handleSkillChange(skill.id)}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData[skill.id] ? 'border-[#FFB300] bg-[#FFB300]' : 'border-gray-400'}`}>
                                    {formData[skill.id] && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                </div>
                                <span className={`text-sm ${formData[skill.id] ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                    {skill.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center items-center gap-4 pt-8 relative">
                        <button
                            onClick={handleSubmit}
                            className={`font-bold py-2.5 px-10 rounded-lg shadow-sm transition border ${hasErrors && submitted
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200'
                                : 'bg-[#FFB300] text-black hover:bg-[#e6a000] border-[#e6a000]'
                                }`}
                        >
                            Submit
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-white border border-black text-black font-bold py-2.5 px-10 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>

                        {/* Delete Button — shown only in edit mode */}
                        {isEditing && (
                            <button
                                onClick={onDelete}
                                className="absolute right-0 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                title="Delete language"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditLanguageModal;
