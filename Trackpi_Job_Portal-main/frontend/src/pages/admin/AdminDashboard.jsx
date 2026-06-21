import { useState, useEffect } from "react";
import { Users, Briefcase, FileText, CheckCircle } from "lucide-react";
import { API_URL } from "../../config";

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState({
        candidates: 0,
        activeJobs: 0,
        resumes: 0,
        totalPending: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/api/admin/dashboard-stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStatsData({
                        candidates: data.candidates || 0,
                        activeJobs: data.activeJobs || 0,
                        resumes: data.resumes || 0,
                        totalPending: data.totalPending || 0
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { title: "Total Candidates", count: statsData.candidates, icon: Users, color: "bg-blue-500" },
        { title: "Active Jobs", count: statsData.activeJobs, icon: Briefcase, color: "bg-green-500" },
        { title: "Resumes Built", count: statsData.resumes, icon: FileText, color: "bg-purple-500" },
        { title: "Pending Applicants", count: statsData.totalPending, icon: Users, color: "bg-red-500" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.count}</h3>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color} text-white bg-opacity-90`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section Placeholder */}
            {/* Recent Activity Section Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center text-gray-400">
                <p>Recent Activity will be displayed here</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
