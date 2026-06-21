import React, { useState, useEffect, useRef, useMemo } from "react";
import { CustomDatePicker } from "../../pages/create-profile/components/SearchableDropdown";

import { Country } from "country-state-city";

const EditAdditionalDetailsModal = ({ isOpen, onClose, details, onSave }) => {
    const [formData, setFormData] = useState({
        altPhoneCode: "+91",
        altPhone: "",
        drivingLicense: false, // stored as boolean or array in backend? ProfileSidebar says "Yes" if array length > 0. Let's assume we map UI boolean to backend logic.
        dob: "",
        careerBreak: false, // boolean
        preferredWorkMode: "",
        maritalStatus: ""
    });

    const [errors, setErrors] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    const getDobMax = () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d.toISOString().split('T')[0];
    };

    const getDobMin = () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 100);
        return d.toISOString().split('T')[0];
    };



    // Country Code State
    const [countries] = useState(() => Country.getAllCountries());
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const dropdownRef = useRef(null);

    // Debounce search input for performance
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(countrySearch);
        }, 200);
        return () => clearTimeout(timer);
    }, [countrySearch]);

    // Optimization: Memoize sorted countries for extraction logic
    const sortedCountries = useMemo(() => {
        return [...countries].sort((a, b) => b.phonecode.length - a.phonecode.length);
    }, [countries]);

    useEffect(() => {
        if (details && isOpen) {
            // Parse existing data
            let extractedCode = details.altPhoneCode || "+91";
            let extractedPhone = "";

            if (details.alternatePhone) {
                const rawPhone = details.alternatePhone;

                // Find the best matching country code (longest first to avoid +1 vs +1242 issues)
                const matchedCountry = sortedCountries.find(c => rawPhone.startsWith(`+${c.phonecode}`));
                
                if (matchedCountry) {
                    extractedCode = `+${matchedCountry.phonecode}`;
                    // Remove prefix and take remaining digits
                    extractedPhone = rawPhone.slice(extractedCode.length).replace(/\D/g, '').slice(0, 10);
                } else {
                    // Fallback: Take last 10 digits as the subscriber number
                    const digits = rawPhone.replace(/\D/g, '');
                    extractedPhone = digits.slice(-10);
                }
            }

            setFormData({
                altPhoneCode: extractedCode,
                altPhone: extractedPhone,
                drivingLicense: details.drivingLicenses && details.drivingLicenses.length > 0,
                dob: details.dateOfBirth || "",
                careerBreak: details.careerBreak || false,
                preferredWorkMode: details.preferredWorkMode || "",
                maritalStatus: details.maritalStatus || ""
            });
        }
    }, [details, isOpen, sortedCountries]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let parsedValue = value;
        // Normalize boolean values
        if (value === "true" || value === true) parsedValue = true;
        else if (value === "false" || value === false) parsedValue = false;

        setErrors(prev => {
            let newErrors = { ...prev };

            if (name === 'altPhone') {
                if (parsedValue && !/^\d*$/.test(parsedValue)) {
                    newErrors.altPhone = "Phone number must contain only digits";
                } else if (parsedValue && parsedValue.length > 10) {
                    newErrors.altPhone = "Max 10 digits allowed";
                } else {
                    delete newErrors.altPhone;
                }
            }

            return newErrors;
        });

        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = () => {
        // Final length validation on submit
        if (formData.altPhone && formData.altPhone.length !== 10) {
            setErrors(prev => ({ ...prev, altPhone: "Please enter a valid 10-digit phone number" }));
            return;
        }

        if (Object.keys(errors).length > 0) return;

        const submissionData = {
            ...formData,
            fullAltPhone: formData.altPhone ? `${formData.altPhoneCode}${formData.altPhone}` : ""
        };
        onSave(submissionData);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = useMemo(() => {
        const search = debouncedSearch.toLowerCase().trim();
        // If no search, return a sliced fast list
        if (!search) return countries.slice(0, 50);
        
        const cleanSearch = search.replace('+', '');
        return countries.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.phonecode.includes(cleanSearch)
        ).slice(0, 50); // Centralize slicing here for maximum performance
    }, [countries, debouncedSearch]);

    if (!isOpen) return null;

    // Helper for Radio Button
    const RadioGroup = ({ label, name, options, value, onChange }) => (
        <div className="mb-6">
            <label className="block text-sm font-bold text-black mb-3">{label}</label>
            <div className="flex flex-wrap gap-8">
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === opt.value ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                            {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                        </div>
                        <input
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={onChange}
                            className="hidden"
                        />
                        <span className="text-sm text-black">{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    // Helper for Boolean Radio
    const BooleanRadioGroup = ({ label, name, value, onChange }) => (
        <div className="mb-6">
            <label className="block text-sm font-bold text-black mb-3">{label}</label>
            <div className="flex gap-16">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === true ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                        {value === true && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                    </div>
                    <input
                        type="radio"
                        name={name}
                        checked={value === true}
                        onChange={() => onChange({ target: { name, value: true } })}
                        className="hidden"
                    />
                    <span className="text-sm text-black">Yes</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === false ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                        {value === false && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                    </div>
                    <input
                        type="radio"
                        name={name}
                        checked={value === false}
                        onChange={() => onChange({ target: { name, value: false } })}
                        className="hidden"
                    />
                    <span className="text-sm text-black">No</span>
                </label>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn p-4" onClick={onClose}>
            <div className="bg-white w-[700px] rounded-[24px] p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                <h2 className="text-xl font-bold text-black mb-8">Additional Details</h2>

                <div className="space-y-2">

                    {/* Alternate Phone */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-black mb-2">Alternate phone number</label>
                        <div className="flex items-center gap-3 border-b border-dashed border-gray-300 pb-2">
                            {/* Country Code Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 rounded px-2 py-1 shadow-sm min-w-[70px] justify-between"
                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                >
                                    <span className="text-sm font-medium">{formData.altPhoneCode}</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transform transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}>
                                        <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {showCountryDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                                        <input
                                            autoFocus
                                            className="w-full px-3 py-2 border-b text-sm outline-none"
                                            placeholder="Search..."
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                        />
                                        {filteredCountries.map((c, idx) => (
                                            <div
                                                key={`${c.isoCode}-${idx}`}
                                                className="px-4 py-2 hover:bg-yellow-50 cursor-pointer text-sm flex justify-between items-center"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, altPhoneCode: `+${c.phonecode}` }));
                                                    setShowCountryDropdown(false);
                                                    setCountrySearch(""); // Reset search on select
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-black">{c.name}</span>
                                                    <span className="text-[10px] text-gray-500">{c.isoCode}</span>
                                                </div>
                                                <span className="text-gray-400 font-mono">+{c.phonecode}</span>
                                            </div>
                                        ))}
                                        {filteredCountries.length === 0 && (
                                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                                No countries found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <input
                                className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 text-gray-700 ${errors.altPhone ? 'text-red-500' : ''}`}
                                placeholder="Enter phone number"
                                name="altPhone"
                                value={formData.altPhone}
                                onChange={handleChange}
                                maxLength={10}
                                inputMode="numeric"
                            />
                        </div>
                        {errors.altPhone && (
                            <p className="text-red-500 text-[11px] font-medium mt-2 flex items-center gap-1">
                                <span>⚠</span> {errors.altPhone}
                            </p>
                        )}
                    </div>

                    {/* Driving License */}
                    <BooleanRadioGroup
                        label="Do you have driving license"
                        name="drivingLicense"
                        value={formData.drivingLicense}
                        onChange={handleChange}
                    />

                    {/* Date of Birth */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-black mb-2">Date of Birth</label>
                        <div
                            className="border-b border-dashed border-gray-300 pb-2 flex justify-between items-center cursor-pointer"
                            onClick={() => setShowDatePicker(true)}
                        >
                            <span className="text-sm text-gray-500">{formData.dob ? new Date(formData.dob).toLocaleDateString('en-GB') : "DD/MM/YYYY"}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        {showDatePicker && (
                            <CustomDatePicker
                                value={formData.dob}
                                minDate={getDobMin()}
                                maxDate={getDobMax()}
                                onChange={(val) => setFormData(prev => ({ ...prev, dob: val }))}
                                onClose={() => setShowDatePicker(false)}
                            />
                        )}
                    </div>

                    {/* Career Break */}
                    <BooleanRadioGroup
                        label="Do you have career break"
                        name="careerBreak"
                        value={formData.careerBreak}
                        onChange={handleChange}
                    />

                    {/* Preferred Work Mode */}
                    <RadioGroup
                        label="Preferred Work Mode"
                        name="preferredWorkMode"
                        value={formData.preferredWorkMode}
                        onChange={handleChange}
                        options={[
                            { label: "On-site", value: "on-site" },
                            { label: "Remote", value: "remote" },
                            { label: "Work from home", value: "wfh" },
                            { label: "Hybrid", value: "hybrid" }
                        ]}
                    />

                    {/* Marital Status */}
                    <RadioGroup
                        label="Marital Status"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        options={[
                            { label: "Married", value: "married" },
                            { label: "Single", value: "single" }
                        ]}
                    />

                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center gap-4 mt-10">
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-2.5 rounded-lg bg-gradient-to-r from-[#FFD572] to-[#FEBD38] text-black font-bold text-sm shadow-sm hover:shadow-md transition transform hover:scale-105"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="px-12 py-2.5 rounded-lg border border-gray-300 text-black font-medium text-sm hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAdditionalDetailsModal;
