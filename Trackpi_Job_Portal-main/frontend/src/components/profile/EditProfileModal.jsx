import SearchableDropdown, { CustomDatePicker } from "../../pages/create-profile/components/SearchableDropdown";
import react, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { toast } from "react-hot-toast";
const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

// Compute date constraints
const getTodayStr = () => new Date().toISOString().split("T")[0];
const getMaxDOB = () => {
    // User must be at least 16 years old (can't be born after today-16 years)
    const d = new Date();
    d.setFullYear(d.getFullYear() - 16);
    return d.toISOString().split("T")[0];
};
const getMinDOB = () => {
    // Oldest supported: 100 years
    const d = new Date();
    d.setFullYear(d.getFullYear() - 100);
    return d.toISOString().split("T")[0];
};

const isValidUrl = (val) => {
    if (!val.trim()) return true; // optional
    try {
        const url = new URL(val.startsWith("http") ? val : `https://${val}`);
        return url.hostname.includes(".");
    } catch {
        return false;
    }
};

const ErrorMsg = ({ msg }) =>
    msg ? <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{msg}</p> : null;

const EditProfileModal = ({ isOpen, onClose, profileData, onSave }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        fullName: "",
        jobTitle: "",
        skills: [],
        workStatus: "",
        gender: "",
        phone: "",
        email: "",
        educationDegree: "",
        locationCity: "",
        locationState: "",
        countryCode: "+91",
        maritalStatus: "",
        dob: ""
    });

    const [errors, setErrors] = useState({});
    const [skillInput, setSkillInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
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



    // Initialize form with profile data
    useEffect(() => {
        if (profileData) {
            // Normalize skills to objects
            const normalizedSkills = (profileData.skills || []).map(skill => {
                if (typeof skill === 'string') return { name: skill, isStarred: false };
                return { name: skill.name, isStarred: !!skill.isStarred };
            });

            setFormData({
                fullName: profileData.fullName || "",
                jobTitle: profileData.jobTitle || "",
                skills: normalizedSkills,
                workStatus: profileData.workStatus || "",
                gender: profileData.gender || "",
                phone: profileData.phone?.replace(/^\+91/, '') || "",
                email: profileData.email || "",
                educationDegree: profileData.education?.[0]?.degree || "",
                locationCity: profileData.location?.city || "",
                locationState: profileData.location?.state || "Kerala",
                countryCode: "+91",
                maritalStatus: profileData.maritalStatus || "",
                dob: profileData.dateOfBirth || profileData.dob
                    ? (() => {
                        const raw = profileData.dateOfBirth || profileData.dob;
                        try { return new Date(raw).toISOString().split("T")[0]; } catch { return raw; }
                    })()
                    : ""
            });
            setErrors({});
        }
    }, [profileData]);

    // ─── Debounce Search for Skills ──────────────────────────────────────────
    useEffect(() => {
        const fetchSkills = async () => {
            if (skillInput.length < 1) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await axios.get(`${config.API_URL}/api/skills/search?query=${skillInput}`);
                // Filter out already selected skills
                const availableSuggestions = res.data.filter(s =>
                    !formData.skills.some(existing => existing.name.toLowerCase() === s.toLowerCase())
                );
                setSuggestions(availableSuggestions);
            } catch (err) {
                console.error("Failed to fetch skills", err);
            }
        };

        const timeoutId = setTimeout(fetchSkills, 300);
        return () => clearTimeout(timeoutId);
    }, [skillInput, formData.skills]);

    // ─── Validation helpers ─────────────────────────────────────────────────────
    const validateField = (name, value, currentErrors = { ...errors }) => {
        const e = { ...currentErrors };

        switch (name) {
            case "fullName":
                if (!value.trim()) e.fullName = "Name is required";
                else if (!/^[A-Za-z\s.'-]+$/.test(value)) e.fullName = "Name should only contain letters";
                else if (value.trim().length < 2) e.fullName = "Name must be at least 2 characters";
                else delete e.fullName;
                break;

            case "jobTitle":
                if (value.trim() && /^\d+$/.test(value.trim())) e.jobTitle = "Job title cannot be only numbers";
                else if (value.trim() && /^[^a-zA-Z0-9]+$/.test(value.trim())) e.jobTitle = "Job title must contain valid text";
                else delete e.jobTitle;
                break;

            case "phone":
                if (!value.trim()) e.phone = "Phone number is required";
                else if (!/^\d+$/.test(value)) e.phone = "Phone number must contain only digits";
                else if (value.length !== 10) e.phone = "Please enter a valid 10-digit phone number";
                else if (/^(.)\1{9}$/.test(value)) e.phone = "Phone number cannot be all the same digit";
                else delete e.phone;
                break;

            case "email":
                if (!value.trim()) e.email = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) e.email = "Please enter a valid email address";
                else delete e.email;
                break;

            case "dob": {
                const today = new Date(); today.setHours(0, 0, 0, 0);
                const minDate = new Date(getMinDOB());
                const maxDate = new Date(getMaxDOB());
                const selected = new Date(value);
                if (!value) { delete e.dob; break; }
                if (isNaN(selected.getTime())) { e.dob = "Invalid date"; break; }
                if (selected >= today) { e.dob = "Date of birth cannot be today or a future date"; break; }
                if (selected > maxDate) { e.dob = "You must be at least 16 years old"; break; }
                if (selected < minDate) { e.dob = "Please enter a valid date of birth"; break; }
                delete e.dob;
                break;
            }

            case "educationDegree":
                if (value.trim() && /^\d+$/.test(value.trim())) e.educationDegree = "Education cannot be only numbers";
                else delete e.educationDegree;
                break;

            default:
                break;
        }

        return e;
    };

    // ─── Handlers ──────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(validateField(name, value));
    };

    const handleSkillInputChange = (e) => {
        const val = e.target.value;
        setSkillInput(val);
        if (/\d/.test(val)) {
            setErrors(prev => ({ ...prev, skillInput: "Skills cannot contain numbers" }));
        } else {
            setErrors(prev => { const n = { ...prev }; delete n.skillInput; return n; });
        }
    };

    const handleSkillAdd = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            addSkill(skillInput.trim());
        }
    };

    const addSkill = (skillName) => {
        if (/\d/.test(skillName)) return;
        const trimmed = skillName.trim();
        if (!formData.skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, { name: trimmed, isStarred: false }] }));
        }
        setSkillInput("");
        setSuggestions([]);
        setErrors(prev => { const n = { ...prev }; delete n.skillInput; return n; });
    };

    const toggleSkillStar = (index) => {
        const isCurrentlyStarred = formData.skills[index].isStarred;
        const starredCount = formData.skills.filter(s => s.isStarred).length;

        if (!isCurrentlyStarred && starredCount >= 4) {
            toast.error("Maximum 4 skills can be starred.");
            return;
        }

        const updatedSkills = [...formData.skills];
        updatedSkills[index] = { ...updatedSkills[index], isStarred: !isCurrentlyStarred };
        setFormData(prev => ({ ...prev, skills: updatedSkills }));
        setErrors(prev => { const n = { ...prev }; delete n.skillInput; return n; });
    };

    const removeSkill = (index) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
    };

    // DOB: reject today and future dates directly
    const handleDOBChange = (e) => {
        const value = e.target.value;
        const selected = new Date(value);
        const today = new Date(); today.setHours(0, 0, 0, 0);

        if (selected >= today) {
            setErrors(prev => ({ ...prev, dob: "Date of birth cannot be today or a future date" }));
            return; // Don't update form state with invalid date
        }

        setFormData(prev => ({ ...prev, dob: value }));
        setErrors(validateField("dob", value));
    };

    const handleSubmit = () => {
        // Re-validate all required fields before submit
        let allErrors = {};
        allErrors = validateField("fullName", formData.fullName, allErrors);
        allErrors = validateField("phone", formData.phone, allErrors);
        allErrors = validateField("email", formData.email, allErrors);
        if (formData.dob) allErrors = validateField("dob", formData.dob, allErrors);
        if (formData.jobTitle) allErrors = validateField("jobTitle", formData.jobTitle, allErrors);
        if (formData.educationDegree) allErrors = validateField("educationDegree", formData.educationDegree, allErrors);

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            const firstErrorField = Object.keys(allErrors)[0];
            const errorMsg = allErrors[firstErrorField];
            toast.error(`Please fix: ${errorMsg}`);
            return;
        }

        const finalData = { ...formData };

        // Auto-add pending skill
        const trimmedSkill = skillInput.trim();
        if (trimmedSkill && !/\d/.test(trimmedSkill)) {
            if (!finalData.skills.some(s => s.name.toLowerCase() === trimmedSkill.toLowerCase())) {
                finalData.skills = [...finalData.skills, { name: trimmedSkill, isStarred: false }];
            }
        }

        if (finalData.phone && !finalData.phone.startsWith("+91")) {
            finalData.phone = "+91" + finalData.phone;
        }

        onSave(finalData);
    };

    const inputClass = (hasError) =>
        `w-full border-b py-2 outline-none text-sm font-medium text-black placeholder-gray-400 transition-colors ${hasError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#FFB300]"
        }`;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8 space-y-6">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">
                            Enter your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={inputClass(errors.fullName)}
                            placeholder="e.g. John Doe"
                        />
                        <ErrorMsg msg={errors.fullName} />
                    </div>

                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Add your job title</label>
                        <input
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className={inputClass(errors.jobTitle)}
                            placeholder="e.g. Sales Executive"
                        />
                        <ErrorMsg msg={errors.jobTitle} />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-3 text-gray-500">Skills (Select up to 4 to highlight on profile)</label>
                        <div className="flex flex-wrap gap-3 mb-2">
                            {formData.skills.map((skill, idx) => (
                                <span key={idx} className="border border-[#FFB300] px-3 py-1.5 rounded-lg bg-white text-gray-700 text-xs font-bold flex items-center gap-2 shadow-sm transition-all">
                                    <span
                                        onClick={() => toggleSkillStar(idx)}
                                        className={`cursor-pointer text-lg leading-none transition-colors ${skill.isStarred ? 'text-[#FFB300]' : 'text-gray-300 hover:text-yellow-400'}`}
                                        title={skill.isStarred ? "Unstar skill" : "Star skill"}
                                    >
                                        ★
                                    </span>
                                    {skill.name}
                                    <button
                                        onClick={() => removeSkill(idx)}
                                        className="text-gray-400 hover:text-red-500 font-bold ml-1 text-lg leading-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                value={skillInput}
                                onChange={handleSkillInputChange}
                                onKeyDown={handleSkillAdd}
                                className={`w-full border-b py-2 outline-none text-sm placeholder-gray-400 transition-colors ${errors.skillInput ? "border-red-500" : "border-gray-300 focus:border-[#FFB300]"}`}
                                placeholder="Type and press Enter to add skills..."
                                autoComplete="off"
                            />

                            {/* Auto-suggestions Dropdown */}
                            {suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-50 max-h-[180px] overflow-y-auto border border-gray-200">
                                    {suggestions.map((s, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => addSkill(s)}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 border-b border-gray-50 last:border-0 flex items-center justify-between group transition-colors"
                                        >
                                            <span>{s}</span>
                                            <i className="ri-add-line text-lg text-[#FFB300] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <ErrorMsg msg={errors.skillInput} />
                    </div>

                    {/* Work Status */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-4">Work status</label>
                        <div className="flex flex-wrap gap-8">
                            {["Fresher", "Intern", "Experienced"].map(status => (
                                <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.workStatus.toLowerCase() === status.toLowerCase() ? "border-[#FFB300]" : "border-gray-800"}`}>
                                        {formData.workStatus.toLowerCase() === status.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                                    </div>
                                    <input type="radio" name="workStatus" value={status.toLowerCase()} checked={formData.workStatus.toLowerCase() === status.toLowerCase()} onChange={handleChange} className="hidden" />
                                    <span className="text-sm font-medium text-gray-800">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-4">Gender</label>
                        <div className="flex gap-12">
                            {["Male", "Female"].map(g => (
                                <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender.toLowerCase() === g.toLowerCase() ? "border-[#FFB300]" : "border-gray-800"}`}>
                                        {formData.gender.toLowerCase() === g.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                                    </div>
                                    <input type="radio" name="gender" value={g.toLowerCase()} checked={formData.gender.toLowerCase() === g.toLowerCase()} onChange={handleChange} className="hidden" />
                                    <span className="text-sm font-medium text-gray-800">{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">
                            Primary phone number <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-4 mt-2 border-b pb-2 transition-colors ${errors.phone ? "border-red-500" : "border-gray-300 focus-within:border-[#FFB300]"}`}>
                            <div className="bg-white border border-gray-200 rounded px-2 py-1 flex items-center gap-2 shadow-sm">
                                <span className="text-sm font-bold text-black">+91</span>
                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={10}
                                inputMode="numeric"
                                className="w-full bg-transparent outline-none text-sm font-medium text-gray-600 placeholder-gray-300"
                                placeholder="9785105567"
                            />
                        </div>
                        <ErrorMsg msg={errors.phone} />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">
                            Email ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClass(errors.email)}
                            placeholder="example@gmail.com"
                            type="email"
                        />
                        <ErrorMsg msg={errors.email} />
                    </div>

                    {/* Education */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Education</label>
                        <input
                            name="educationDegree"
                            value={formData.educationDegree}
                            onChange={handleChange}
                            className={inputClass(errors.educationDegree)}
                            placeholder="e.g. BSc Computer Science"
                        />
                        <ErrorMsg msg={errors.educationDegree} />
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="block text-sm font-bold text-black mb-2">District</label>
                            <SearchableDropdown
                                options={KERALA_DISTRICTS.map(d => ({ name: d, value: d }))}
                                value={formData.locationCity}
                                onChange={(val) => handleChange({ target: { name: "locationCity", value: val } })}
                                placeholder="Select District"
                                valueKey="value"
                                labelKey="name"
                                searchable={false}
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-bold text-black mb-2">State</label>
                            <SearchableDropdown
                                options={[{ name: "Kerala", value: "Kerala" }]}
                                value={formData.locationState || "Kerala"}
                                onChange={(val) => handleChange({ target: { name: "locationState", value: val } })}
                                placeholder="Select State"
                                valueKey="value"
                                labelKey="name"
                                searchable={false}
                            />
                        </div>
                    </div>

                    {/* Marital Status & DOB */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-black mb-2">Marital Status</label>
                            <SearchableDropdown
                                options={["Single", "Married", "Divorced", "Widowed"].map(s => ({ name: s, value: s.toLowerCase() }))}
                                value={formData.maritalStatus}
                                onChange={(val) => handleChange({ target: { name: "maritalStatus", value: val } })}
                                placeholder="Select Status"
                                valueKey="value"
                                labelKey="name"
                                searchable={false}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-2">
                                Date of Birth
                                <span className="ml-2 text-xs text-gray-400 font-normal">(Min age: 16)</span>
                            </label>
                            <div
                                className={`w-full border-b py-2 outline-none text-sm font-medium text-black cursor-pointer flex items-center justify-between transition-colors ${errors.dob ? "border-red-500" : "border-gray-300"}`}
                                onClick={() => setShowDatePicker(true)}
                            >
                                <span>{formData.dob ? new Date(formData.dob).toLocaleDateString('en-GB') : "Select Date"}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {showDatePicker && (
                                <CustomDatePicker
                                    value={formData.dob}
                                    minDate={getDobMin()}
                                    maxDate={getDobMax()}
                                    onChange={(val) => {
                                        setFormData(prev => ({ ...prev, dob: val }));
                                        setErrors(validateField("dob", val));
                                    }}
                                    onClose={() => setShowDatePicker(false)}
                                />
                            )}
                            <ErrorMsg msg={errors.dob} />
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={handleSubmit}
                        className="font-bold py-3 px-12 rounded-lg shadow-md transition-all bg-gradient-to-b from-[#FFF5CC] to-[#FFB300] text-black hover:shadow-lg hover:scale-105 transform active:scale-95"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white border border-gray-400 text-black font-bold py-3 px-12 rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
