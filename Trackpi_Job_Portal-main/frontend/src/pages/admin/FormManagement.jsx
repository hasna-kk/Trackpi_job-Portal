import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const FormManagement = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/contact/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setForms(response.data);
        } catch (error) {
            console.error("Error fetching forms:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to group forms by date
    const groupFormsByDate = (formsList) => {
        const groups = {};
        formsList.forEach(form => {
            const date = new Date(form.createdAt).toLocaleDateString("en-GB"); // DD/MM/YYYY
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(form);
        });
        return groups;
    };

    const filteredForms = forms.filter(form =>
        form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.phone?.includes(searchQuery)
    );

    const groupedForms = groupFormsByDate(filteredForms);

    // Format time helper
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <h2 className="text-2xl font-bold text-black mb-6">Form management</h2>

            {/* Search Bar */}
            <div className="relative w-full max-w-lg mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search here"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading forms...</div>
            ) : Object.keys(groupedForms).length === 0 ? (
                <div className="text-center py-10 text-gray-500">No form submissions found.</div>
            ) : (
                Object.keys(groupedForms).map(date => (
                    <div key={date} className="mb-8">
                        <h3 className="text-[#FFB300] font-bold text-lg mb-4">{date}</h3>

                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            {/* Header Row - Only show for the first group or if you want it repeated */}
                            {/* Using a consistent table structure for alignment */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                                            <th className="p-4 font-semibold text-gray-900 w-1/5">Name</th>
                                            <th className="p-4 font-semibold text-gray-900 w-1/5">Email ID</th>
                                            <th className="p-4 font-semibold text-gray-900 w-1/6">Phone</th>
                                            <th className="p-4 font-semibold text-gray-900 w-1/6">Hear About Us</th>
                                            <th className="p-4 font-semibold text-gray-900 w-1/6">Time</th>
                                            <th className="p-4 font-semibold text-gray-900 w-1/6">View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedForms[date].map((form) => (
                                            <tr key={form._id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-4 text-gray-800">{form.name}</td>
                                                <td className="p-4 text-gray-800">{form.email}</td>
                                                <td className="p-4 text-gray-800">{form.phone ? `+91 ${form.phone}` : "N/A"}</td>
                                                <td className="p-4 text-gray-800">{form.hearAboutUs || "N/A"}</td>
                                                <td className="p-4 text-gray-800">{formatTime(form.createdAt)}</td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => navigate(`/admin/forms/${form._id}`)}
                                                        className="text-[#FFB300] font-bold text-sm flex items-center gap-1 hover:underline whitespace-nowrap"
                                                    >
                                                        View Details <ExternalLink size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FormManagement;
