import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AdminSettings = () => {
    const [webhookUrl, setWebhookUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    const whatsappSetting = data.find(s => s.key === "whatsapp_webhook_url");
                    if (whatsappSetting) {
                        setWebhookUrl(whatsappSetting.value);
                    }
                }
            } catch (error) {
                toast.error("Failed to fetch settings");
            } finally {
                setFetching(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/settings/whatsapp_webhook_url`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ value: webhookUrl })
            });

            if (res.ok) {
                toast.success("Webhook URL updated successfully");
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to update webhook URL");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">System Settings</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp Webhook URL (OTP Verification)
                    </label>
                    <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://bot.wabis.in/webhook/..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 text-gray-800"
                        required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        This URL is used to send OTP via WhatsApp. Make sure it expects `number`, `otp`, `type`, and `message` in the payload.
                    </p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
