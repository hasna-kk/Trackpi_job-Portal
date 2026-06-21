import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

const FormDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/api/contact/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormData(response.data);
            } catch (err) {
                console.error("Error fetching form details:", err);
                setError("Failed to load form details.");
            } finally {
                setLoading(false);
            }
        };

        fetchFormDetails();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!formData) return <div className="p-8 text-center text-gray-500">Form not found.</div>;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-GB"); // DD/MM/YYYY
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="p-8 bg-white min-h-screen font-sans">
            <h2 className="text-2xl font-bold text-black mb-2">Form management</h2>

            <div className="mb-8">
                <span className="text-[#FFB300] font-bold text-xl block">{formatDate(formData.createdAt)}</span>
                <span className="text-[#FFB300] font-medium text-sm">{formatTime(formData.createdAt)}</span>
            </div>



            {/* Re-structuring grid to match image specifically: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-6xl mt-6">

                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-1">Full name</label>
                        <div className="w-full p-3 rounded-lg border border-gray-700 text-gray-900">
                            {formData.name}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-1">Email</label>
                        <div className="w-full p-3 rounded-lg border border-gray-700 text-gray-900">
                            {formData.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-1">How do you here about us?</label>
                        <div className="w-full p-3 rounded-lg border border-gray-700 text-gray-900">
                            {formData.hearAboutUs || "N/A"}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-1">Phone number</label>
                        <div className="w-full p-3 rounded-lg border border-gray-700 text-gray-900">
                            {formData.phone ? `+91 ${formData.phone}` : "N/A"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-1">Location</label>
                        <div className="w-full p-3 rounded-lg border border-gray-700 text-gray-900">
                            {formData.location || "N/A"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-800 text-sm font-medium mb-1">Message</label>
                        <div className="w-full p-3 rounded-lg border border-gray-700 text-gray-900 min-h-[120px]">
                            {formData.message}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetails;
