import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import fresherIcon from "../../assets/fresher_icon.png";
import experiencedIcon from "../../assets/experienced_icon.png";
import SearchableDropdown, { CustomDatePicker } from "./components/SearchableDropdown";
import { fetchLocationDetails } from "../../utils/locationUtils";
import config from "../../config";
import OtpVerificationModal from "../../components/OtpVerificationModal";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Step1BasicInfo = ({
    formData,
    setFormData,
    handleChange,
    primaryPhoneCode,
    setPrimaryPhoneCode,
    altPhoneCode,
    setAltPhoneCode,
    onNext
}) => {
    const navigate = useNavigate();

    // Location State 
    const [countries, setCountries] = useState(Country.getAllCountries());
    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [altPhoneError, setAltPhoneError] = useState("");
    const [pincodeError, setPincodeError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [dobError, setDobError] = useState("");
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false); // Modal state

    // Country Code UI State
    const [showPrimaryCountryDropdown, setShowPrimaryCountryDropdown] = useState(false);
    const [showAltCountryDropdown, setShowAltCountryDropdown] = useState(false);
    const [countryCodeSearch, setCountryCodeSearch] = useState("");

    const primaryDropdownRef = useRef(null);
    const altDropdownRef = useRef(null);
    const experienceModalRef = useRef(null);

    // Form Error State
    const [formError, setFormError] = useState("");

    // Work Experience State
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [experienceForm, setExperienceForm] = useState({
        jobTitle: "",
        employmentType: "",
        company: "",
        currentlyWorking: false,
        startDate: "",
        endDate: "",
        location: "",
        description: ""
    });
    const [experienceError, setExperienceError] = useState("");
    const [showDobPicker, setShowDobPicker] = useState(false);
    const [showExpStartPicker, setShowExpStartPicker] = useState(false);
    const [showExpEndPicker, setShowExpEndPicker] = useState(false);

    // Date Validation Helpers
    const getTodayStr = () => new Date().toISOString().split('T')[0];
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
    const getExpStartMin = () => {
        if (!formData.dob) return "1900-01-01";
        const d = new Date(formData.dob);
        d.setFullYear(d.getFullYear() + 18);
        return d.toISOString().split('T')[0];
    };



    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (primaryDropdownRef.current && !primaryDropdownRef.current.contains(event.target)) {
                setShowPrimaryCountryDropdown(false);
            }
            if (altDropdownRef.current && !altDropdownRef.current.contains(event.target)) {
                setShowAltCountryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const countryOptions = Country.getAllCountries().map(c => ({
        code: `+${c.phonecode}`,
        flag: c.flag,
        name: c.name,
        iso: c.isoCode
    }));

    const filteredCountryCodes = countryOptions.filter(c =>
        c.name.toLowerCase().includes(countryCodeSearch.toLowerCase()) ||
        c.code.includes(countryCodeSearch)
    );

    // Load states when country is India ("IN")
    useEffect(() => {
        if (formData.country === "IN") {
            const stateList = State.getStatesOfCountry("IN");
            setStates(stateList);
        }
    }, [formData.country]);

    // Location Handlers
    const handleCountryChange = (countryCode) => {
        setFormData(prev => ({ ...prev, country: countryCode, state: "", city: "" }));
        const stateList = State.getStatesOfCountry(countryCode);
        setStates(stateList);
        setCities([]);
    };

    const handleStateChange = (stateCode) => {
        setFormData(prev => ({ ...prev, state: stateCode, city: "" }));
        // Using "IN" directly as requested for pincode context
        const cityList = City.getCitiesOfState("IN", stateCode);
        setCities(cityList);
    };

    const handleCityChange = (cityName) => {
        setFormData(prev => ({ ...prev, city: cityName }));
    };

    // Auto-fill location by Pincode
    const handlePincodeChange = async (e) => {
        // Strip non-numeric characters automatically
        const value = e.target.value.replace(/\D/g, "");
        const newFormData = { ...formData, pincode: value };

        // Update form data first to show typing
        setFormData(newFormData);
        setPincodeError("");

        // If 6 digits, fetch location
        if (value.length === 6) {
            try {
                const details = await fetchLocationDetails(value);
                if (details) {
                    const countryCode = "IN"; // API is India only

                    // 1. Get all states for India
                    const stateList = State.getStatesOfCountry(countryCode);

                    // 2. Find matching state robustly
                    let matchedState = stateList.find(s =>
                        s.name.toLowerCase() === details.state.toLowerCase() ||
                        s.name.toLowerCase().includes(details.state.toLowerCase()) ||
                        details.state.toLowerCase().includes(s.name.toLowerCase())
                    );

                    // fallback for common variations
                    if (!matchedState && details.state.toLowerCase() === "kerala") {
                        matchedState = stateList.find(s => s.isoCode === "KL");
                    }

                    if (matchedState) {
                        setStates(stateList);
                        // 3. Get cities for that state
                        let cityList = City.getCitiesOfState(countryCode, matchedState.isoCode);

                        // 4. Find matching city robustly
                        let matchedCity = cityList.find(c =>
                            c.name.toLowerCase() === details.city.toLowerCase() ||
                            c.name.toLowerCase().includes(details.city.toLowerCase()) ||
                            details.city.toLowerCase().includes(c.name.toLowerCase())
                        );

                        // 5. If city not in list, add it dynamically so dropdown can show it
                        if (!matchedCity && details.city) {
                            const newCity = { name: details.city, stateCode: matchedState.isoCode, countryCode: countryCode };
                            cityList = [newCity, ...cityList];
                            matchedCity = newCity;
                        }

                        setCities(cityList);

                        setFormData(prev => ({
                            ...prev,
                            country: countryCode,
                            state: matchedState.isoCode,
                            city: matchedCity ? matchedCity.name : details.city,
                            pincode: value
                        }));
                        setPincodeError("");
                    } else {
                        // Reset fields if state match fails
                        setFormData(prev => ({ ...prev, country: "", state: "", city: "" }));
                        setStates([]);
                        setCities([]);
                        setPincodeError("Invalid pincode.");
                    }
                } else {
                    // Reset fields if API returns no results
                    setFormData(prev => ({ ...prev, country: "", state: "", city: "" }));
                    setStates([]);
                    setCities([]);
                    setPincodeError("Invalid pincode.");
                }
            } catch (err) {
                console.error("Pincode fetch failed", err);
                setPincodeError("Failed to fetch location details.");
            }
        } else if (value.length > 0 && value.length < 6) {
            // Optional: You could reset here too, but maybe wait for 6 digits
        }
    };



    // OTP Functions
    const sendOtp = async () => {
        try {
            const res = await axios.post(`${config.API_URL}/api/auth/send-otp`, {
                phone: `${primaryPhoneCode}${formData.phone}`
            });

            // Success response
            if (res.data.success) {
                toast.success("OTP sent securely via WhatsApp!", { duration: 5000 });
            }

            setOtpSent(true);
            setShowOtpModal(true); // Open Modal
            // alert("OTP sent to your phone (Check server console for demo)"); // Optional feedback
        } catch (err) {
            console.error("Send OTP Failed", err);
            toast.error("Failed to send OTP");
        }
    };

    const verifyOtp = async (enteredOtp) => {
        try {
            const res = await axios.post(`${config.API_URL}/api/auth/verify-otp`, {
                phone: `${primaryPhoneCode}${formData.phone}`,
                otp: enteredOtp
            });

            if (res.data.success) {
                setPhoneVerified(true);
                setShowOtpModal(false); // Close Modal
                toast.success("Phone verified successfully!");
            } else {
                toast.error("Invalid OTP");
            }
        } catch (err) {
            console.error("Verify OTP Failed", err);
            toast.error("OTP verification failed");
        }
    };

    // Validation
    // Validation (Logic Only - Minimal)
    const canProceed = () => {
        // Validation as requested
        return (
            formData.fullName.trim() !== "" &&
            formData.phone.trim() !== "" &&
            phoneVerified &&
            formData.email.trim() !== "" &&
            formData.country !== "" &&
            formData.state !== "" &&
            formData.city !== "" &&
            formData.pincode.trim() !== "" &&
            pincodeError === "" && // Added pincodeError check
            formData.dob !== "" &&
            formData.gender !== "" &&
            formData.workStatus !== "" &&
            (formData.resumeFile || formData.resumeName)
        );
    };

    const saveStep1AndContinue = async () => {
        // Validation Check with Feedback
        if (formData.fullName && !/^[A-Za-z\s]+$/.test(formData.fullName)) {
            setNameError("Name should contain only alphabets.");
            return;
        } else {
            setNameError("");
        }

        if (formData.phone) {
            if (!/^\d*$/.test(formData.phone)) {
                setPhoneError("Phone number must contain only digits.");
                return;
            } else if (!/^\d{10}$/.test(formData.phone)) {
                setPhoneError("Please enter a valid 10-digit phone number.");
                return;
            } else {
                setPhoneError("");
            }
        } else {
            setPhoneError("");
        }

        if (formData.altPhone) {
            if (!/^\d*$/.test(formData.altPhone)) {
                setAltPhoneError("Alternate phone number must contain only digits.");
                return;
            } else if (!/^\d{10}$/.test(formData.altPhone)) {
                setAltPhoneError("Please enter a valid 10-digit phone number.");
                return;
            } else {
                setAltPhoneError("");
            }
        } else {
            setAltPhoneError("");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            setEmailError("Please enter a valid email address.");
            return;
        } else {
            setEmailError("");
        }

        if (formData.pincode && !/^\d+$/.test(formData.pincode)) {
            setPincodeError("Pincode must contain only numeric values.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        } else {
            setPincodeError("");
        }

        if (!canProceed()) {
            if (!formData.dob) {
                setFormError("Please fill all mandatory fields to proceed.");
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            if (!phoneVerified && formData.fullName && formData.phone) {
                setFormError("Please verify your primary phone number via OTP to proceed.");
            } else {
                setFormError("Please fill all mandatory fields to proceed.");
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (formData.dob) {
            const todayStr = new Date().toISOString().split('T')[0];
            if (formData.dob >= todayStr) {
                setDobError("Invalid date of birth.");
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            } else {
                setDobError("");
            }
        }

        setFormError("");

        // Proceed to next step without saving to DB
        onNext();
    };

    return (
        <>
            <div className="text-center mb-32 mt-10 max-w-[580px] mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Launch <span className="text-[#FFB300]">Career</span>
                </h1>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Complete the registration form below to showcase your skills, get discovered by top employers, and open the door to life-changing job opportunities designed just for you.
                </p>
            </div>

            <div className="space-y-6 relative z-10">

                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-center shadow-sm font-semibold animate-fadeIn">
                        {formError}
                    </div>
                )}

                {/* Name */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${(formData.fullName.trim() && !nameError) ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-1">Name <span className="text-[#FF0000]">*</span></label>
                    <input
                        className="w-full bg-transparent border-b border-dashed border-[#827E7E]/50 py-2 text-sm text-black placeholder-[#827E7E] outline-none focus:border-[#FFB300]"
                        name="fullName"
                        placeholder="Enter your name"
                        value={formData.fullName}
                        onChange={(e) => {
                            handleChange(e);
                            if (e.target.value && !/^[A-Za-z\s]+$/.test(e.target.value)) {
                                setNameError("Name should contain only alphabets.");
                            } else {
                                setNameError("");
                            }
                        }}
                    />
                    {nameError && <p className="text-[#FF0000] text-xs mt-1">{nameError}</p>}
                </div>

                {/* Primary Phone Number & Verify */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-5 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${phoneVerified ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-1">Primary phone number <span className="text-[#FF0000]">*</span></label>
                    <p className="text-[10px] text-[#827E7E] mb-2">WhatsApp active number</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-end justify-between gap-4">
                            <div className="flex-1 flex items-center gap-2 border-b border-dashed border-[#827E7E]/50 pb-2 relative">
                                {/* Country Code Dropdown */}
                                <div className="relative" ref={primaryDropdownRef}>
                                    <div
                                        className="bg-white rounded px-2 py-1 flex items-center gap-1 shadow-sm h-8 cursor-pointer min-w-[60px] justify-between"
                                        onClick={() => setShowPrimaryCountryDropdown(!showPrimaryCountryDropdown)}
                                    >
                                        <span className="text-xs font-semibold whitespace-nowrap">{primaryPhoneCode}</span>
                                        <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="text-black transform transition-transform duration-200" style={{ transform: showPrimaryCountryDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            <path d="M6 9L1 4H11L6 9Z" />
                                        </svg>
                                    </div>

                                    {showPrimaryCountryDropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-fadeIn">
                                            <div className="p-2 sticky top-0 bg-white border-b z-10">
                                                <input
                                                    autoFocus
                                                    className="w-full bg-gray-50 px-3 py-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#FFB300]"
                                                    placeholder="Search country..."
                                                    value={countryCodeSearch}
                                                    onChange={(e) => setCountryCodeSearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            {filteredCountryCodes.map((c, idx) => (
                                                <div
                                                    key={`${c.iso}-${idx}`}
                                                    className="px-4 py-2 hover:bg-[#FFF9E5] cursor-pointer flex items-center gap-3 transition-colors"
                                                    onClick={() => {
                                                        setPrimaryPhoneCode(c.code);
                                                        setShowPrimaryCountryDropdown(false);
                                                        setCountryCodeSearch("");
                                                    }}
                                                >
                                                    <span className="text-lg">{c.flag}</span>
                                                    <span className="text-sm font-medium text-gray-700">{c.name}</span>
                                                    <span className="text-xs text-gray-400 ml-auto">{c.code}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    className="w-full bg-transparent text-sm text-black placeholder-[#827E7E] outline-none"
                                    name="phone"
                                    placeholder="Enter your number"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        handleChange(e);
                                        const val = e.target.value;
                                        if (phoneError) {
                                            if (/^\d{10}$/.test(val)) {
                                                setPhoneError("");
                                            } else if (!/^\d*$/.test(val)) {
                                                setPhoneError("Phone number must contain only digits.");
                                            } else if (val.length !== 10) {
                                                setPhoneError("Please enter a valid 10-digit phone number.");
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const val = e.target.value;
                                        if (val) {
                                            if (!/^\d*$/.test(val)) {
                                                setPhoneError("Phone number must contain only digits.");
                                            } else if (!/^\d{10}$/.test(val)) {
                                                setPhoneError("Please enter a valid 10-digit phone number.");
                                            } else {
                                                setPhoneError("");
                                            }
                                        } else {
                                            setPhoneError("");
                                        }
                                    }}
                                    readOnly={phoneVerified} // Lock if verified
                                />
                            </div>

                            {!phoneVerified ? (
                                <button
                                    type="button"
                                    onClick={sendOtp}
                                    disabled={formData.phone.length < 10}
                                    className={`bg-white border text-sm px-6 py-1.5 rounded-xl border-[#FFB300] font-medium transition-all ${formData.phone.length < 10
                                        ? 'opacity-50 cursor-not-allowed grayscale'
                                        : 'hover:bg-[#FFF9E5] opacity-100'
                                        }`}
                                >
                                    {otpSent ? "Resend OTP" : "Verify"}
                                </button>
                            ) : (
                                <span className="text-green-600 font-bold text-sm">Verified ✓</span>
                            )}
                        </div>
                        {phoneError && <p className="text-[#FF0000] text-xs mt-1">{phoneError}</p>}
                    </div>
                </div>

                {/* OTP Modal */}
                <OtpVerificationModal
                    isOpen={showOtpModal}
                    onClose={() => setShowOtpModal(false)}
                    phone={`${primaryPhoneCode}${formData.phone}`}
                    onVerify={verifyOtp}
                    onResend={sendOtp}
                />

                {/* Alternate Phone Number */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${(formData.altPhone.length >= 10 && !altPhoneError) ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-2">Alternate Phone Number</label>
                    <div className="flex items-center gap-2 border-b border-dashed border-[#827E7E]/50 pb-2 relative">
                        {/* Alt Country Code Dropdown */}
                        <div className="relative" ref={altDropdownRef}>
                            <div
                                className="bg-white rounded px-2 py-1 flex items-center gap-1 shadow-sm h-8 cursor-pointer min-w-[60px] justify-between"
                                onClick={() => setShowAltCountryDropdown(!showAltCountryDropdown)}
                            >
                                <span className="text-xs font-semibold whitespace-nowrap">{altPhoneCode}</span>
                                <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="text-black transform transition-transform duration-200" style={{ transform: showAltCountryDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    <path d="M6 9L1 4H11L6 9Z" />
                                </svg>
                            </div>

                            {showAltCountryDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-fadeIn">
                                    <div className="p-2 sticky top-0 bg-white border-b z-10">
                                        <input
                                            autoFocus
                                            className="w-full bg-gray-50 px-3 py-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#FFB300]"
                                            placeholder="Search country..."
                                            value={countryCodeSearch}
                                            onChange={(e) => setCountryCodeSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    {filteredCountryCodes.map((c, idx) => (
                                        <div
                                            key={`${c.iso}-${idx}`}
                                            className="px-4 py-2 hover:bg-[#FFF9E5] cursor-pointer flex items-center gap-3 transition-colors"
                                            onClick={() => {
                                                setAltPhoneCode(c.code);
                                                setShowAltCountryDropdown(false);
                                                setCountryCodeSearch("");
                                            }}
                                        >
                                            <span className="text-lg">{c.flag}</span>
                                            <span className="text-sm font-medium text-gray-700">{c.name}</span>
                                            <span className="text-xs text-gray-400 ml-auto">{c.code}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            className="w-full bg-transparent text-sm text-black placeholder-[#827E7E] outline-none"
                            name="altPhone"
                            placeholder="Enter your number"
                            value={formData.altPhone}
                            onChange={(e) => {
                                handleChange(e);
                                const val = e.target.value;
                                if (altPhoneError) {
                                    if (val === "" || /^\d{10}$/.test(val)) {
                                        setAltPhoneError("");
                                    } else if (!/^\d*$/.test(val)) {
                                        setAltPhoneError("Alternate phone number must contain only digits.");
                                    } else if (val.length !== 10) {
                                        setAltPhoneError("Please enter a valid 10-digit phone number.");
                                    }
                                }
                            }}
                            onBlur={(e) => {
                                const val = e.target.value;
                                if (val) {
                                    if (!/^\d*$/.test(val)) {
                                        setAltPhoneError("Alternate phone number must contain only digits.");
                                    } else if (!/^\d{10}$/.test(val)) {
                                        setAltPhoneError("Please enter a valid 10-digit phone number.");
                                    } else {
                                        setAltPhoneError("");
                                    }
                                } else {
                                    setAltPhoneError("");
                                }
                            }}
                        />
                    </div>
                    {altPhoneError && <p className="text-[#FF0000] text-xs mt-1">{altPhoneError}</p>}
                </div>

                {/* Email ID */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${(formData.email && !emailError) ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-1">Email ID <span className="text-[#FF0000]">*</span></label>
                    <input
                        className="w-full bg-transparent border-b border-dashed border-[#827E7E]/50 py-2 text-sm text-black placeholder-[#827E7E] outline-none focus:border-[#FFB300]"
                        name="email"
                        placeholder="www.you@example.com"
                        value={formData.email}
                        onChange={(e) => {
                            handleChange(e);
                            if (emailError) {
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (emailRegex.test(e.target.value)) {
                                    setEmailError("");
                                }
                            }
                        }}
                        onBlur={(e) => {
                            const val = e.target.value;
                            if (val) {
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailRegex.test(val)) {
                                    setEmailError("Please enter a valid email address.");
                                } else {
                                    setEmailError("");
                                }
                            } else {
                                setEmailError("");
                            }
                        }}
                    />
                    {emailError && <p className="text-[#FF0000] text-xs mt-1">{emailError}</p>}
                </div>

                {/* Location */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${(formData.pincode && formData.country && formData.state && formData.city && !pincodeError) ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-4">Location <span className="text-[#FF0000]">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <input
                                className="bg-white px-4 py-3 rounded-xl shadow-sm text-sm outline-none focus:ring-1 focus:ring-[#FFB300] placeholder-[#827E7E]"
                                name="pincode"
                                placeholder="Pin Code"
                                value={formData.pincode}
                                onChange={handlePincodeChange}
                                onBlur={(e) => {
                                    if (e.target.value && !/^\d+$/.test(e.target.value)) {
                                        setPincodeError("Pincode must contain only numeric values.");
                                    } else {
                                        setPincodeError("");
                                    }
                                }}
                            />
                            {pincodeError && <p className="text-[#FF0000] text-xs mt-1 px-1">{pincodeError}</p>}
                        </div>
                        <SearchableDropdown
                            options={countries}
                            value={formData.country}
                            onChange={handleCountryChange}
                            placeholder="Select Country"
                            valueKey="isoCode"
                            labelKey="name"
                        />

                        <SearchableDropdown
                            options={states}
                            value={formData.state}
                            onChange={handleStateChange}
                            placeholder="Select State"
                            disabled={!states.length}
                            valueKey="isoCode"
                            labelKey="name"
                        />

                        <SearchableDropdown
                            options={cities}
                            value={formData.city}
                            onChange={handleCityChange}
                            placeholder="Select City"
                            disabled={!cities.length}
                            valueKey="name"
                            labelKey="name"
                        />
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.dob && !dobError ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-1">Date of Birth <span className="text-[#FF0000]">*</span></label>
                    <div className="relative border-b border-dashed border-[#827E7E]/50 pb-2">
                        <div
                            className="w-full bg-transparent text-sm outline-none text-[#827E7E] cursor-pointer flex items-center gap-2"
                            onClick={() => setShowDobPicker(true)}
                        >
                            <svg className="w-4 h-4 text-[#827E7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formData.dob ? new Date(formData.dob).toLocaleDateString('en-GB') : "DD-MM-YYYY"}</span>
                        </div>
                        {showDobPicker && (
                            <CustomDatePicker
                                value={formData.dob}
                                minDate={getDobMin()}
                                maxDate={getDobMax()}
                                onChange={(val) => {
                                    setFormData(prev => ({ ...prev, dob: val }));
                                    setDobError("");
                                }}
                                onClose={() => setShowDobPicker(false)}
                            />
                        )}
                    </div>
                    {dobError && <p className="text-[#FF0000] text-xs mt-1">{dobError}</p>}
                </div>

                {/* Gender */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.gender ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-3">Gender <span className="text-[#FF0000]">*</span></label>
                    <div className="flex gap-16">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender === 'male' ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                {formData.gender === 'male' && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                            </div>
                            <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} className="hidden" />
                            <span className="text-sm text-black">Male</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender === 'female' ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                {formData.gender === 'female' && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                            </div>
                            <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} className="hidden" />
                            <span className="text-sm text-black">Female</span>
                        </label>
                    </div>
                </div>

                {/* Marital Status */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.maritalStatus ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-3">Marital Status <span className="text-[#FF0000]">*</span></label>
                    <div className="flex gap-16">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.maritalStatus === 'married' ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                {formData.maritalStatus === 'married' && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                            </div>
                            <input type="radio" name="maritalStatus" value="married" checked={formData.maritalStatus === "married"} onChange={handleChange} className="hidden" />
                            <span className="text-sm text-black">Married</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.maritalStatus === 'single' ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                {formData.maritalStatus === 'single' && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                            </div>
                            <input type="radio" name="maritalStatus" value="single" checked={formData.maritalStatus === "single"} onChange={handleChange} className="hidden" />
                            <span className="text-sm text-black">Single</span>
                        </label>
                    </div>
                </div>

                {/* Work Status */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-5 relative">
                    <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                        <div className={`${formData.workStatus ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-4">Work Status <span className="text-[#FF0000]">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fresher Card */}
                        <div
                            onClick={() => setFormData(prev => ({ ...prev, workStatus: 'fresher', workExperiences: [] }))}
                            className={`relative group cursor-pointer`}
                        >
                            <div className={`bg-white rounded-[24px] p-6 pr-32 h-[100px] flex items-center border-2 transition-all ${formData.workStatus === 'fresher' ? 'border-[#FFB300] shadow-md' : 'border-transparent'}`}>
                                <div>
                                    <h3 className="font-bold text-sm text-black">I'm a fresher</h3>
                                    <p className="text-[10px] text-[#827E7E] mt-1 leading-tight">I am a student / I am completed<br />graduation. ( Including Internship)</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-[-20px] w-[160px] pointer-events-none flex items-end justify-center">
                                <img src={fresherIcon} alt="Fresher" className="w-full h-auto object-contain transform translate-y-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                            </div>
                        </div>

                        {/* Experienced Card */}
                        <div
                            onClick={() => setFormData(prev => ({ ...prev, workStatus: 'experienced' }))}
                            className={`relative group cursor-pointer`}
                        >
                            <div className={`bg-white rounded-[24px] p-6 pr-32 h-[100px] flex items-center border-2 transition-all ${formData.workStatus === 'experienced' ? 'border-[#FFB300] shadow-md' : 'border-transparent'}`}>
                                <div>
                                    <h3 className="font-bold text-sm text-black">I'm experienced</h3>
                                    <p className="text-[10px] text-[#827E7E] mt-1">I have work experience.</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-[-30px] w-[220px] pointer-events-none flex items-end justify-center z-10">
                                <img src={experiencedIcon} alt="Experienced" className="w-full h-auto object-contain transform translate-y-5 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                            </div>
                        </div>
                    </div>
                </div>

                {formData.workStatus === "experienced" && (
                    <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative mt-6">

                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-sm">Work Experience <span className="text-red-500">*</span></h3>
                                <p className="text-xs text-gray-500">
                                    Your employment details will help recruiters understand your experience
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setEditingExperienceIndex(null);
                                    setExperienceForm({
                                        jobTitle: "",
                                        employmentType: "",
                                        company: "",
                                        currentlyWorking: false,
                                        startDate: "",
                                        endDate: "",
                                        location: "",
                                        description: ""
                                    });
                                    setExperienceError("");
                                    setShowExperienceModal(true);
                                }}
                                className="text-[#FFB300] font-bold text-sm"
                            >
                                Add another work experience +
                            </button>
                        </div>

                        {/* Experience List */}
                        <div className="space-y-4">
                            {formData.workExperiences.map((exp, index) => (
                                <div key={index} className="border-b border-[#FFB300] pb-4 last:border-0 last:pb-0">
                                    <h4 className="font-bold text-black">{exp.jobTitle}</h4>
                                    <p className="text-sm text-gray-700">{exp.company}, {exp.location}</p>
                                    <p className="text-xs text-gray-500">
                                        {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                                    </p>
                                    <div className="mt-2 flex gap-3">
                                        <button
                                            onClick={() => {
                                                setEditingExperienceIndex(index);
                                                setExperienceForm(exp);
                                                setExperienceError("");
                                                setShowExperienceModal(true);
                                            }}
                                            className="text-xs font-bold text-[#FFB300] hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    workExperiences: prev.workExperiences.filter((_, i) => i !== index)
                                                }));
                                            }}
                                            className="text-xs font-bold text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {formData.workExperiences.length === 0 && (
                                <p className="text-sm text-gray-400 italic">No experience added yet.</p>
                            )}
                        </div>

                    </div>
                )}


                {/* Resume */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-5 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${(formData.resumeFile || formData.resumeUrl || formData.resumeName) ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-bold text-black mb-4">Resume <span className="text-[#FF0000]">*</span></label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                // Cache current formData and phone codes to localStorage
                                const cacheData = {
                                    formData,
                                    primaryPhoneCode,
                                    altPhoneCode,
                                    step: 1
                                };
                                localStorage.setItem("profileCreationCache", JSON.stringify(cacheData));

                                // Navigate to resume-gen
                                navigate('/resume-gen', { state: { from: "/create-profile", fromProfile: true } });
                            }}
                            className="flex-1 bg-[#FFB300] hover:bg-[#ffaa00] text-black font-bold py-3 px-4 rounded-lg shadow-sm transition text-sm"
                        >
                            Create ATS friendly CV
                        </button>

                        <div className="flex-1">
                            <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        if (file.type !== "application/pdf") {
                                            toast.error("Only PDF files are allowed.");
                                            return;
                                        }
                                        if (file.size > 5 * 1024 * 1024) {
                                            toast.error("File size too large (max 5MB)");
                                            return;
                                        }
                                        setFormData(prev => ({
                                            ...prev,
                                            resumeFile: file,
                                            resumeName: file.name
                                        }));
                                    }
                                }}
                            />
                            <label
                                htmlFor="resume-upload"
                                className={`w-full h-full border-2 border-[#FFB300] text-[#FFB300] font-bold py-3 px-4 rounded-lg hover:bg-[#FFF9E5] transition flex items-center justify-center gap-2 text-sm cursor-pointer ${formData.resumeName ? 'bg-yellow-50' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="truncate max-w-[150px]">{formData.resumeName || "Upload Resume"}</span>
                            </label>
                        </div>
                    </div>
                    {formData.resumeName && (
                        <p className="text-[10px] text-gray-500 mt-2 text-right italic">Selected: {formData.resumeName}</p>
                    )}
                </div>

                {/* Next Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={saveStep1AndContinue}
                        className="bg-[#FFB300] text-black font-bold py-3 px-20 rounded-xl shadow-lg transition transform text-lg hover:scale-105 hover:bg-[#ffaa00]"
                    >
                        Next
                    </button>
                </div>

                {/* Page Indicator */}
                <p className="text-center text-[#FFB300] text-xs font-medium">Page 1 of 3</p>

                {/* Work Experience Modal */}
                {showExperienceModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div ref={experienceModalRef} className="bg-white w-[700px] rounded-2xl p-8 relative animate-fadeIn shadow-2xl max-h-[90vh] overflow-y-auto">

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-black">Work Experience <span className="text-red-500">*</span></h2>
                                    <p className="text-xs text-gray-500">Details like job title, company name, etc, help employers understand your work</p>
                                </div>
                                <button onClick={() => {
                                    setShowExperienceModal(false);
                                    setExperienceError("");
                                }} className="text-gray-500 hover:text-black font-bold text-xl">✕</button>
                            </div>

                            {experienceError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {experienceError}
                                </div>
                            )}

                            <div className="space-y-5">

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Job title <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm"
                                        placeholder="Enter your job title"
                                        value={experienceForm.jobTitle}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, jobTitle: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Employment type</label>
                                    <div className="flex flex-wrap gap-4">
                                        {["Full time", "Part time", "Internship", "Freelance", "Trainee", "Self employee"].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${experienceForm.employmentType === type ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                                    {experienceForm.employmentType === type && <div className="w-2 h-2 rounded-full bg-[#FFB300]" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="employmentType"
                                                    className="hidden"
                                                    checked={experienceForm.employmentType === type}
                                                    onChange={() => setExperienceForm({ ...experienceForm, employmentType: type })}
                                                />
                                                <span className="text-sm text-gray-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Company name or organisation? <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm"
                                        placeholder="Enter your company name"
                                        value={experienceForm.company}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                                    />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${experienceForm.currentlyWorking ? 'bg-[#FFB300] border-[#FFB300]' : 'border-gray-400'}`}>
                                        {experienceForm.currentlyWorking && <svg width="10" height="8" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={experienceForm.currentlyWorking}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, currentlyWorking: e.target.checked })}
                                    />
                                    <span className="text-sm font-bold text-black">I am presently working</span>
                                </label>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold mb-1">Joining date <span className="text-red-500">*</span></label>
                                        <div
                                            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-500 cursor-pointer flex items-center gap-2"
                                            onClick={() => setShowExpStartPicker(true)}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{experienceForm.startDate ? new Date(experienceForm.startDate).toLocaleDateString('en-GB') : "Select Date"}</span>
                                        </div>
                                        {showExpStartPicker && (
                                            <CustomDatePicker
                                                value={experienceForm.startDate}
                                                minDate={getExpStartMin()}
                                                maxDate={getTodayStr()}
                                                onChange={(val) => setExperienceForm({ ...experienceForm, startDate: val })}
                                                onClose={() => setShowExpStartPicker(false)}
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold mb-1">End date</label>
                                        <div
                                            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-500 flex items-center gap-2 ${experienceForm.currentlyWorking ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                            onClick={() => !experienceForm.currentlyWorking && setShowExpEndPicker(true)}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{experienceForm.endDate ? new Date(experienceForm.endDate).toLocaleDateString('en-GB') : "Select Date"}</span>
                                        </div>
                                        {showExpEndPicker && !experienceForm.currentlyWorking && (
                                            <CustomDatePicker
                                                value={experienceForm.endDate}
                                                minDate={experienceForm.startDate}
                                                maxDate={getTodayStr()}
                                                onChange={(val) => setExperienceForm({ ...experienceForm, endDate: val })}
                                                onClose={() => setShowExpEndPicker(false)}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Company Location <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm"
                                        placeholder="Type your designation"
                                        value={experienceForm.location}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Job profile</label>
                                    <textarea
                                        className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm resize-none"
                                        placeholder="List your major duties and successes, Highlighting specific projects."
                                        rows={3}
                                        value={experienceForm.description}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                                    />
                                    <p className="text-right text-xs text-gray-400 mt-1">4000 character(s) left</p>
                                </div>

                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    className="border border-[#FFB300] text-[#FFB300] font-bold px-8 py-2.5 rounded-lg hover:bg-[#FFF9E5] transition"
                                    onClick={() => {
                                        setShowExperienceModal(false);
                                        setExperienceError("");
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="bg-[#FFB300] text-black font-bold px-10 py-2.5 rounded-lg hover:bg-[#ffaa00] transition shadow-md"
                                    onClick={() => {
                                        if (
                                            !experienceForm.jobTitle.trim() ||
                                            !experienceForm.company.trim() ||
                                            !experienceForm.startDate ||
                                            !experienceForm.location.trim()
                                        ) {
                                            setExperienceError("Please fill all mandatory fields.");
                                            if (experienceModalRef.current) {
                                                experienceModalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                            return;
                                        }

                                        if (!/[a-zA-Z]/.test(experienceForm.jobTitle)) {
                                            setExperienceError("Job title must contain valid text.");
                                            if (experienceModalRef.current) {
                                                experienceModalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                            return;
                                        }

                                        setExperienceError("");

                                        if (editingExperienceIndex !== null) {
                                            setFormData(prev => {
                                                const newExp = [...prev.workExperiences];
                                                newExp[editingExperienceIndex] = experienceForm;
                                                return { ...prev, workExperiences: newExp };
                                            });
                                        } else {
                                            setFormData(prev => ({
                                                ...prev,
                                                workExperiences: [...prev.workExperiences, experienceForm]
                                            }));
                                        }
                                        setShowExperienceModal(false);
                                        setEditingExperienceIndex(null); // Reset index
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Step1BasicInfo;
