import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchableDropdown from "./components/SearchableDropdown";
import deleteEducationImg from "../../assets/illustrations/delete-education.png";
import { calculateProfileStrength } from "../../utils/profileUtils";
import ProfileStrengthCircle from "../../components/profile/ProfileStrengthCircle";
import toast from "react-hot-toast";
import config from "../../config";
const EDUCATION_LEVELS = [
    "10th",
    "12th",
    "Bachelor",
    "Post Graduate",
    "PhD / Doctorate"
];

const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const getStartYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 31 }, (_, i) => (currentYear - i).toString());
};

const getEndYears = (startYearValue) => {
    const currentYear = new Date().getFullYear();
    const startYear = startYearValue ? parseInt(startYearValue) : currentYear - 30;
    const endYear = currentYear + 10;
    const length = endYear - startYear + 1;
    // Return array from highest to lowest year for better UX
    return Array.from({ length: length > 0 ? length : 1 }, (_, i) => (startYear + i).toString()).reverse();
};

const Step2Education = ({ formData, setFormData, handleChange, onNext, onBack }) => {
    const containerRef = React.useRef(null);
    const [stepError, setStepError] = useState("");

    const { strength } = calculateProfileStrength({
        ...formData,
        education: formData.educationList,
        workExperience: formData.workExperiences
    });

    // ================= SKILLS LOGIC =================
    const [skillInput, setSkillInput] = useState("");
    const [skillError, setSkillError] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Debounce Search
    useEffect(() => {
        const fetchSkills = async () => {
            if (skillInput.length < 1) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await axios.get(`${config.API_URL}/api/skills/search?query=${skillInput}`);
                // Filter out already selected skills from suggestions
                const availableSkills = res.data.filter(s => !(formData.skills || []).includes(s));
                setSuggestions(availableSkills);
            } catch (err) {
                console.error("Failed to fetch skills", err);
            }
        };

        const timeoutId = setTimeout(fetchSkills, 300);
        return () => clearTimeout(timeoutId);
    }, [skillInput, formData.skills]);

    const addSkill = (skillName) => {
        if (!/[a-zA-Z]/.test(skillName)) {
            setSkillError("Skill must contain valid text.");
            return;
        }

        const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
        if (!currentSkills.some(s => (s && typeof s === 'object' ? s.name : s || "").toLowerCase() === skillName.toLowerCase())) {
            setFormData(prev => ({
                ...prev,
                skills: [...currentSkills, { name: skillName, isStarred: false }]
            }));
            setSkillInput("");
            setSkillError("");
            setSuggestions([]);
        } else {
            setSkillError("Skill already added.");
        }
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (skillInput.trim()) {
                addSkill(skillInput.trim());
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: (prev.skills || []).filter(s => 
                (s && typeof s === 'object' ? s.name : s) !== (skillToRemove && typeof skillToRemove === 'object' ? skillToRemove.name : skillToRemove)
            )
        }));
    };

    const toggleSkillStar = (skillName) => {
        setFormData(prev => ({
            ...prev,
            skills: (prev.skills || []).map(s => {
                if (s && typeof s === 'object') {
                    return s.name === skillName ? { ...s, isStarred: !s.isStarred } : s;
                }
                return s === skillName ? { name: s, isStarred: true } : s;
            })
        }));
    };

    // ================= LANGUAGE LOGIC =================
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [languageInput, setLanguageInput] = useState("");
    const [languageSuggestions, setLanguageSuggestions] = useState([]);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showProficiencyDropdown, setShowProficiencyDropdown] = useState(false);
    const [languageForm, setLanguageForm] = useState({
        name: "",
        proficiency: "",
        read: false,
        write: false,
        speak: false
    });
    const [editingLanguageIndex, setEditingLanguageIndex] = useState(null);

    // Fetch languages (Debounce only if typing, immediate if empty to get defaults)
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                // If input is empty, fetch default list (handled by backend now)
                const url = `${config.API_URL}/api/languages/search${languageInput ? `?query=${languageInput}` : ''}`;
                const res = await axios.get(url);

                // Deduplicate and filter out already added languages (except the one being edited)
                const uniqueLanguages = [...new Set(res.data)];
                const availableLanguages = uniqueLanguages.filter(lang => {
                    const isSelected = (formData.languages || []).some(l => l.name.toLowerCase() === lang.toLowerCase());
                    const isEdited = editingLanguageIndex !== null && formData.languages[editingLanguageIndex]?.name.toLowerCase() === lang.toLowerCase();
                    return !isSelected || isEdited;
                });

                setLanguageSuggestions(availableLanguages);
            } catch (err) {
                console.error("Failed to fetch languages", err);
            }
        };

        // If input is empty, fetch immediately (for default list)
        if (!languageInput) {
            fetchLanguages();
            return;
        }

        const timeoutId = setTimeout(fetchLanguages, 300);
        return () => clearTimeout(timeoutId);
    }, [languageInput, showLanguageModal]); // Re-fetch defaults when modal opens

    const handleLanguageSave = () => {
        if (!languageForm.name || !languageForm.proficiency) {
            toast.error("Please select a language and proficiency");
            return;
        }

        setFormData(prev => {
            const currentLanguages = [...(prev.languages || [])];
            if (editingLanguageIndex !== null) {
                // Prevent duplicate if renaming to an existing language
                const isDuplicate = currentLanguages.some((l, idx) => l.name.toLowerCase() === languageForm.name.toLowerCase() && idx !== editingLanguageIndex);
                if (isDuplicate) {
                    toast.error("Language already added");
                    return prev;
                }
                currentLanguages[editingLanguageIndex] = languageForm;
            } else {
                // Prevent duplicates if adding new
                if (currentLanguages.some(l => l.name.toLowerCase() === languageForm.name.toLowerCase())) {
                    toast.error("Language already added");
                    return prev;
                }
                currentLanguages.push(languageForm);
            }
            return { ...prev, languages: currentLanguages };
        });

        setShowLanguageModal(false);
        resetLanguageForm();
    };

    const handleLanguageDelete = (index) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    const resetLanguageForm = () => {
        setLanguageForm({
            name: "",
            proficiency: "",
            read: false,
            write: false,
            speak: false
        });
        setLanguageInput("");
        setEditingLanguageIndex(null);
        setShowLanguageDropdown(false);
        setShowProficiencyDropdown(false);
    };

    const openLanguageModal = (index = null) => {
        if (index !== null) {
            setEditingLanguageIndex(index);
            const lang = formData.languages[index];
            setLanguageForm(lang);
            setLanguageInput(lang.name);
        } else {
            resetLanguageForm();
        }
        setShowLanguageModal(true);
    };

    // ================= EDUCATION LOGIC =================
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [editingEducationIndex, setEditingEducationIndex] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showLanguageDeleteConfirm, setShowLanguageDeleteConfirm] = useState(false);

    // Single Dropdown State
    const [openDropdown, setOpenDropdown] = useState(null); // 'level' | 'course' | 'university' | 'startYear' | 'endYear' | null

    // Search & Form States
    const [eduSearch, setEduSearch] = useState("");
    const [courseSearch, setCourseSearch] = useState("");
    const [universitySearch, setUniversitySearch] = useState("");
    const [customCourse, setCustomCourse] = useState(""); // For "Other" flow
    const [customUniversity, setCustomUniversity] = useState(""); // For "Other" flow

    const [educationForm, setEducationForm] = useState({
        level: "",
        university: "",
        course: "",
        courseType: "Full time",
        startYear: "",
        endYear: "",
        domain: ""
    });

    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [isSearchingUni, setIsSearchingUni] = useState(false);
    const [eduErrors, setEduErrors] = useState({});

    // Ref for race condition handling
    const abortControllerRef = React.useRef(null);

    // Global Click Handler to close dropdowns
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        if (openDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openDropdown]);

    // API: Fetch Courses
    useEffect(() => {
        setFilteredCourses([]); // Reset to prevent stale flash

        const fetchCourses = async () => {
            try {
                const query = courseSearch.trim();
                const levelParam = educationForm.level ? `&level=${encodeURIComponent(educationForm.level)}` : "";

                const res = await axios.get(`${config.API_URL}/api/education/courses?query=${query}${levelParam}`);
                let courses = res.data.map(c => c.name);

                // Add "Other" option if logic requires, or just rely on user typing "Other" if my list has it. 
                // Requirement: "Frontend must inject 'Other' option in dropdown UI"
                // We will append it in the dropdown rendering or here. 
                // Let's rely on adding it to the list here for searchability.
                if (!courses.includes("Other")) {
                    courses.push("Other");
                }
                setFilteredCourses(courses);
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setFilteredCourses(["Other"]);
            }
        };

        const timer = setTimeout(fetchCourses, 300);
        return () => clearTimeout(timer);
    }, [courseSearch, educationForm.level]);

    // API: Fetch Universities
    useEffect(() => {
        if (!universitySearch.trim()) {
            setFilteredUniversities([]);
            return;
        }

        const fetchUniversities = async () => {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            try {
                setIsSearchingUni(true);
                const res = await axios.get(`${config.API_URL}/api/education/universities?query=${universitySearch.trim()}`,
                    { signal: abortControllerRef.current.signal }
                );

                // Expecting [{ name: "...", domain: "...", logo: "..." }]
                const unis = res.data;

                // Inject "Other" option
                if (!unis.some(u => u.name === "Other")) {
                    unis.push({ name: "Other", domain: null });
                }

                setFilteredUniversities(unis);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.error("Failed to fetch universities", err);
                    // Fallback to just "Other" on error
                    setFilteredUniversities([{ name: "Other", domain: null }]);
                }
            } finally {
                // Only turn off loading if this was the latest request
                setIsSearchingUni(false);
            }
        };

        const timer = setTimeout(fetchUniversities, 300);
        return () => clearTimeout(timer);
    }, [universitySearch]);


    const openEducationModal = (index = null) => {
        setOpenDropdown(null); // Reset global dropdown
        if (index !== null) {
            setEditingEducationIndex(index);
            const data = formData.educationList[index];
            setEducationForm(data);

            setEduSearch(data.level || "");
            setUniversitySearch(data.university || "");

            // Check if course is custom
            // If the course is NOT in the standard list, technically we don't know the full list yet.
            // But we can check if it looks like "Other" was used. 
            // Better strategy: Set courseSearch to the course name. 
            // If user wants to edit, they see the name.
            setCourseSearch(data.course || "");
            setCustomCourse("");

            // Setup Custom University if name was used
            setUniversitySearch(data.university || "");
            setCustomUniversity("");
        } else {
            setEducationForm({
                level: "",
                university: "",
                course: "",
                courseType: "Full time",
                startYear: "",
                endYear: "",
                domain: ""
            });
            setEditingEducationIndex(null);
            setEduSearch("");
            setCourseSearch("");
            setUniversitySearch("");
            setCourseSearch("");
            setUniversitySearch("");
            setCustomCourse("");
            setCustomUniversity("");
        }
        setEduErrors({});
        setShowEducationModal(true);
    };

    const handleEducationSave = () => {
        const errors = {};
        if (!educationForm.level) errors.level = "Education level is required";

        let finalCourse = educationForm.course;
        if (educationForm.course === "Other") {
            finalCourse = customCourse;
        }
        if (!finalCourse || !finalCourse.trim()) errors.course = "Course name is required";

        let finalUniversity = educationForm.university;
        if (educationForm.university === "Other") {
            finalUniversity = customUniversity;
        }
        if (!finalUniversity || !finalUniversity.trim()) errors.university = "University/Institute is required";

        if (!educationForm.courseType) errors.courseType = "Course type is required";
        if (!educationForm.startYear) errors.startYear = "Starting year is required";
        if (!educationForm.endYear) errors.endYear = "Ending year is required";
        if (educationForm.startYear && educationForm.endYear && parseInt(educationForm.endYear) < parseInt(educationForm.startYear)) {
            errors.endYear = "Ending year must be greater than or equal to the starting year.";
        }

        if (Object.keys(errors).length > 0) {
            setEduErrors(errors);
            // Scroll to first error if needed - but modal is usually small enough
            return;
        }
        setEduErrors({});

        const dataToSave = {
            ...educationForm,
            course: finalCourse,
            university: finalUniversity,
            // Strip UI fields
            customCourse: undefined,
            customUniversity: undefined
        };
        // Remove undefined keys
        delete dataToSave.customCourse;

        setFormData(prev => {
            const list = [...(prev.educationList || [])];
            if (editingEducationIndex !== null) {
                list[editingEducationIndex] = dataToSave;
            } else {
                list.push(dataToSave);
            }
            return { ...prev, educationList: list };
        });

        setShowEducationModal(false);
        // Reset State Hygiene
        setEducationForm({
            level: "",
            university: "",
            course: "",
            courseType: "Full time",
            startYear: "",
            endYear: ""
        });
        setEditingEducationIndex(null);
        setEduSearch("");
        setCourseSearch("");
        setUniversitySearch("");
        setUniversitySearch("");
        setCustomCourse("");
        setCustomUniversity("");
        setOpenDropdown(null);
        setEduErrors({});
    };

    const handleEducationDelete = (index) => {
        setFormData(prev => ({
            ...prev,
            educationList: prev.educationList.filter((_, i) => i !== index)
        }));
    };

    const handleNext = () => {
        if (
            !formData.languages || formData.languages.length === 0 ||
            !formData.educationList || formData.educationList.length === 0
        ) {
            setStepError("Please fill all mandatory fields to proceed.");
            if (containerRef.current) {
                containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }
        setStepError("");
        onNext();
    };


    return (
        <div className="h-screen flex flex-col animate-fadeIn">
            {/* Sticky Header Section */}
            <div className="sticky top-0 z-30 bg-white pb-6 space-y-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        "Need to get recognized by <span className="text-[#FBBF24]">HR quickly?"</span>
                    </h2>
                    <p className="text-gray-600 text-lg">Then add the missing details</p>
                </div>

                {/* Profile Strength Indicator */}
                <div className="flex justify-center mb-12">
                    <ProfileStrengthCircle strength={strength} />
                </div>
                <p className="text-center -mt-8 mb-12 text-sm font-bold text-gray-900">Profile Strength: {strength >= 100 ? "Excellent" : strength >= 50 ? "Intermediate" : "Beginner"}</p>



            </div>

            {/* Scrollable Content Section */}
            <div ref={containerRef} className="flex-1 overflow-y-auto px-1">
                {stepError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-center shadow-sm font-semibold animate-fadeIn">
                        {stepError}
                    </div>
                )}
                {/* Call to Action Cards */}
                <div className="space-y-4 mb-10">
                    {/* Language Card */}
                    <div className="bg-[#0B0F19] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white shadow-xl relative overflow-hidden group border border-[#1F2937]">
                        {/* Glow Effect */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FFB300] blur-[100px] opacity-20"></div>

                        <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FFB300] to-[#EAB308] rounded-full flex items-center justify-center text-black shrink-0 shadow-lg">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[17px] mb-1 leading-tight">Include language proficiency to stand out.</h3>
                                <p className="text-gray-400 text-xs">Members with language get up to <span className="text-[#FFB300] font-bold">20x</span> profile views</p>
                            </div>
                        </div>
                        <button onClick={() => document.getElementById('language-section')?.scrollIntoView({ behavior: 'smooth' })} className="mt-4 md:mt-0 bg-[#FFB300] hover:bg-[#ffaa00] text-black font-bold py-2.5 px-6 rounded-lg text-sm transition relative z-10 shadow-[0_0_15px_rgba(255,179,0,0.3)] whitespace-nowrap">
                            Add Language
                        </button>
                    </div>

                    {/* Skills Card */}
                    <div className="bg-[#0B0F19] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white shadow-xl relative overflow-hidden group border border-[#1F2937]">
                        {/* Glow Effect */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FFB300] blur-[100px] opacity-20"></div>

                        <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FFB300] to-[#EAB308] rounded-full flex items-center justify-center text-black shrink-0 shadow-lg">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="0"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[17px] mb-1 leading-tight">Add skills to get best suited job for you</h3>
                                <p className="text-gray-400 text-xs">Members with skills get up to <span className="text-[#FFB300] font-bold">20x</span> profile views</p>
                            </div>
                        </div>
                        <button onClick={() => document.getElementById('skills-input')?.focus()} className="mt-4 md:mt-0 bg-[#FFB300] hover:bg-[#ffaa00] text-black font-bold py-2.5 px-6 rounded-lg text-sm transition relative z-10 shadow-[0_0_15px_rgba(255,179,0,0.3)] whitespace-nowrap">
                            Add Skills
                        </button>
                    </div>
                </div>
                {/* Form Sections */}
                <div className="space-y-6">

                    {/* Skills */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4">
                            <div className={`${(formData.skills && formData.skills.length > 0 && !skillError) ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} rounded-full p-1 transition-colors duration-300`}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                            </div>
                        </div>
                        <label className="block text-sm font-bold text-black mb-2">Skills</label>

                        <div className="flex flex-col gap-3">
                            {/* Create Tags for Selected Skills */}
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(formData.skills) ? formData.skills : []).map((skill, idx) => {
                                    const skillName = typeof skill === 'object' ? skill.name : skill;
                                    const isStarred = typeof skill === 'object' ? !!skill.isStarred : false;
                                    return (
                                        <div key={idx} className="bg-white border border-[#FFB300] text-sm px-3 py-1 rounded-full flex items-center gap-2 transform transition hover:scale-105">
                                            <span 
                                                onClick={() => toggleSkillStar(skillName)}
                                                className={`cursor-pointer transition-colors ${isStarred ? 'text-yellow-600' : 'text-gray-300 hover:text-yellow-400'}`}
                                                title={isStarred ? "Unstar skill" : "Star skill"}
                                            >
                                                ⭐
                                            </span>
                                            <span className="font-medium text-black">{skillName}</span>
                                            <button
                                                onClick={() => removeSkill(skill)}
                                                className="text-black/50 hover:text-red-500 font-bold ml-1 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input Field */}
                            <div className="relative">
                                <input
                                    id="skills-input"
                                    value={skillInput}
                                    onChange={(e) => {
                                        setSkillInput(e.target.value);
                                        setSkillError("");
                                    }}
                                    onKeyDown={handleSkillKeyDown}
                                    className="w-full bg-transparent border-b border-dashed border-[#9CA3AF] py-3 text-sm focus:border-[#FFB300] outline-none text-gray-800 placeholder-gray-400 font-medium"
                                    placeholder={formData.skills && formData.skills.length > 0 ? "Add more skills..." : "Add your skills"}
                                />

                                {/* Suggestions Dropdown */}
                                {skillInput && suggestions.length > 0 && !skillError && (
                                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto animate-fadeIn">
                                        {suggestions.map(skill => (
                                            <div
                                                key={skill}
                                                onClick={() => addSkill(skill)}
                                                className="px-4 py-3 hover:bg-[#FFF9E5] cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition-colors flex items-center justify-between group"
                                            >
                                                {skill}
                                                <span className="text-[#FFB300] opacity-0 group-hover:opacity-100 font-bold">+</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Optional: Show 'Hit Enter to add' hint if no suggestions */}
                                {skillInput && suggestions.length === 0 && !skillError && (
                                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 text-center text-sm text-gray-500">
                                        Press Enter to add "{skillInput}"
                                    </div>
                                )}
                            </div>
                            {skillError && <p className="text-[#FF0000] text-xs px-1">{skillError}</p>}
                        </div>
                    </div>

                    {/* Language */}
                    {/* Language */}
                    <div id="language-section" className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4">
                            <div className={`${formData.languages && formData.languages.length > 0 ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} rounded-full p-1 transition-colors duration-300`}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                            </div>
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <label className="block text-sm font-bold text-black">Language <span className="text-red-500">*</span></label>
                            <button
                                onClick={() => openLanguageModal()}
                                className="text-[#FFB300] font-bold text-sm hover:underline"
                            >
                                Add Language +
                            </button>
                        </div>

                        {/* Language List */}
                        <div className="flex flex-col gap-3 mb-4">
                            {(formData.languages || []).map((lang, index) => (
                                <div key={index} className="bg-white rounded-lg p-3 border border-gray-100 flex justify-between items-center shadow-sm">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-black text-sm">{lang.name}</span>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{lang.proficiency}</span>
                                        </div>
                                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                            {lang.read && <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></div>Read</span>}
                                            {lang.write && <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></div>Write</span>}
                                            {lang.speak && <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></div>Speak</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openLanguageModal(index)} className="text-gray-400 hover:text-[#FFB300]">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button onClick={() => handleLanguageDelete(index)} className="text-gray-400 hover:text-red-500">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-[11px] text-gray-500 font-medium">Highlight your language proficiency to make your profile stand out.</p>
                    </div>

                    {/* Preferred Job Location */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className={`absolute top-4 right-4 rounded-full p-1 transition-colors duration-300 ${formData.preferredLocations?.[0] ? 'bg-[#22C55E]' : 'bg-[#FFB300]'}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <label className="block text-sm font-bold text-black mb-4">Preferred job Location</label>

                        <div className="relative mb-6">
                            <SearchableDropdown
                                options={KERALA_DISTRICTS.map(d => ({ name: d, value: d }))}
                                value={formData.preferredLocations[0]}
                                onChange={(val) => {
                                    const newLocs = [...formData.preferredLocations];
                                    newLocs[0] = val;
                                    setFormData({ ...formData, preferredLocations: newLocs });
                                }}
                                placeholder="Location"
                                valueKey="value"
                                labelKey="name"
                                searchable={false}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <span className="text-sm font-bold text-black min-w-[180px]">Are you ready to relocate</span>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.willRelocate === true ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                        {formData.willRelocate === true && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="willRelocate" checked={formData.willRelocate === true} onChange={() => setFormData({ ...formData, willRelocate: true })} className="hidden" />
                                    <span className="text-sm font-medium text-black">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.willRelocate === false ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                        {formData.willRelocate === false && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="willRelocate" checked={formData.willRelocate === false} onChange={() => setFormData({ ...formData, willRelocate: false })} className="hidden" />
                                    <span className="text-sm font-medium text-black">No</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Preferred Work Mode */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className={`absolute top-4 right-4 rounded-full p-1 transition-colors duration-300 ${formData.preferredWorkMode ? 'bg-[#22C55E]' : 'bg-[#FFB300]'}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <label className="block text-sm font-bold text-black mb-4">Preferred Work Mode</label>
                        <div className="flex flex-wrap gap-6">
                            {['On-site', 'Remote', 'Work from home', 'Hybrid', 'Field work'].map((mode) => (
                                <label key={mode} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.preferredWorkMode === mode.toLowerCase() ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                        {formData.preferredWorkMode === mode.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="preferredWorkMode" value={mode.toLowerCase()} checked={formData.preferredWorkMode === mode.toLowerCase()} onChange={handleChange} className="hidden" />
                                    <span className="text-sm font-medium text-black">{mode}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className={`absolute top-4 right-4 rounded-full p-1 transition-colors duration-300 ${formData.educationList?.length > 0 ? 'bg-[#22C55E]' : 'bg-[#FFB300]'}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <label className="block text-sm font-bold text-black">Education <span className="text-red-500">*</span></label>
                            <button
                                onClick={() => openEducationModal()}
                                className="text-[#FFB300] font-bold text-sm hover:underline"
                            >
                                Add Education +
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-4 font-medium">Your qualifications help employers know your educational background</p>

                        {/* Education List */}
                        <div className="space-y-3 mt-4">
                            {(formData.educationList || []).map((edu, index) => (
                                <div key={index} className="bg-transparent rounded-xl p-4 border border-[#FFB300] flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-sm text-black mb-0.5">{edu.course}</p>
                                        <p className="text-xs text-black font-medium mb-0.5">{edu.university}</p>
                                        <p className="text-[11px] text-gray-500 font-medium">{edu.startYear}-{edu.endYear || "Present"} | {edu.courseType}</p>
                                    </div>
                                    <button onClick={() => openEducationModal(index)} className="text-gray-400 hover:text-[#FFB300] mt-1">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-10 pb-10">
                    <button onClick={onBack} className="bg-white border text-black font-semibold py-3 px-10 rounded-xl shadow-sm hover:bg-gray-50 transition min-w-[120px]">
                        Back
                    </button>
                    <button onClick={handleNext} className="bg-[#FFB300] hover:bg-[#ffaa00] text-black font-bold py-3 px-10 rounded-xl shadow-lg transition transform hover:scale-105 min-w-[160px]">
                        Next
                    </button>
                </div>
            </div>


            {/* Language Modal */}
            {showLanguageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/0 backdrop-blur-sm animate-fadeIn" onClick={() => setShowLanguageModal(false)}>
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowLanguageModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h3 className="text-xl font-bold mb-8 text-gray-800">Language</h3>

                        <div className="flex gap-6 mb-8">
                            {/* Language Search */}
                            <div className="flex-1 relative group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                                <div
                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition"
                                    onClick={() => setShowLanguageDropdown(true)}
                                >
                                    <input
                                        className="w-full outline-none text-gray-700 font-medium placeholder-gray-400 cursor-pointer"
                                        placeholder="Choose language"
                                        value={languageInput}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setLanguageInput(val);
                                            setLanguageForm(prev => ({ ...prev, name: val }));
                                            setShowLanguageDropdown(true);
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (languageForm.name) {
                                                setLanguageInput("");
                                                setLanguageForm(prev => ({ ...prev, name: "" }));
                                            }
                                            setShowLanguageDropdown(true);
                                        }}
                                    />
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                </div>

                                {showLanguageDropdown && languageSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-y-auto z-30 p-1 space-y-2 no-scrollbar">
                                        {languageSuggestions.map((lang, idx) => (
                                            <div
                                                key={lang}
                                                className="px-5 py-3.5 rounded-xl bg-white border border-gray-100 cursor-pointer text-sm font-bold text-gray-700 shadow-sm hover:shadow-md transition-all hover:bg-gray-50 hover:scale-[1.01]"
                                                onClick={() => {
                                                    setLanguageForm(prev => ({ ...prev, name: lang }));
                                                    setLanguageInput(lang);
                                                    setShowLanguageDropdown(false);
                                                }}
                                            >
                                                {lang}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Proficiency */}
                            <div className="flex-1 relative">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Proficiency</label>
                                <div
                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition"
                                    onClick={() => setShowProficiencyDropdown(!showProficiencyDropdown)}
                                >
                                    <span className={`${languageForm.proficiency ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                                        {languageForm.proficiency || "Select proficiency"}
                                    </span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${showProficiencyDropdown ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                </div>

                                {showProficiencyDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-3 bg-transparent z-30 space-y-2 p-1">
                                        {["Beginner", "Intermediate", "Fluent", "Native"].map((level) => (
                                            <div
                                                key={level}
                                                className="px-5 py-3.5 rounded-xl bg-white border border-gray-100 cursor-pointer text-sm font-bold text-gray-700 shadow-sm hover:shadow-md transition-all hover:bg-gray-50 hover:scale-[1.01]"
                                                onClick={() => {
                                                    setLanguageForm(prev => ({ ...prev, proficiency: level }));
                                                    setShowProficiencyDropdown(false);
                                                }}
                                            >
                                                {level}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Checkboxes: Read, Write, Speak */}
                        <div className="flex gap-10 mb-10 pl-2">
                            {['read', 'write', 'speak'].map(type => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer select-none group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${languageForm[type] ? 'border-[#FFB300] bg-[#FFB300]' : 'border-gray-400 group-hover:border-gray-500'}`}>
                                        {languageForm[type] && <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={languageForm[type]}
                                        onChange={(e) => setLanguageForm(prev => ({ ...prev, [type]: e.target.checked }))}
                                    />
                                    <span className="capitalize text-sm font-medium text-gray-600 group-hover:text-black transition-colors">{type}</span>
                                </label>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 items-center">
                            <button
                                type="button"
                                onClick={() => setShowLanguageModal(false)}
                                className="px-8 py-2.5 rounded-lg border border-[#FFB300] text-[#FFB300] font-medium hover:bg-[#FFF9E5] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleLanguageSave}
                                className="px-8 py-2.5 rounded-lg bg-[#FFB300] text-black font-bold hover:bg-[#E6A200] transition shadow-md"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowLanguageDeleteConfirm(true);
                                }}
                                className="ml-2 text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Education Modal */}
            {showEducationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/0 backdrop-blur-sm animate-fadeIn" onClick={() => setShowEducationModal(false)}>
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => setShowEducationModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h3 className="text-xl font-bold mb-1 text-gray-800">Education <span className="text-red-500">*</span></h3>
                        <p className="text-xs text-gray-500 mb-6">Add details like course, university, and more, help recruiters identify your educational background</p>

                        <div className="space-y-6">
                            {/* Education (Degree) */}
                            <div className="relative group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Education <span className="text-red-500">*</span></label>
                                <div
                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(openDropdown === 'level' ? null : 'level');
                                    }}
                                >
                                    <input
                                        className="w-full outline-none text-gray-700 font-medium placeholder-gray-400 cursor-pointer"
                                        placeholder="Add graduate/doctorate/Phd"
                                        value={eduSearch}
                                        readOnly
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                </div>
                                {openDropdown === 'level' && (
                                    <div className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-y-auto z-30 p-1 space-y-2 no-scrollbar bg-white rounded-xl border border-gray-100 shadow-xl">
                                        {EDUCATION_LEVELS.map((level, idx) => (
                                            <div
                                                key={idx}
                                                className="px-5 py-3.5 rounded-xl bg-white border border-gray-100 cursor-pointer text-sm font-bold text-gray-700 shadow-sm hover:shadow-md transition-all hover:bg-gray-50 hover:scale-[1.01]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEducationForm(prev => ({ ...prev, level, course: "" }));
                                                    setEduSearch(level);
                                                    setCourseSearch("");
                                                    setCustomCourse("");
                                                    setFilteredCourses([]);
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {level}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {eduErrors.level && <p className="text-red-500 text-xs mt-1">{eduErrors.level}</p>}
                            </div>

                            {/* Course */}
                            <div className="relative group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Course <span className="text-red-500">*</span></label>

                                {["10th", "12th"].includes(educationForm.level) ? (
                                    // Manual Input for 10th/12th
                                    <input
                                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 outline-none text-gray-700 font-medium placeholder-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition focus:border-[#FFB300]"
                                        placeholder="Enter course name"
                                        value={educationForm.course}
                                        onChange={(e) => setEducationForm({ ...educationForm, course: e.target.value })}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                ) : (
                                    // Dropdown for others
                                    <>
                                        <div
                                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown(openDropdown === 'course' ? null : 'course');
                                            }}
                                        >
                                            <input
                                                className="w-full outline-none text-gray-700 font-medium placeholder-gray-400 cursor-pointer"
                                                placeholder="Select course"
                                                value={courseSearch}
                                                onChange={(e) => {
                                                    setCourseSearch(e.target.value);
                                                    if (e.target.value !== "Other") {
                                                        setEducationForm(prev => ({ ...prev, course: e.target.value }));
                                                        setCustomCourse("");
                                                    } else {
                                                        setEducationForm(prev => ({ ...prev, course: "Other" }));
                                                    }
                                                    setOpenDropdown('course');
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdown('course');
                                                }}
                                                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                            />
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${openDropdown === 'course' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                        {openDropdown === 'course' && (
                                            <div className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-y-auto z-30 bg-white rounded-xl border border-gray-100 shadow-xl">
                                                {filteredCourses.map((course, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="px-6 py-4 cursor-pointer text-sm font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100 last:border-none transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEducationForm({ ...educationForm, course });
                                                            setCourseSearch(course);
                                                            if (course !== "Other") {
                                                                setCustomCourse("");
                                                            }
                                                            setOpenDropdown(null);
                                                        }}
                                                    >
                                                        {course}
                                                    </div>
                                                ))}
                                                {filteredCourses.length === 0 && (
                                                    <div className="px-6 py-4 text-sm text-gray-400 text-center">No results found</div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                                {eduErrors.course && <p className="text-red-500 text-xs mt-1">{eduErrors.course}</p>}
                            </div>

                            {/* Manual Entry for "Other" Course */}
                            {educationForm.course === "Other" && (
                                <div className="mt-4 animate-fadeIn">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Specify Course Name <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 outline-none text-gray-700 font-medium placeholder-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition focus:border-blue-500"
                                        placeholder="Enter your specific course name"
                                        onChange={(e) => {
                                            setCustomCourse(e.target.value);
                                        }}
                                        value={customCourse}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                    {eduErrors.course && <p className="text-red-500 text-xs mt-1">{eduErrors.course}</p>}
                                </div>
                            )}

                            {/* University */}
                            <div className="relative group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">University/Institute <span className="text-red-500">*</span></label>
                                {["10th", "12th"].includes(educationForm.level) ? (
                                    <input
                                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 outline-none text-gray-700 font-medium placeholder-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition focus:border-[#FFB300]"
                                        placeholder="Enter university/institute"
                                        value={educationForm.university}
                                        onChange={(e) => setEducationForm({ ...educationForm, university: e.target.value })}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                ) : (
                                    <>
                                        <div
                                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown(openDropdown === 'university' ? null : 'university');
                                            }}
                                        >
                                            <input
                                                className="w-full outline-none text-gray-700 font-medium placeholder-gray-400 cursor-pointer"
                                                placeholder="Select university/institute"
                                                value={universitySearch}
                                                onChange={(e) => {
                                                    setUniversitySearch(e.target.value);
                                                    setEducationForm({ ...educationForm, university: e.target.value });
                                                    setOpenDropdown('university');
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdown('university');
                                                }}
                                                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                            />
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${openDropdown === 'university' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                        {openDropdown === 'university' && (
                                            <div className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-y-auto z-30 bg-white rounded-xl border border-gray-100 shadow-xl">
                                                {isSearchingUni && (
                                                    <div className="px-6 py-4 text-sm text-gray-500 font-medium animate-pulse flex items-center gap-2">
                                                        <svg className="animate-spin h-4 w-4 text-[#FFB300]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Searching universities...
                                                    </div>
                                                )}
                                                {!isSearchingUni && filteredUniversities.map((uni, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="px-6 py-4 cursor-pointer text-sm font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100 last:border-none transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEducationForm({ ...educationForm, university: uni.name || uni });
                                                            setUniversitySearch(uni.name || uni);
                                                            if ((uni.name || uni) !== "Other") {
                                                                setCustomUniversity("");
                                                            } else {
                                                                // If "Other" is selected, we might want to ensure customUniversity is reset or ready
                                                            }
                                                            setOpenDropdown(null);
                                                        }}
                                                    >
                                                        {uni.name || uni}
                                                    </div>
                                                ))}
                                                {!isSearchingUni && filteredUniversities.length === 0 && (
                                                    <div className="px-6 py-4 text-sm text-gray-400 text-center">No results found</div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                                {eduErrors.university && <p className="text-red-500 text-xs mt-1">{eduErrors.university}</p>}
                            </div>

                            {/* Manual Entry for "Other" University */}
                            {educationForm.university === "Other" && (
                                <div className="mt-4 animate-fadeIn">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Specify University/Institute Name <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 outline-none text-gray-700 font-medium placeholder-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition focus:border-blue-500"
                                        placeholder="Enter your specific university/institute name"
                                        onChange={(e) => {
                                            setCustomUniversity(e.target.value);
                                        }}
                                        value={customUniversity}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                    {eduErrors.university && <p className="text-red-500 text-xs mt-1">{eduErrors.university}</p>}
                                </div>
                            )}

                            {/* Course Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Course type <span className="text-red-500">*</span></label>
                                <div className="flex gap-6 flex-wrap">
                                    {["Full time", "Part time", "Online / E- Learning", "Correspondence/Distance learning"].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${educationForm.courseType === type ? 'border-[#FFB300] bg-[#FFB300]' : 'border-gray-400 group-hover:border-gray-500'}`}>
                                                {educationForm.courseType === type && <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name="courseType"
                                                className="hidden"
                                                checked={educationForm.courseType === type}
                                                onChange={() => setEducationForm({ ...educationForm, courseType: type })}
                                            />
                                            <span className="text-sm text-gray-600 font-medium group-hover:text-black transition-colors">{type}</span>
                                        </label>
                                    ))}
                                </div>
                                {eduErrors.courseType && <p className="text-red-500 text-xs mt-1">{eduErrors.courseType}</p>}
                            </div>

                            {/* Course Duration */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Course duration <span className="text-red-500">*</span></label>
                                <div className="flex items-center gap-4">
                                    {/* Start Year */}
                                    <div className="flex-1 relative group">
                                        <div
                                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown(openDropdown === 'startYear' ? null : 'startYear');
                                            }}
                                        >
                                            <span className={`text-sm font-medium ${educationForm.startYear ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {educationForm.startYear || "Starting year"}
                                            </span>
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${openDropdown === 'startYear' ? 'rotate-180' : ''}`}><path d="M1 1L5 5L9 1" /></svg>
                                        </div>
                                        {openDropdown === 'startYear' && (
                                            <div className="absolute top-full left-0 right-0 mt-3 max-h-48 overflow-y-auto z-30 p-1 space-y-1 no-scrollbar bg-white rounded-xl border border-gray-100 shadow-xl">
                                                {getStartYears().map((year) => (
                                                    <div
                                                        key={year}
                                                        className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEducationForm(prev => {
                                                                const newData = { ...prev, startYear: year };
                                                                // If end year exists and is less than new start year, reset or update it
                                                                if (prev.endYear && parseInt(prev.endYear) < parseInt(year)) {
                                                                    newData.endYear = year;
                                                                }
                                                                return newData;
                                                            });
                                                            setOpenDropdown(null);
                                                        }}
                                                    >
                                                        {year}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-sm text-gray-400 font-medium">To</span>

                                    {/* End Year */}
                                    <div className="flex-1 relative group">
                                        <div
                                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown(openDropdown === 'endYear' ? null : 'endYear');
                                            }}
                                        >
                                            <span className={`text-sm font-medium ${educationForm.endYear ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {educationForm.endYear || "Ending year"}
                                            </span>
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${openDropdown === 'endYear' ? 'rotate-180' : ''}`}><path d="M1 1L5 5L9 1" /></svg>
                                        </div>
                                        {openDropdown === 'endYear' && (
                                            <div className="absolute top-full left-0 right-0 mt-3 max-h-48 overflow-y-auto z-30 p-1 space-y-1 no-scrollbar bg-white rounded-xl border border-gray-100 shadow-xl">
                                                {getEndYears(educationForm.startYear).map((year) => (
                                                    <div
                                                        key={year}
                                                        className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEducationForm({ ...educationForm, endYear: year });
                                                            setOpenDropdown(null);
                                                        }}
                                                    >
                                                        {year}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {(eduErrors.startYear || eduErrors.endYear) && (
                                    <p className="text-red-500 text-xs mt-1">{eduErrors.startYear || eduErrors.endYear}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 mt-10 items-center">
                            <button
                                type="button"
                                onClick={() => setShowEducationModal(false)}
                                className="px-8 py-3 rounded-xl border border-[#FFB300] text-[#FFB300] font-bold hover:bg-[#FFF9E5] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleEducationSave}
                                className="px-10 py-3 rounded-xl bg-[#FFB300] text-black font-bold hover:bg-[#E6A200] transition shadow-md"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteConfirm(true);
                                }}
                                className="ml-2 text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/0 backdrop-blur-sm animate-fadeIn" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white rounded-2xl p-8 w-[420px] flex flex-col items-center shadow-2xl relative animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        {/* Illustration */}
                        <div className="w-64 h-48 mb-2 flex items-center justify-center">
                            <img src={deleteEducationImg} alt="Delete" className="w-full h-full object-contain" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Education?</h3>
                        <p className="text-sm text-gray-500 mb-8 font-medium">Sure you want to delete</p>

                        <div className="flex gap-4 w-full px-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-3 rounded-xl border border-[#FFB300] text-[#FFB300] font-bold hover:bg-[#FFF9E5] transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (editingEducationIndex !== null) {
                                        handleEducationDelete(editingEducationIndex);
                                    }
                                    setShowEducationModal(false);
                                    setShowDeleteConfirm(false);
                                }}
                                className="flex-1 py-3 rounded-xl bg-[#FFB300] text-black font-bold hover:bg-[#E6A200] transition shadow-md text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Language Delete Confirmation Modal */}
            {showLanguageDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/0 backdrop-blur-sm animate-fadeIn" onClick={() => setShowLanguageDeleteConfirm(false)}>
                    <div className="bg-white rounded-2xl p-8 w-[420px] flex flex-col items-center shadow-2xl relative animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        {/* Illustration */}
                        <div className="w-64 h-48 mb-2 flex items-center justify-center">
                            <img src={deleteEducationImg} alt="Delete" className="w-full h-full object-contain" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Language?</h3>
                        <p className="text-sm text-gray-500 mb-8 font-medium">Sure you want to delete</p>

                        <div className="flex gap-4 w-full px-2">
                            <button
                                type="button"
                                onClick={() => setShowLanguageDeleteConfirm(false)}
                                className="flex-1 py-3 rounded-xl border border-[#FFB300] text-[#FFB300] font-bold hover:bg-[#FFF9E5] transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (editingLanguageIndex !== null) {
                                        handleLanguageDelete(editingLanguageIndex);
                                    }
                                    setShowLanguageModal(false);
                                    setShowLanguageDeleteConfirm(false);
                                }}
                                className="flex-1 py-3 rounded-xl bg-[#FFB300] text-black font-bold hover:bg-[#E6A200] transition shadow-md text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Step2Education;
