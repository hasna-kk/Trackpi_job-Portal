import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const HiringPartnerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);
    const [partner, setPartner] = useState(null);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/admin/hiringpartners/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const json = await res.json();
                if (!res.ok) throw new Error();

                setPartner(json.data);
            } catch {
                toast.error("Failed to load hiring partner details");
            } finally {
                setLoading(false);
            }
        };

        fetchPartner();
    }, [id, token]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!partner) return null;

    /* ================= UI ================= */
    return (
        <div className="p-8 bg-white">
            <h1 className="text-2xl font-bold mb-6">Hiring Partner Details</h1>

            {/* ORGANIZATION NAME */}
            <div className="mb-6">
                <label className="block text-sm mb-1 text-gray-500 font-medium">Organization Name</label>
                <div className="border-b py-2 text-lg font-semibold">{partner.organizationname}</div>
            </div>

            {/* EMAIL */}
            <div className="mb-6">
                <label className="block text-sm mb-1 text-gray-500 font-medium">Email</label>
                <div className="border-b py-2 text-lg">{partner.email}</div>
            </div>

            {/* ABOUT COMPANY */}
            <div className="mb-8">
                <label className="block text-sm mb-2 text-gray-500 font-medium">About Company</label>
                <div className="border rounded-lg p-4 text-gray-700 bg-gray-50 h-32 overflow-y-auto">
                    {partner.aboutcompany}
                </div>
            </div>

            {/* LOGO */}
            <div className="mb-8 pl-1">
                <label className="block text-sm mb-2 font-medium text-gray-500">Company Logo</label>
                <div className="relative rounded-2xl overflow-hidden w-64 h-56 bg-gray-100 border border-gray-300">
                    {partner.logo?.url ? (
                        <img
                            src={partner.logo.url}
                            alt={partner.organizationname}
                            className="w-full h-full object-contain p-4"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No Logo Available
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end pt-8 gap-4">
                <button
                    onClick={() => navigate("/admin/partners")}
                    className="px-8 py-3 rounded-lg border font-medium hover:bg-gray-100 transition-colors"
                >
                    Back to List
                </button>
                <button
                    onClick={() =>
                        navigate(`/admin/partners/edit/${partner._id}`)
                    }
                    className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors shadow-sm"
                >
                    Edit Partner
                </button>
            </div>
        </div>
    );
};

export default HiringPartnerDetails;
