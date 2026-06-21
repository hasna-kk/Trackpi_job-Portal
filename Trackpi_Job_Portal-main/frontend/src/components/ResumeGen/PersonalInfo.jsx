import React from 'react';
import { useResume } from './ResumeContext';

const PersonalInfo = () => {
    const { resumeData, updatePersonalInfo } = useResume();
    const { personalInfo } = resumeData;

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Only allow alphabets and spaces for full name
        if (name === 'fullName') {
            if (value && !/^[A-Za-z\s]*$/.test(value)) return;
        }

        // Only allow numbers for phone
        if (name === 'phone') {
            if (value && !/^\d*$/.test(value)) return;
        }

        updatePersonalInfo({ [name]: value });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800">Personal Info</h3>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={personalInfo.fullName || ''}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Phone <span className="text-[#FFB300] font-normal text-xs">( Whats App connecting number )</span>
                </label>
                <div className="flex border-b border-gray-300 focus-within:border-[#FFB300] transition items-center">
                    <select className="bg-transparent text-gray-600 outline-none py-2 text-sm cursor-pointer appearance-none pr-4 relative">
                        <option value="+91">+91 ▾</option>
                    </select>
                    <input
                        type="text"
                        name="phone"
                        value={personalInfo.phone || ''}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full outline-none py-2 bg-transparent ml-2"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={personalInfo.email || ''}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Home town</label>
                <input
                    type="text"
                    name="address"
                    value={personalInfo.address || ''}
                    onChange={handleChange}
                    placeholder="Enter your location"
                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Professional role</label>
                <input
                    type="text"
                    name="role"
                    value={personalInfo.role || ''}
                    onChange={handleChange}
                    placeholder="Type here..."
                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Profile Summary</label>
                <textarea
                    name="summary"
                    value={personalInfo.summary || ''}
                    onChange={handleChange}
                    placeholder="Type here..."
                    rows="3"
                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition resize-none"
                />
            </div>
        </div>
    );
};

export default PersonalInfo;
