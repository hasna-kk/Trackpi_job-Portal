import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, Edit, Trash2, FileText, ChevronDown, X, Upload, Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

// ─── Custom Calendar Component ──────────────────────────────────────────────
const CustomCalendarPopup = ({ onSelect, onClose, value, position = "left-0" }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Parse current value safely (YYYY-MM-DD)
    const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
    const [viewDate, setViewDate] = useState(initialDate);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // Calendar math
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const handleDateSelect = (day) => {
        if (!day) return;
        const selected = new Date(year, month, day);
        // Format to YYYY-MM-DD manually to avoid timezone shift from toISOString
        const y = selected.getFullYear();
        const m = (selected.getMonth() + 1).toString().padStart(2, '0');
        const d = selected.getDate().toString().padStart(2, '0');
        const formatted = `${y}-${m}-${d}`;
        onSelect(formatted);
        onClose();
    };

    return (
        <div className={`absolute top-[105%] ${position} z-[110] bg-white rounded-[1.5rem] shadow-[0_15px_40px_-5px_rgba(0,0,0,0.15)] p-4 max-w-[280px] w-full border border-gray-100 animate-in fade-in zoom-in-95 duration-200 origin-top`}>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-50 rounded-lg transition-all shadow-sm active:scale-90 bg-white border border-gray-100">
                    <ChevronLeft size={16} className="text-gray-900" />
                </button>

                <div className="flex items-center gap-1 group cursor-pointer">
                    <span className="text-sm font-black text-gray-900 leading-none">{months[month]} {year}</span>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>

                <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-50 rounded-lg transition-all shadow-sm active:scale-90 bg-white border border-gray-100">
                    <ChevronRight size={16} className="text-gray-900" />
                </button>
            </div>

            <div className="h-px bg-gray-900/5 mb-3 mx-1"></div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {daysOfWeek.map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-black text-gray-400 py-1 uppercase tracking-wider">
                        {d}
                    </div>
                ))}
            </div>

            {/* Actual Grid */}
            <div className="grid grid-cols-7 gap-0.5">
                {days.map((day, i) => {
                    const isToday = day && i - firstDayOfMonth + 1 === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                    const dateStr = day ? `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : null;
                    const isSelected = day && dateStr === value;

                    return (
                        <div
                            key={i}
                            onClick={() => handleDateSelect(day)}
                            className={`
                                aspect-square flex items-center justify-center text-[11px] font-bold rounded-lg transition-all
                                ${!day ? "bg-transparent" : "cursor-pointer"}
                                ${day && !isSelected ? "hover:bg-gray-50 text-gray-900" : ""}
                                ${isSelected ? "bg-yellow-400 text-black shadow-sm font-black" : ""}
                                ${isToday && !isSelected ? "text-yellow-500 font-black border border-yellow-400/20" : ""}
                            `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

        </div>
    );

};

// ─── Create Competition Modal ──────────────────────────────────────────────
const CreateCompetitionModal = ({ isOpen, onClose, type = "live", onSave, editData = null }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        startDate: '',
        endDate: '',
        status: type === 'future' ? 'future' : 'live'
    });
    const [file, setFile] = useState(null);
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);

    // Refs for clicking outside
    const startRef = useRef(null);
    const endRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (startRef.current && !startRef.current.contains(e.target)) setShowStartCalendar(false);
            if (endRef.current && !endRef.current.contains(e.target)) setShowEndCalendar(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setFormData({
                    name: editData.name || '',
                    department: editData.department || '',
                    startDate: editData.startDate ? new Date(editData.startDate).toISOString().split('T')[0] : '',
                    endDate: editData.endDate ? new Date(editData.endDate).toISOString().split('T')[0] : '',
                    status: editData.status || 'live'
                });
            } else {
                setFormData({
                    name: '',
                    department: '',
                    startDate: '',
                    endDate: '',
                    status: 'live'
                });
            }
            setFile(null);
        }
    }, [isOpen, editData]);

    // Automatic Status Detection
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const start = new Date(formData.startDate + 'T00:00:00');
            const end = new Date(formData.endDate + 'T23:59:59');
            
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            
            let autoStatus = 'live';
            
            if (end < today) {
                autoStatus = 'previous';
            } else {
                const startMonth = start.getMonth();
                const startYear = start.getFullYear();
                
                if (startYear > currentYear || (startYear === currentYear && startMonth > currentMonth)) {
                    autoStatus = 'future';
                } else {
                    autoStatus = 'live';
                }
            }
            
            if (formData.status !== autoStatus) {
                setFormData(prev => ({ ...prev, status: autoStatus }));
            }
        }
    }, [formData.startDate, formData.endDate, formData.status]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!formData.name || !formData.department || !formData.startDate || !formData.endDate) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('department', formData.department);
            data.append('startDate', formData.startDate);
            data.append('endDate', formData.endDate);
            data.append('status', formData.status);
            if (file) {
                data.append('question', file);
            }

            await onSave(data, editData?._id);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isFuture = type === "future";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto transition-all duration-300" onClick={onClose}>
            <div
                className="bg-white w-[555px] rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] pt-[50px] px-[30px] pb-[60px] relative border border-gray-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-all hover:rotate-90 p-1"
                >
                    <X size={18} />
                </button>

                <h2 className="text-3xl font-black text-center mb-12 text-gray-900 tracking-tight">
                    {editData ? "Edit Competition" : (isFuture ? "Create future Competition" : "Create Competition")}
                </h2>

                <div className="flex flex-col gap-[32px]">
                    {/* Row 1: Name & Department */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">Competition name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter competition name"
                                className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 focus:border-yellow-400 focus:outline-none bg-gray-50/50 transition-all text-sm text-gray-700 font-medium placeholder:text-gray-400 shadow-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">Competition Department</label>
                            <div className="relative group">
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 focus:border-yellow-400 focus:outline-none bg-gray-50/50 transition-all text-sm text-gray-700 font-medium appearance-none shadow-sm cursor-pointer"
                                >
                                    <option value="" disabled>Select department</option>
                                    <option value="UI UX Designer">UI UX Designer</option>
                                    <option value="Graphic Designer">Graphic Designer</option>
                                    <option value="MERN Stack">MERN Stack</option>
                                    <option value="HR Department">HR Department</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Dates */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 ml-1">Competition date</label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Start Date */}
                            <div className="relative" ref={startRef}>
                                <div
                                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                                    className={`
                                        w-full px-5 py-3.5 rounded-xl border-2 bg-gray-50/50 transition-all font-medium text-sm text-gray-700 shadow-sm flex items-center justify-between cursor-pointer
                                        ${showStartCalendar ? "border-yellow-400" : "border-gray-100 hover:border-gray-200"}
                                    `}
                                >
                                    <span className={formData.startDate ? "text-gray-900" : "text-gray-400"}>
                                        {formData.startDate ? (() => { const [y,m,d] = formData.startDate.split('-'); return `${d}/${m}/${y}`; })() : "Start date"}
                                    </span>
                                    <Calendar className="text-gray-400" size={18} />
                                </div>
                                {showStartCalendar && (
                                    <CustomCalendarPopup
                                        value={formData.startDate}
                                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                                        onClose={() => setShowStartCalendar(false)}
                                    />
                                )}
                            </div>

                            {/* End Date */}
                            <div className="relative" ref={endRef}>
                                <div
                                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                                    className={`
                                        w-full px-5 py-3.5 rounded-xl border-2 bg-gray-50/50 transition-all font-medium text-sm text-gray-700 shadow-sm flex items-center justify-between cursor-pointer
                                        ${showEndCalendar ? "border-yellow-400" : "border-gray-100 hover:border-gray-200"}
                                    `}
                                >
                                    <span className={formData.endDate ? "text-gray-900" : "text-gray-400"}>
                                        {formData.endDate ? (() => { const [y,m,d] = formData.endDate.split('-'); return `${d}/${m}/${y}`; })() : "End date"}
                                    </span>
                                    <Calendar className="text-gray-400" size={18} />
                                </div>
                                {showEndCalendar && (
                                    <CustomCalendarPopup
                                        value={formData.endDate}
                                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                                        onClose={() => setShowEndCalendar(false)}
                                        position="right-0"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Question */}
                    {!isFuture && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">Competition Question</label>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer flex-1">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <div className="flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-yellow-400 rounded-xl bg-white hover:bg-yellow-50 transition-all font-bold text-sm text-gray-900 shadow-sm group">
                                        <span>{file ? "Change File" : "Upload competition question (PDF/Image)"}</span>
                                        <Upload size={18} className="text-yellow-500 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                </label>
                                {file && <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]" title={file.name}>{file.name}</span>}
                            </div>
                        </div>
                    )}



                    <div className="flex gap-4 pt-12">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 h-[48px] bg-gradient-to-r from-[#FFB300] via-[#FFCA28] to-[#FFD54F] hover:shadow-lg text-white font-black rounded-xl transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-widest uppercase text-sm shadow-md border-b-2 border-yellow-600/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Save"}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 h-[48px] bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-400 font-bold rounded-xl transition-all active:scale-95 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main AdminCompetition Section ──────────────────────────────────────────
const AdminCompetition = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "live", editData: null });
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // File upload for individual rows
    const fileInputRef = useRef(null);
    const [uploadingId, setUploadingId] = useState(null);

    // Filter State
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("All");

    const filterOptions = [
        "All",
        "Graphic Design",
        "UI UX Design",
        "Video editing",
        "MERN Stack developer",
        "H R Department"
    ];

    const filterRef = useRef(null);

    useEffect(() => {
        fetchCompetitions();
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const fetchCompetitions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/competitions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCompetitions(res.data.competitions);
            }
        } catch (error) {
            console.error("Error fetching competitions:", error);
            toast.error("Failed to load competitions");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData, id = null) => {
        try {
            const token = localStorage.getItem('token');
            let res;

            if (id) {
                // Update
                res = await axios.put(`${API_URL}/api/competitions/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Create
                res = await axios.post(`${API_URL}/api/competitions`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (res.data.success) {
                toast.success(`Competition ${id ? "updated" : "created"} successfully!`);
                fetchCompetitions();
            }
        } catch (error) {
            console.error("Error saving competition:", error);
            toast.error(error.response?.data?.message || "Failed to save competition");
            throw error;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this competition?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${API_URL}/api/competitions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                toast.success("Competition deleted");
                fetchCompetitions();
            }
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete competition");
        }
    };

    const handleGoLive = async (comp) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/api/competitions/${comp._id}`, { status: 'live' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                toast.success(`${comp.name} is now LIVE!`);
                fetchCompetitions();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleRowFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !uploadingId) return;

        const loadingToast = toast.loading("Uploading question file...");
        try {
            const formData = new FormData();
            formData.append('question', file);

            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/api/competitions/${uploadingId}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                toast.success("Question uploaded successfully!", { id: loadingToast });
                fetchCompetitions();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload file", { id: loadingToast });
        } finally {
            setUploadingId(null);
            e.target.value = ''; // Reset input
        }
    };

    const triggerFileUpload = (id) => {
        setUploadingId(id);
        fileInputRef.current.click();
    };

    const openModal = (type) => setModalConfig({ isOpen: true, type, editData: null });
    const openEditModal = (comp) => setModalConfig({ isOpen: true, type: comp.status, editData: comp });
    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const filteredCompetitions = competitions.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDepartment === "All" ||
            c.department.toLowerCase().includes(selectedDepartment.toLowerCase().replace(" developer", ""));
        return matchesSearch && matchesDept;
    });


    const sortedCompetitions = [...filteredCompetitions].sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const previousCompetitions = sortedCompetitions.filter(c => new Date(c.endDate) < today);
    
    const liveCompetitions = sortedCompetitions.filter(c => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        if (end < today) return false;
        // Include if started this month OR started earlier but still running
        const startYear = start.getFullYear();
        const startMonth = start.getMonth();
        return (startYear < currentYear) || (startYear === currentYear && startMonth <= currentMonth);
    });

    const futureCompetitions = sortedCompetitions.filter(c => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        if (end < today) return false;
        // Include if starting after the current month
        const startYear = start.getFullYear();
        const startMonth = start.getMonth();
        return (startYear > currentYear) || (startYear === currentYear && startMonth > currentMonth);
    });

    const CompTable = ({ title, data, showActions = true, onAdd, onFileAdd }) => (
        <div className="mb-10">
            <h3 className="text-xl font-bold mb-6 text-gray-900">{title}</h3>
            
            <div className="bg-white rounded-2xl border-2 border-yellow-400/30 shadow-[0_4px_20px_-4px_rgba(255,179,0,0.1)] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-fixed border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-6 px-4 w-1/4 text-[11px] font-black text-gray-400 uppercase tracking-widest pl-8">Competition name</th>
                                <th className="py-6 px-4 w-1/4 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">Competition Department</th>
                                <th className="py-6 px-4 w-[12%] text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">Start date</th>
                                <th className="py-6 px-4 w-[12%] text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">End date</th>
                                <th className="py-6 px-4 w-[8%] text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">Question</th>
                                {showActions && <th className="py-6 px-4 w-[18%] text-right text-[11px] font-black text-gray-400 uppercase tracking-widest pr-8">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.length === 0 ? (
                                <tr><td colSpan={showActions ? 6 : 5} className="py-8 text-center text-gray-400 text-sm">No competitions found here</td></tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 px-4 pl-8 text-sm font-medium text-gray-700 w-1/4 truncate" title={item.name}>{item.name}</td>
                                        <td className="py-5 px-4 text-sm text-gray-600 w-1/4 text-center truncate" title={item.department}>{item.department}</td>
                                        <td className="py-5 px-4 text-sm text-gray-600 w-[12%] text-center">
                                            {new Date(item.startDate).toLocaleDateString('en-GB').replace(/\//g, ' - ')}
                                        </td>
                                        <td className="py-5 px-4 text-sm text-gray-600 w-[12%] text-center">
                                            {new Date(item.endDate).toLocaleDateString('en-GB').replace(/\//g, ' - ')}
                                        </td>
                                        <td className="py-5 px-4 text-sm text-gray-600 w-[8%] text-center">
                                            {item.questionUrl ? (
                                                <div className="flex justify-center">
                                                    <a
                                                        href={item.questionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition border border-red-100 shadow-sm"
                                                    >
                                                        <FileText size={18} />
                                                    </a>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => onFileAdd ? onFileAdd(item._id) : (onAdd ? onAdd() : openEditModal(item))}
                                                    className="text-yellow-600 hover:text-yellow-700 font-bold text-sm flex items-center justify-center gap-1 w-full"
                                                >
                                                    Add <Plus size={16} />
                                                </button>
                                            )}
                                        </td>
                                        {showActions && (
                                            <td className="py-5 px-4 pr-8 text-right w-[18%]">
                                                <div className="flex justify-end items-center gap-3">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2 bg-yellow-400 rounded-lg text-black hover:bg-yellow-500 transition shadow-sm hover:shadow-md"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition shadow-sm hover:shadow-md border border-red-200"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    {(item.status === 'live' || item.status === 'future') && (
                                                        <button
                                                            onClick={() => handleGoLive(item)}
                                                            className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-full text-[10px] font-black hover:bg-red-50 transition-all whitespace-nowrap flex items-center gap-2 uppercase tracking-widest shadow-sm"
                                                        >
                                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                                                            Go Live
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto relative">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,image/*" 
                onChange={handleRowFileUpload} 
            />
            <CreateCompetitionModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                type={modalConfig.type}
                onSave={handleSave}
                editData={modalConfig.editData}
            />

            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Ad competition</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => openModal("live")}
                        className="bg-white border-2 border-gray-200 hover:border-yellow-400 text-gray-800 px-6 py-3 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 group"
                    >
                        <span>Create Competition</span>
                        <Plus size={20} className="text-yellow-500 group-hover:scale-125 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-10 gap-6 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                    <input
                        type="text"
                        placeholder="Search with competition name"
                        className="w-full pl-14 pr-6 py-4 rounded-xl focus:outline-none bg-transparent font-medium placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all font-bold shadow-sm whitespace-nowrap ${showFilterDropdown ? "bg-yellow-400 text-black shadow-md border-yellow-400" : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"}`}
                    >
                        {selectedDepartment === "All" ? "Filter" : selectedDepartment} <ChevronDown size={20} className={showFilterDropdown ? "text-black" : "text-gray-400"} />
                    </button>

                    {showFilterDropdown && (
                        <div className="absolute top-[110%] right-0 z-[110] bg-white w-64 rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {filterOptions.map((opt, i) => (
                                <div
                                    key={opt}
                                    onClick={() => {
                                        setSelectedDepartment(opt);
                                        setShowFilterDropdown(false);
                                    }}
                                    className={`px-6 py-4 text-sm font-medium transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${selectedDepartment === opt ? "bg-yellow-50 text-yellow-600" : "text-gray-700 hover:bg-gray-50 hover:text-black"}`}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-yellow-400" size={48} />
                    <p className="text-gray-400 font-bold animate-pulse">Loading competitions...</p>
                </div>
            ) : (
                <div className="space-y-4 px-2">
                    <CompTable 
                        title="Live competitions" 
                        data={liveCompetitions} 
                        onFileAdd={triggerFileUpload}
                    />
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-10"></div>
                    <CompTable 
                        title="Future competitions" 
                        data={futureCompetitions} 
                        onFileAdd={triggerFileUpload}
                    />
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-10"></div>
                    <CompTable title="Previous competitions" data={previousCompetitions} showActions={false} />
                </div>
            )}
        </div>
    );
};

export default AdminCompetition;
