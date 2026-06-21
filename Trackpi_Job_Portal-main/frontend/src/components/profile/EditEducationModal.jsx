import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../../config";

const EDUCATION_LEVELS = [
    "10th",
    "12th",
    "Bachelor",
    "Post Graduate",
    "PhD / Doctorate"
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
    return Array.from({ length: length > 0 ? length : 1 }, (_, i) => (startYear + i).toString()).reverse();
};

const EditEducationModal = ({ isOpen, onClose, educationData, onSave, isEditing }) => {
    const [formData, setFormData] = useState({
        degree: "",
        institution: "",
        course: "",
        courseType: "Full time",
        startYear: "",
        endYear: "",
        domain: "" // New field
    });

    // Search & UI States
    const [eduSearch, setEduSearch] = useState("");
    const [universitySearch, setUniversitySearch] = useState("");
    const [courseSearch, setCourseSearch] = useState("");

    const [customCourse, setCustomCourse] = useState("");
    const [customUniversity, setCustomUniversity] = useState("");

    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [isSearchingUni, setIsSearchingUni] = useState(false);

    // 'level' | 'course' | 'university' | 'startYear' | 'endYear' | null
    const [openDropdown, setOpenDropdown] = useState(null);

    const [errors, setErrors] = useState({});

    const abortControllerRef = useRef(null);

    // Initial Load
    useEffect(() => {
        if (isOpen) {
            if (isEditing && educationData) {
                setFormData({
                    degree: educationData.degree || "",
                    institution: educationData.institution || "",
                    course: educationData.course || "",
                    courseType: educationData.courseType || "Full time",
                    startYear: educationData.startDate || "",
                    endYear: educationData.endDate || "",
                    domain: educationData.domain || "" // Pre-fill domain
                });

                // Pre-fill search inputs
                setEduSearch(educationData.degree || "");
                setUniversitySearch(educationData.institution || "");
                setCourseSearch(educationData.course || "");

                // Reset customs
                setCustomCourse("");
                setCustomUniversity("");
            } else {
                // Reset form
                setFormData({
                    degree: "",
                    institution: "",
                    course: "",
                    courseType: "Full time",
                    startYear: "",
                    endYear: ""
                });
                setEduSearch("");
                setUniversitySearch("");
                setCourseSearch("");
                setCustomCourse("");
                setCustomUniversity("");
            }
            // Reset dropdowns
            setOpenDropdown(null);
            setFilteredCourses([]);
            setFilteredUniversities([]);
        }
    }, [isOpen, educationData, isEditing]);

    // Close dropdowns on click outside (simple version for modal)
    // Since modal overlay blocks outside clicks, we mainly care about clicking inside modal but outside dropdowns.
    // We handle this by stopPropagation on dropdowns and clicking modal body closes dropdown.
    useEffect(() => {
        const handleClick = () => setOpenDropdown(null);
        if (isOpen) {
            window.addEventListener('click', handleClick);
        }
        return () => window.removeEventListener('click', handleClick);
    }, [isOpen]);

    // API: Fetch Courses
    useEffect(() => {
        setFilteredCourses([]);

        const fetchCourses = async () => {
            try {
                const query = courseSearch.trim();
                const levelParam = formData.degree ? `&level=${encodeURIComponent(formData.degree)}` : "";

                const res = await axios.get(`${config.API_URL}/api/education/courses?query=${query}${levelParam}`);
                let courses = res.data.map(c => c.name);

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
    }, [courseSearch, formData.degree]);

    // API: Fetch Universities
    useEffect(() => {
        if (!universitySearch.trim()) {
            setFilteredUniversities([]);
            return;
        }

        const fetchUniversities = async () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            try {
                setIsSearchingUni(true);
                const res = await axios.get(
                    `${config.API_URL}/api/education/universities?query=${universitySearch.trim()}`,
                    { signal: abortControllerRef.current.signal }
                );

                const unis = res.data; // Now returns objects { name, domain }
                if (!unis.find(u => u.name === "Other")) {
                    unis.push({ name: "Other", domain: null });
                }
                setFilteredUniversities(unis);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.error("Failed to fetch universities", err);
                    setFilteredUniversities([]);
                }
            } finally {
                setIsSearchingUni(false);
            }
        };

        const timer = setTimeout(fetchUniversities, 300);
        return () => clearTimeout(timer);
    }, [universitySearch]);


    const validateInput = (name, value) => {
        const newErrors = { ...errors };
        if (name === 'institution') {
            if (/^\d+$/.test(value.trim()) || /^[^a-zA-Z0-9]+$/.test(value.trim())) {
                newErrors.institution = "Institution name must contain valid text";
            } else {
                delete newErrors.institution;
            }
        }
        if (name === 'course') {
            if (/^\d+$/.test(value.trim()) || /^[^a-zA-Z0-9]+$/.test(value.trim())) {
                newErrors.course = "Course name must contain valid text";
            } else {
                delete newErrors.course;
            }
        }
        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'institution' || name === 'course') validateInput(name, value);
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        // Resolve "Other" course
        let finalCourse = formData.course;
        if (formData.course === "Other") {
            finalCourse = customCourse;
        }

        // Resolve "Other" university
        let finalUniversity = formData.institution;
        if (formData.institution === "Other") {
            finalUniversity = customUniversity;
        }

        const submitErrors = {};
        if (!formData.degree) submitErrors.degree = "Please select an education level.";
        
        if (!finalUniversity || !finalUniversity.trim()) submitErrors.institution = "University/Institute is required.";
        else if (/^\d+$/.test(finalUniversity.trim()) || /^[^a-zA-Z0-9]+$/.test(finalUniversity.trim())) submitErrors.institution = "Institution name must contain valid text";
        
        if (!finalCourse || !finalCourse.trim()) submitErrors.course = "Course is required.";
        else if (/^\d+$/.test(finalCourse.trim()) || /^[^a-zA-Z0-9]+$/.test(finalCourse.trim())) submitErrors.course = "Course name must contain valid text";

        if (!formData.startYear) submitErrors.startYear = "Start year is required.";
        
        if (!formData.endYear) submitErrors.endYear = "End year is required.";
        else if (formData.startYear && formData.endYear && parseInt(formData.endYear) < parseInt(formData.startYear)) {
            submitErrors.endYear = "Ending year must be greater than or equal to the starting year.";
        }

        if (Object.keys(submitErrors).length > 0) {
            setErrors(submitErrors);
            return;
        }

        const payload = {
            degree: formData.degree,
            institution: finalUniversity,
            course: finalCourse,
            courseType: formData.courseType,
            startDate: formData.startYear,
            endDate: formData.endYear,
            domain: formData.domain,
            year: `${formData.startYear} - ${formData.endYear}`
        };

        onSave(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking content
            >
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-2">
                    <div>
                        <h2 className="text-xl font-bold text-black flex items-center gap-1">
                            Education <span className="text-red-500">*</span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {isEditing ? "Edit your education details" : "Add details like course, university, and more, help recruiters identify your educational background"}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 pt-2 space-y-5 max-h-[70vh] overflow-y-auto" onClick={() => setOpenDropdown(null)}>

                    {/* Education (Degree) */}
                    <div className="relative group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Education <span className="text-red-500">*</span></label>
                        <div
                            className={`w-full bg-white border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer focus-within:ring-1 ${errors.degree ? 'border-red-400 focus-within:ring-red-400' : 'border-gray-300 focus-within:ring-[#FFB300]'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === 'level' ? null : 'level');
                            }}
                        >
                            <input
                                className="w-full outline-none text-gray-700 font-medium placeholder-gray-400 cursor-pointer bg-transparent"
                                placeholder="Select Education"
                                value={eduSearch}
                                readOnly
                            />
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                        </div>
                        {openDropdown === 'level' && (
                            <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-30 p-1 space-y-1 no-scrollbar bg-white rounded-xl border border-gray-100 shadow-xl">
                                {EDUCATION_LEVELS.map((level, idx) => (
                                    <div
                                        key={idx}
                                        className="px-5 py-3 rounded-lg bg-white cursor-pointer text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData(prev => ({ ...prev, degree: level, course: "" }));
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
                        {errors.degree && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.degree}</p>}
                    </div>

                    {/* University/Institute */}
                    <div className="relative group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">University/Institute <span className="text-red-500">*</span></label>
                        {["10th", "12th"].includes(formData.degree) ? (
                            <input
                                type="text"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                placeholder="Enter University/Institute"
                                className={`w-full border py-3 px-4 rounded-lg focus:outline-none ${errors.institution ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-[#FFB300]'}`}
                            />
                        ) : (
                            <>
                                <div
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer focus-within:ring-1 focus-within:ring-[#FFB300]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(openDropdown === 'university' ? null : 'university');
                                    }}
                                >
                                    <input
                                        className="w-full outline-none text-gray-700 font-medium placeholder-gray-400 cursor-pointer bg-transparent"
                                        placeholder="Enter University/Institute"
                                        value={universitySearch}
                                        onChange={(e) => {
                                            setUniversitySearch(e.target.value);
                                            setFormData({ ...formData, institution: e.target.value });
                                            validateInput('institution', e.target.value);
                                            setOpenDropdown('university');
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdown('university');
                                        }}
                                    />
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${openDropdown === 'university' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                </div>
                                {errors.institution && <p className="text-[#FF0000] text-xs mt-1">{errors.institution}</p>}
                                {openDropdown === 'university' && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-30 bg-white rounded-xl border border-gray-100 shadow-xl">
                                        {isSearchingUni && (
                                            <div className="px-6 py-4 text-sm text-gray-500 font-medium animate-pulse flex items-center gap-2">
                                                Searching...
                                            </div>
                                        )}
                                        {!isSearchingUni && filteredUniversities.map((uni, idx) => (
                                            <div
                                                key={idx}
                                                className="px-6 py-3 cursor-pointer text-sm font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100 last:border-none transition-colors flex items-center gap-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData({ ...formData, institution: uni.name, domain: uni.domain });
                                                    setUniversitySearch(uni.name);
                                                    if (uni.name !== "Other") {
                                                        setCustomUniversity("");
                                                    }
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 text-[#FFB300]">
                                                    {uni.logo || uni.domain ? (
                                                        <img
                                                            src={uni.logo || `https://logo.clearbit.com/${uni.domain}`}
                                                            alt=""
                                                            className="w-full h-full object-contain bg-white"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                const initial = uni.name ? uni.name.charAt(0).toUpperCase() : 'U';
                                                                e.target.parentElement.innerHTML = `<span class="text-[12px] font-bold">${initial}</span>`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-[12px] font-bold">
                                                            {uni.name ? uni.name.charAt(0).toUpperCase() : 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                                {uni.name}
                                            </div>
                                        ))}
                                        {!isSearchingUni && filteredUniversities.length === 0 && (
                                            <div className="px-6 py-4 text-sm text-gray-400 text-center">No results found</div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Custom University Input */}
                        {formData.institution === "Other" && (
                            <div className="mt-3 animate-fadeIn">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Specify University/Institute Name <span className="text-red-500">*</span></label>
                                <input
                                    className={`w-full bg-white border py-3 px-4 rounded-lg outline-none text-gray-700 font-medium placeholder-gray-400 ${errors.institution ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-[#FFB300]'}`}
                                    placeholder="Enter specific university name"
                                    value={customUniversity}
                                    onChange={(e) => {
                                        setCustomUniversity(e.target.value);
                                        validateInput('institution', e.target.value);
                                    }}
                                    autoFocus
                                />
                            </div>
                        )}
                        {['10th', '12th'].includes(formData.degree) && errors.institution && <p className="text-[#FF0000] text-xs mt-1">{errors.institution}</p>}
                        {formData.institution === "Other" && errors.institution && <p className="text-[#FF0000] text-xs mt-1">{errors.institution}</p>}
                    </div>

                    {/* Course */}
                    <div className="relative group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Course <span className="text-red-500">*</span></label>
                        {["10th", "12th"].includes(formData.degree) ? (
                            <input
                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${errors.course ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-[#FFB300]'}`}
                                placeholder="Enter course name"
                                value={formData.course}
                                onChange={(e) => {
                                    setFormData({ ...formData, course: e.target.value });
                                    validateInput('course', e.target.value);
                                }}
                            />
                        ) : (
                            <>
                                <div
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer focus-within:ring-1 focus-within:ring-[#FFB300]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(openDropdown === 'course' ? null : 'course');
                                    }}
                                >
                                    <input
                                        className="w-full outline-none text-gray-700 font-medium placeholder-gray-400 cursor-pointer bg-transparent"
                                        placeholder="Select Course"
                                        value={courseSearch}
                                        onChange={(e) => {
                                            setCourseSearch(e.target.value);
                                            if (e.target.value !== "Other") {
                                                setFormData(prev => ({ ...prev, course: e.target.value }));
                                                setCustomCourse("");
                                            } else {
                                                setFormData(prev => ({ ...prev, course: "Other" }));
                                            }
                                            validateInput('course', e.target.value);
                                            setOpenDropdown('course');
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdown('course');
                                        }}
                                    />
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transform transition-transform ${openDropdown === 'course' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                </div>
                                {errors.course && <p className="text-[#FF0000] text-xs mt-1">{errors.course}</p>}
                                {openDropdown === 'course' && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-30 bg-white rounded-xl border border-gray-100 shadow-xl">
                                        {filteredCourses.map((course, idx) => (
                                            <div
                                                key={idx}
                                                className="px-6 py-3 cursor-pointer text-sm font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100 last:border-none transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData({ ...formData, course });
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

                        {/* Custom Course Input */}
                        {formData.course === "Other" && (
                            <div className="mt-3 animate-fadeIn">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Specify Course Name <span className="text-red-500">*</span></label>
                                <input
                                    className={`w-full bg-white border py-3 px-4 rounded-lg outline-none text-gray-700 font-medium placeholder-gray-400 ${errors.course ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-[#FFB300]'}`}
                                    placeholder="Enter your specific course name"
                                    onChange={(e) => {
                                        setCustomCourse(e.target.value);
                                        validateInput('course', e.target.value);
                                    }}
                                    value={customCourse}
                                    autoFocus
                                />
                            </div>
                        )}
                        {['10th', '12th'].includes(formData.degree) && errors.course && <p className="text-[#FF0000] text-xs mt-1">{errors.course}</p>}
                        {formData.course === "Other" && errors.course && <p className="text-[#FF0000] text-xs mt-1">{errors.course}</p>}
                    </div>

                    {/* Course Type */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">
                            Course type <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-6">
                            {["Full time", "Part time", "Online/ E- Learning", "Correspondence/Distance learning"].map((type) => (
                                <label key={type} className="flex items-center cursor-pointer gap-2">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.courseType === type ? "border-[#FFB300]" : "border-gray-400"}`}>
                                        {formData.courseType === type && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input
                                        type="radio"
                                        name="courseType"
                                        value={type}
                                        checked={formData.courseType === type}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className={`text-sm ${formData.courseType === type ? "text-black font-medium" : "text-gray-500"}`}>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Course Duration */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">
                            Course duration <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-4">
                            {/* Start Year */}
                            <div className="flex-1 relative">
                                <div
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(openDropdown === 'startYear' ? null : 'startYear');
                                    }}
                                >
                                    <span className={formData.startYear ? "text-black" : "text-gray-400"}>
                                        {formData.startYear || "Start Year"}
                                    </span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`text-gray-400 transform transition-transform ${openDropdown === 'startYear' ? 'rotate-180' : ''}`}><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                {openDropdown === 'startYear' && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto z-30 p-1 space-y-1 no-scrollbar bg-white rounded-xl border border-gray-100 shadow-xl">
                                        {getStartYears().map((year) => (
                                            <div
                                                key={year}
                                                className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newData = { ...formData, startYear: year };
                                                    if (formData.endYear && parseInt(formData.endYear) < parseInt(year)) {
                                                        newData.endYear = year;
                                                    }
                                                    setFormData(newData);
                                                    
                                                    // Clear any UI errors
                                                    const currentErrors = { ...errors };
                                                    delete currentErrors.startYear;
                                                    if (newData.endYear !== formData.endYear) delete currentErrors.endYear;
                                                    setErrors(currentErrors);

                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {year}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.startYear && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.startYear}</p>}
                            </div>

                            <span className="text-gray-400 text-sm">To</span>

                            {/* End Year */}
                            <div className="flex-1 relative">
                                <div
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(openDropdown === 'endYear' ? null : 'endYear');
                                    }}
                                >
                                    <span className={formData.endYear ? "text-black" : "text-gray-400"}>
                                        {formData.endYear || "End Year"}
                                    </span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`text-gray-400 transform transition-transform ${openDropdown === 'endYear' ? 'rotate-180' : ''}`}><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                {openDropdown === 'endYear' && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto z-30 p-1 space-y-1 no-scrollbar bg-white rounded-xl border border-gray-100 shadow-xl">
                                        {getEndYears(formData.startYear).map((year) => (
                                            <div
                                                key={year}
                                                className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChange({ target: { name: 'endYear', value: year } });
                                                    
                                                    // Clear error
                                                    const currentErrors = { ...errors };
                                                    delete currentErrors.endYear;
                                                    setErrors(currentErrors);

                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {year}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.endYear && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.endYear}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2 flex justify-between items-center">
                    <div className="w-6"></div> {/* Spacer for alignment, logic could be added back if needed */}

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 rounded-lg border border-gray-400 text-black text-sm font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-2.5 rounded-lg bg-[#FFB300] border border-[#e6a000] text-black text-sm font-bold hover:bg-[#e6a000] transition shadow-sm"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditEducationModal;
