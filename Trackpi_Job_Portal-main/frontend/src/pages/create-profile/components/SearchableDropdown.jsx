import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";

export const CustomDatePicker = ({ value, onChange, onClose, minDate, maxDate }) => {
    const min = minDate ? new Date(minDate) : null;
    if (min) min.setHours(0, 0, 0, 0);
    const max = maxDate ? new Date(maxDate) : null;
    if (max) max.setHours(23, 59, 59, 999);

    const initDate = value ? new Date(value) : (max && max < new Date() ? max : new Date());
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [viewingMonth, setViewingMonth] = useState(initDate.getMonth());
    const [viewingYear, setViewingYear] = useState(initDate.getFullYear());

    const modalRef = useRef(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const years = [];
    // Ensure we provide a wide range of years dynamically
    const currentYear = new Date().getFullYear();
    const minYear = min ? Math.min(min.getFullYear(), currentYear - 50) : currentYear - 50;
    const maxYear = max ? Math.max(max.getFullYear(), currentYear + 10) : currentYear + 10;

    for (let i = maxYear; i >= minYear; i--) {
        years.push(i);
    }

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        if (viewingMonth === 0) {
            setViewingMonth(11);
            setViewingYear(viewingYear - 1);
        } else {
            setViewingMonth(viewingMonth - 1);
        }
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        if (viewingMonth === 11) {
            setViewingMonth(0);
            setViewingYear(viewingYear + 1);
        } else {
            setViewingMonth(viewingMonth + 1);
        }
    };

    const handleDateClick = (day) => {
        const newDate = new Date(viewingYear, viewingMonth, day);
        if (min && newDate < min) return;
        if (max && newDate > max) return;
        
        // Fix timezone offset issue by formatting in local time
        const yy = newDate.getFullYear();
        const mm = String(newDate.getMonth() + 1).padStart(2, '0');
        const dd = String(newDate.getDate()).padStart(2, '0');
        const formattedDate = `${yy}-${mm}-${dd}`;
        
        onChange(formattedDate);
        onClose();
    };

    const isDateDisabled = (day) => {
        const date = new Date(viewingYear, viewingMonth, day);
        if (min && date < min) return true;
        if (max && date > max) return true;
        return false;
    };

    const daysInMonth = getDaysInMonth(viewingMonth, viewingYear);
    const firstDay = getFirstDayOfMonth(viewingMonth, viewingYear);

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fadeIn">
            <div
                ref={modalRef}
                className="bg-white rounded-[32px] p-8 w-[380px] shadow-2xl relative animate-scaleIn pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-2">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={min && viewingYear <= minYear && viewingMonth <= min.getMonth()}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-gray-50 transition active:scale-95 ${min && viewingYear <= minYear && viewingMonth <= min.getMonth() ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowYearDropdown(!showYearDropdown)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl transition group"
                        >
                            <span className="text-lg font-bold text-gray-900">
                                {months[viewingMonth]} {viewingYear}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showYearDropdown && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 max-h-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-y-auto z-[110] no-scrollbar">
                                {years.map((year) => (
                                    <div
                                        key={year}
                                        className={`px-4 py-3 text-center cursor-pointer font-bold text-sm transition-colors ${viewingYear === year ? 'bg-[#FFB300] text-black' : 'text-gray-700 hover:bg-[#FFF9E5]'}`}
                                        onClick={() => {
                                            setViewingYear(year);
                                            // Ensure month is still valid for the new year
                                            if (year === minYear && viewingMonth < min.getMonth()) {
                                                setViewingMonth(min.getMonth());
                                            }
                                            if (year === maxYear && viewingMonth > max.getMonth()) {
                                                setViewingMonth(max.getMonth());
                                            }
                                            setShowYearDropdown(false);
                                        }}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleNextMonth}
                        disabled={max && viewingYear >= maxYear && viewingMonth >= max.getMonth()}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-gray-50 transition active:scale-95 ${max && viewingYear >= maxYear && viewingMonth >= max.getMonth() ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                        <ChevronRight className="w-5 h-5 text-gray-800" />
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-full h-[1px] bg-gray-100 mt-4 mb-6"></div>

                <div className="grid grid-cols-7 mb-4">
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2">
                    {calendarDays.map((day, index) => {
                        const isToday = day &&
                            new Date().getDate() === day &&
                            new Date().getMonth() === viewingMonth &&
                            new Date().getFullYear() === viewingYear;

                        const isSelected = day &&
                            selectedDate &&
                            selectedDate.getDate() === day &&
                            selectedDate.getMonth() === viewingMonth &&
                            selectedDate.getFullYear() === viewingYear;

                        const disabled = day && isDateDisabled(day);

                        return (
                            <div key={index} className="flex items-center justify-center h-10">
                                {day ? (
                                    <button
                                        type="button"
                                        onClick={() => !disabled && handleDateClick(day)}
                                        disabled={disabled}
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all relative
                                            ${isSelected ? 'bg-[#93C5FD] text-black' : 'hover:bg-[#FFF9E5] text-gray-700'}
                                            ${isToday && !isSelected ? 'text-[#FFB300] border border-[#FFB300]' : ''}
                                            ${disabled ? 'opacity-10 cursor-not-allowed grayscale' : ''}
                                        `}
                                    >
                                        {day}
                                        {isToday && !isSelected && (
                                            <div className="absolute bottom-1 w-1 h-1 bg-[#FFB300] rounded-full"></div>
                                        )}
                                    </button>
                                ) : (
                                    <div className="w-9 h-9"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const SearchableDropdown = ({ options, value, onChange, placeholder, disabled, labelKey = "name", valueKey = "isoCode", searchable = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayValue, setDisplayValue] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update display value when value prop changes
    useEffect(() => {
        const selected = options.find(o => o[valueKey] === value);
        if (selected) {
            setDisplayValue(selected[labelKey]);
        } else if (!value) {
            setDisplayValue("");
        }
    }, [value, options, valueKey, labelKey]);

    const filteredOptions = options.filter(option =>
        option[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className={`w-full bg-white px-4 py-3 rounded-xl shadow-sm text-sm outline-none border flex items-center justify-between cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-[#FFB300] border-transparent'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={`${displayValue ? "text-black" : "text-[#827E7E]"} truncate pr-4`}>
                    {displayValue || placeholder}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                    <path d="M1 1L5 5L9 1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto animate-fadeIn">
                    {searchable && (
                        <div className="p-2 sticky top-0 bg-white border-b z-10">
                            <input
                                autoFocus
                                className="w-full bg-gray-50 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#FFB300] placeholder-gray-400"
                                placeholder="Type to search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                    <div className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option[valueKey]}
                                    className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${value === option[valueKey] ? 'bg-[#FFF9E5] text-black font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option[labelKey]}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-xs text-gray-400 text-center">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
