import React, { useState, useEffect } from 'react';
import { CustomDatePicker } from '../../pages/create-profile/components/SearchableDropdown';


const formatToMMMYYYY = (dateStr) => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return dateStr;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

const DATE_REGEX = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/i;

const validateField = (field, value, exp) => {
    switch (field) {
        case 'jobTitle':
            if (!value.trim()) return 'Job title is required';
            if (/^\d+$/.test(value.trim())) return 'Job title cannot be only numbers';
            if (value.trim().length < 2) return 'Job title must be at least 2 characters';
            return '';

        case 'company':
            if (!value.trim()) return 'Company name is required';
            if (/^\d+$/.test(value.trim())) return 'Company name cannot be only numbers';
            return '';

        case 'startDate':
            if (!value.trim()) return 'Start date is required';
            if (!DATE_REGEX.test(value.trim())) return 'Use format: MMM YYYY (e.g. Jan 2022)';
            if (new Date(value.trim()) > new Date()) return 'Start date cannot be in the future';
            return '';

        case 'endDate': {
            if (!value.trim()) return 'End date is required';
            const isPresent = value.trim().toLowerCase() === 'present';
            if (!isPresent && !DATE_REGEX.test(value.trim())) return 'Use "Present" or MMM YYYY (e.g. Jan 2024)';
            // Start date must be before end date
            if (!isPresent && exp.startDate && DATE_REGEX.test(exp.startDate)) {
                const startParts = exp.startDate.split(' ');
                const endParts = value.split(' ');
                const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                const startIdx = months.indexOf(startParts[0].toLowerCase());
                const endIdx = months.indexOf(endParts[0].toLowerCase());
                const startNum = parseInt(startParts[1]) * 12 + startIdx;
                const endNum = parseInt(endParts[1]) * 12 + endIdx;
                if (endNum < startNum) return 'End date must be after start date';
            }
            return '';
        }

        case 'location':
            if (value.trim() && /^\d+$/.test(value.trim())) return 'Location cannot be only numbers';
            return '';

        case 'description':
            if (value.trim() && value.trim().length < 10) return 'Description must be at least 10 characters';
            return '';

        default:
            return '';
    }
};

/* ─── Component ─── */
const BulkEditExperienceModal = ({ isOpen, onClose, initialExperiences, onSave, dob }) => {

    const [experiences, setExperiences] = useState([]);
    const [errors, setErrors] = useState([]);
    const [showPicker, setShowPicker] = useState({ index: null, field: null });

    // Date Validation Helpers (Dynamic)
    const getTodayStr = () => new Date().toISOString().split('T')[0];
    const getExpStartMin = () => {
        // If we don't have user DOB here, we might need it as a prop. 
        // For now, let's assume we use a safe default or it's passed.
        // Looking at Profile.jsx, BulkEditExperienceModal doesn't get DOB yet.
        // Let's add 'dob' to props.
        return "1926-01-01"; // Fallback if no dob
    };


    useEffect(() => {
        if (isOpen) {
            setExperiences(initialExperiences || []);
            setErrors((initialExperiences || []).map(() => ({})));
        }
    }, [isOpen, initialExperiences]);

    /* ── Field change with inline validation ── */
    const handleChange = (index, field, value) => {
        const updated = [...experiences];
        updated[index] = { ...updated[index], [field]: value };
        setExperiences(updated);

        const msg = validateField(field, value, updated[index]);
        const updatedErrors = [...errors];
        updatedErrors[index] = { ...updatedErrors[index], [field]: msg };
        setErrors(updatedErrors);
    };

    const handleDelete = (index) => {
        setExperiences(experiences.filter((_, i) => i !== index));
        setErrors(errors.filter((_, i) => i !== index));
    };

    const handleAdd = () => {
        setExperiences([
            ...experiences,
            { jobTitle: '', company: '', employmentType: 'Full-time', startDate: '', endDate: '', location: '', description: '' }
        ]);
        setErrors([...errors, {}]);
    };

    /* ── Submit: full validation pass ── */
    const handleSubmit = () => {
        const requiredFields = ['jobTitle', 'company', 'startDate', 'endDate'];
        const allErrors = experiences.map((exp) => {
            const entryErrors = {};
            requiredFields.forEach((field) => {
                const msg = validateField(field, exp[field] || '', exp);
                if (msg) entryErrors[field] = msg;
            });
            // Validate optional fields if filled
            ['location', 'description'].forEach((field) => {
                if (exp[field]) {
                    const msg = validateField(field, exp[field], exp);
                    if (msg) entryErrors[field] = msg;
                }
            });
            return entryErrors;
        });

        const hasErrors = allErrors.some((e) => Object.keys(e).length > 0);
        if (hasErrors) {
            setErrors(allErrors);
            return;
        }

        onSave(experiences);
        onClose();
    };

    if (!isOpen) return null;

    /* ── Helper: field classes ── */
    const inputCls = (errMsg) =>
        `w-full p-2 border rounded focus:ring-2 focus:border-transparent outline-none transition ${errMsg ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-300 focus:ring-[#FFB300]'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Edit Experience</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
                    {experiences.map((exp, index) => {
                        const err = errors[index] || {};
                        return (
                            <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                                    title="Remove this experience"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>

                                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Experience {index + 1}</h3>

                                {/* Job Title + Company */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Job Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={exp.jobTitle}
                                            onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
                                            className={inputCls(err.jobTitle)}
                                            placeholder="Ex: Sales Manager"
                                        />
                                        {err.jobTitle && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                {err.jobTitle}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleChange(index, 'company', e.target.value)}
                                            className={inputCls(err.company)}
                                            placeholder="Ex: trackpi private limited"
                                        />
                                        {err.company && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                {err.company}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Employment Type + Start Date + End Date */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                        <select
                                            value={exp.employmentType}
                                            onChange={(e) => handleChange(index, 'employmentType', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFB300] focus:border-transparent outline-none transition bg-white"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Freelance">Freelance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className={`${inputCls(err.startDate)} cursor-pointer flex justify-between items-center`}
                                            onClick={() => setShowPicker({ index, field: 'startDate' })}
                                        >
                                            <span className={exp.startDate ? 'text-black' : 'text-gray-400'}>
                                                {exp.startDate ? exp.startDate : "Select Date"}
                                            </span>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        {showPicker.index === index && showPicker.field === 'startDate' && (
                                            <CustomDatePicker
                                                value={exp.startDate}
                                                minDate={dob ? (() => {
                                                    const d = new Date(dob);
                                                    d.setFullYear(d.getFullYear() + 18);
                                                    return d.toISOString().split('T')[0];
                                                })() : "1900-01-01"}
                                                maxDate={getTodayStr()}
                                                onChange={(val) => handleChange(index, 'startDate', formatToMMMYYYY(val))}
                                                onClose={() => setShowPicker({ index: null, field: null })}
                                            />
                                        )}
                                        {err.startDate && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                {err.startDate}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className={`${inputCls(err.endDate)} cursor-pointer flex justify-between items-center`}
                                            onClick={() => setShowPicker({ index, field: 'endDate' })}
                                        >
                                            <span className={exp.endDate && exp.endDate !== 'Present' ? 'text-black' : 'text-gray-400'}>
                                                {exp.endDate && exp.endDate !== 'Present' ? exp.endDate : (exp.endDate === 'Present' ? 'Present' : "Select Date")}
                                            </span>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        {showPicker.index === index && showPicker.field === 'endDate' && (
                                            <CustomDatePicker
                                                value={exp.endDate === 'Present' ? '' : exp.endDate}
                                                minDate={exp.startDate}
                                                onChange={(val) => handleChange(index, 'endDate', formatToMMMYYYY(val))}
                                                onClose={() => setShowPicker({ index: null, field: null })}
                                            />
                                        )}
                                        {err.endDate && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                {err.endDate}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={exp.location}
                                        onChange={(e) => handleChange(index, 'location', e.target.value)}
                                        className={inputCls(err.location)}
                                        placeholder="Ex: Bangalore, India"
                                    />
                                    {err.location && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            {err.location}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                                        rows={3}
                                        className={`${inputCls(err.description)} resize-none`}
                                        placeholder="Describe your role and achievements..."
                                    />
                                    {err.description && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            {err.description}
                                        </p>
                                    )}
                                </div>

                            </div>
                        );
                    })}

                    {/* Add Another */}
                    <button
                        onClick={handleAdd}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#FFB300] hover:text-[#FFB300] transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Another Experience
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 rounded-lg bg-[#FFB300] text-black font-bold hover:bg-[#ffca2c] transition shadow-sm"
                    >
                        Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkEditExperienceModal;
