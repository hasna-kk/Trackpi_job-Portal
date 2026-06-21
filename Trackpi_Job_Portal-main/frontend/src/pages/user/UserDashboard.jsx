import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your job applications, profile, and resume here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div onClick={() => navigate('/profile')} className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2 text-blue-600">My Profile</h3>
                        <p className="text-sm text-gray-500">Update your personal information and resume.</p>
                    </div>

                    {/* Jobs Card */}
                    <div onClick={() => navigate('/browse-jobs')} className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2 text-green-600">Find Jobs</h3>
                        <p className="text-sm text-gray-500">Browse and apply for the latest opportunities.</p>
                    </div>

                    {/* Resume Gen Card */}
                    <div onClick={() => navigate('/resume-gen')} className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2 text-purple-600">Resume Builder</h3>
                        <p className="text-sm text-gray-500">Create a professional resume in minutes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
