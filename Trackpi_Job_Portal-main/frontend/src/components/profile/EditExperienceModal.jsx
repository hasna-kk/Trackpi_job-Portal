import React, { useState, useEffect } from "react";
import { CustomDatePicker } from "../../pages/create-profile/components/SearchableDropdown";


const formatToMMMYYYY = (dateStr) => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return dateStr;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

const EditExperienceModal = ({ isOpen, onClose, experienceData, onSave, isEditing, dob, onDelete }) => {
    const [formData, setFormData] = useState({
        jobTitle: "",
        employmentType: "",
        company: "",
        location: "", // Combined into company in UI or separate? UI shows "Company name or organisation" with value "Trackpi private limited, kakkanad, Ernalulam". Let's assume it's one field or we split it. For now, treating as one 'company' field or separate 'location'. Let's add location field but maybe hidden if UI merges it? The UI input value looks merged. Let's keep separate in state but maybe render differently. Actually, let's just use 'company' for now to match UI "Company name or organisation" input.
        currentlyWorking: false,
        startDate: "",
        endDate: "Present",
        description: "",
        salary: "",
        workMode: ""
    });

    const [errors, setErrors] = useState({});
    const [descLen, setDescLen] = useState(0);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // Date Validation Helpers
    const getTodayStr = () => new Date().toISOString().split('T')[0];
    const getExpStartMin = () => {
        if (!dob) return "1900-01-01";
        const d = new Date(dob);
        d.setFullYear(d.getFullYear() + 18);
        return d.toISOString().split('T')[0];
    };



    useEffect(() => {
        if (isOpen) {
            if (isEditing && experienceData) {
                // eslint-disable-next-line
                setFormData({
                    jobTitle: experienceData.jobTitle || "",
                    employmentType: experienceData.employmentType || "",
                    company: experienceData.company || "",
                    location: experienceData.location || "",
                    currentlyWorking: experienceData.currentlyWorking || experienceData.endDate === 'Present',
                    startDate: experienceData.startDate || "",
                    endDate: experienceData.endDate || "",
                    description: experienceData.description || "",
                    salary: experienceData.salary || "",
                    workMode: experienceData.workMode || ""
                });
            } else {
                // Reset for Add mode
                setFormData({
                    jobTitle: "",
                    employmentType: "",
                    company: "",
                    location: "",
                    currentlyWorking: false,
                    startDate: "",
                    endDate: "",
                    description: "",
                    salary: "",
                    workMode: ""
                });
            }
        }
    }, [isOpen, experienceData, isEditing]);

    const validateField = (name, value, currentData) => {
        const newErrors = { ...errors };

        if (name === 'jobTitle') {
            if (/^\d+$/.test(value.trim()) || /^[^a-zA-Z0-9]+$/.test(value.trim())) newErrors.jobTitle = "Job title must contain valid text";
            else if (!value.trim()) newErrors.jobTitle = "Job title is required";
            else delete newErrors.jobTitle;
        }
        if (name === 'company') {
            if (value.trim() && /^[^a-zA-Z0-9]+$/.test(value.trim())) newErrors.company = "Company name must contain valid text";
            else delete newErrors.company;
        }
        if (name === 'salary') {
            if (!/^\d*$/.test(value)) newErrors.salary = "Salary must contain only numeric values";
            else delete newErrors.salary;
        }
        if (name === 'startDate') {
            if (!value) newErrors.startDate = "Start date is required";
            else if (new Date(value) > new Date()) newErrors.startDate = "Start date cannot be in the future";
            else delete newErrors.startDate;
        }
        if (name === 'endDate') {
            const data = currentData || formData;
            if (!data.currentlyWorking && !value) newErrors.endDate = "End date is required";
            else if (value && data.startDate && new Date(value) < new Date(data.startDate)) newErrors.endDate = "End date must be after start date";
            else delete newErrors.endDate;
        }
        if (name === 'description') {
            if (value.length > 500) newErrors.description = "Description must be under 500 characters";
            else delete newErrors.description;
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const newData = { ...formData, [name]: type === 'checkbox' ? checked : value };
        if (name === 'currentlyWorking' && checked) newData.endDate = 'Present';
        setFormData(newData);

        if (name === 'description') setDescLen(value.length);

        setErrors(validateField(name, type === 'checkbox' ? checked : value, newData));
    };

    const handleSubmit = () => {
        const currentErrors = {};
        if (!formData.jobTitle.trim()) currentErrors.jobTitle = "Job title is required";
        if (formData.company.trim() && /^[^a-zA-Z0-9]+$/.test(formData.company.trim())) currentErrors.company = "Company name must contain valid text";
        if (!formData.startDate) currentErrors.startDate = "Start date is required";
        if (!formData.currentlyWorking && (!formData.endDate || formData.endDate === '')) currentErrors.endDate = "End date is required";
        if (!formData.currentlyWorking && formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) currentErrors.endDate = "End date must be after start date";
        if (formData.description && formData.description.length > 500) currentErrors.description = "Description must be under 500 characters";

        const allErrors = { ...errors, ...currentErrors };
        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            return;
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                <h2 className="text-xl font-bold mb-8 text-black">Work experience</h2>

                <div className="space-y-6">
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Job title</label>
                        <input
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className={`w-full bg-transparent border-b py-2 outline-none text-sm font-medium text-black placeholder-gray-500 ${errors.jobTitle ? 'border-red-500' : 'border-black'}`}
                            placeholder="Sales Executive"
                        />
                        {errors.jobTitle && <p className="text-[#FF0000] text-xs mt-1">{errors.jobTitle}</p>}
                    </div>

                    {/* Employment Type */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-3">Employment type</label>
                        <div className="flex flex-wrap gap-6">
                            {['Full time', 'Part time', 'Internship', 'Freelance', 'Trainee', 'Self employee'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <div className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${formData.employmentType === type ? 'border-[#FFB300] bg-[#FFB300]' : ''}`}>
                                        {formData.employmentType === type && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="employmentType"
                                        value={type}
                                        checked={formData.employmentType === type}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="text-sm text-gray-500">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Company name or organisation</label>
                        <input
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className={`w-full bg-transparent border-b py-2 outline-none text-sm font-medium text-black placeholder-gray-500 ${errors.company ? 'border-red-500' : 'border-black'}`}
                            placeholder="Trackpi private limited, kakkanad, Ernalulam"
                        />
                        {errors.company && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.company}</p>}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Location</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-black py-2 outline-none text-sm font-medium text-black placeholder-gray-500"
                            placeholder="e.g. New York, USA"
                        />
                    </div>

                    {/* Salary & Work Mode Row */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">Salary</label>
                            <input
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className={`w-full bg-transparent border-b py-2 outline-none text-sm font-medium text-black placeholder-gray-500 ${errors.salary ? 'border-red-500' : 'border-black'}`}
                                placeholder="e.g. 5000"
                            />
                            {errors.salary && <p className="text-[#FF0000] text-xs mt-1">{errors.salary}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">Work Mode</label>
                            <select
                                name="workMode"
                                value={formData.workMode}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-black py-2 outline-none text-sm font-medium text-black"
                            >
                                <option value="">Select</option>
                                <option value="onsite">Onsite</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    {/* Currently Working */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="currentlyWorking"
                            checked={formData.currentlyWorking}
                            onChange={handleChange}
                            className="w-4 h-4 border border-orange-400 rounded text-orange-500 focus:ring-orange-500"
                        />
                        <label className="text-sm font-bold text-black">I am presently working</label>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-8 pt-2">
                        <div>
                            <label className="block text-sm font-bold text-black mb-2">Joining date</label>
                            <div
                                className={`w-full border rounded-full px-4 py-2 bg-[#F9F9F9] cursor-pointer flex items-center justify-between ${errors.startDate ? 'border-red-400' : 'border-gray-400'}`}
                                onClick={() => setShowStartPicker(true)}
                            >
                                <span className="text-sm text-black">{formData.startDate ? formData.startDate : "Select Date"}</span>
                                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {showStartPicker && (
                                <CustomDatePicker
                                    value={formData.startDate}
                                    minDate={getExpStartMin()}
                                    maxDate={getTodayStr()}
                                    onChange={(val) => {
                                        const formatted = formatToMMMYYYY(val);
                                        setFormData(prev => ({ ...prev, startDate: formatted }));
                                        setErrors(validateField("startDate", formatted));
                                    }}
                                    onClose={() => setShowStartPicker(false)}
                                />
                            )}
                            {errors.startDate && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.startDate}</p>}
                        </div>
                        <div>
                            {formData.currentlyWorking ? (
                                <div className="mt-7 border border-gray-400 rounded-full px-4 py-2 bg-[#F9F9F9] opacity-80">
                                    <span className="text-sm text-black font-medium">Present</span>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-black mb-2">End date</label>
                                    <div
                                        className={`w-full border rounded-full px-4 py-2 bg-[#F9F9F9] cursor-pointer flex items-center justify-between ${errors.endDate ? 'border-red-400' : 'border-gray-400'}`}
                                        onClick={() => setShowEndPicker(true)}
                                    >
                                        <span className="text-sm text-black">{formData.endDate && formData.endDate !== 'Present' ? formData.endDate : "Select Date"}</span>
                                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {showEndPicker && (
                                        <CustomDatePicker
                                            value={formData.endDate === 'Present' ? '' : formData.endDate}
                                            minDate={formData.startDate}
                                            onChange={(val) => {
                                                const formatted = formatToMMMYYYY(val);
                                                setFormData(prev => ({ ...prev, endDate: formatted }));
                                                setErrors(validateField("endDate", formatted));
                                            }}
                                            onClose={() => setShowEndPicker(false)}
                                        />
                                    )}
                                    {errors.endDate && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.endDate}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-bold text-black">Description</label>
                            <span className={`text-xs ${descLen > 500 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>{descLen}/500</span>
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`w-full bg-transparent border-b py-2 outline-none text-sm font-medium text-black placeholder-gray-500 min-h-[80px] resize-none ${errors.description ? 'border-red-500' : 'border-black'}`}
                            placeholder="Describe your role and responsibilities..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.description}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center items-center gap-6 pt-8 relative">
                        <button
                            onClick={handleSubmit}
                            className="bg-gradient-to-b from-[#FFE587] to-[#FFB300] text-black font-bold py-2.5 px-12 rounded-lg shadow-sm hover:shadow-md transition w-40 border border-[#FFB300]/50"
                        >
                            Submit
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-white border border-black text-black font-bold py-2.5 px-12 rounded-lg hover:bg-gray-50 transition w-40"
                        >
                            Cancel
                        </button>
                        {isEditing && onDelete && (
                            <button
                                onClick={onDelete}
                                className="absolute right-0 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                title="Delete experience"
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

export default EditExperienceModal;
