import React, { useState } from 'react';
import { useResume } from './ResumeContext';
import { Plus, Trash2 } from 'lucide-react';

const Internship = () => {
    const { resumeData, setResumeData } = useResume();
    const { experience = [] } = resumeData; // Default to empty array

    const [isAdding, setIsAdding] = useState(false);

    const [newExp, setNewExp] = useState({
        role: '',
        company: '',
        duration: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExp({ ...newExp, [name]: value });
    };

    const handleAdd = () => {
        if (!newExp.role || !newExp.company) return;
        setResumeData(prev => ({
            ...prev,
            experience: [...(prev.experience || []), { ...newExp, id: Date.now() }]
        }));
        setNewExp({ role: '', company: '', duration: '', description: '' });
    };

    const handleRemove = (id) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* List of added experience */}
            {experience.length > 0 && (
                <div className="space-y-4 mb-6">
                    {experience.map((exp) => (
                        <div key={exp.id} className="p-4 bg-white border border-gray-200 rounded-lg flex justify-between items-start shadow-sm">
                            <div>
                                <h4 className="font-bold text-gray-800">{exp.role}</h4>
                                <p className="text-sm text-[#FFB300] font-medium">{exp.company}</p>
                                <p className="text-xs text-gray-500">{exp.duration}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(exp.id)}
                                className="text-red-400 hover:text-red-600 p-2 transition"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add New Experience Form */}
            {isAdding ? (
                <div className="bg-white p-6 border border-gray-300 rounded-2xl space-y-6 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-bold text-gray-800">Add Experience Details</h4>
                        <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">Role / Job Title</label>
                            <input
                                type="text"
                                name="role"
                                value={newExp.role}
                                onChange={handleChange}
                                placeholder="e.g. Frontend Intern"
                                className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Company / Organization</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={newExp.company}
                                    onChange={handleChange}
                                    placeholder="e.g. Google"
                                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={newExp.duration}
                                    onChange={handleChange}
                                    placeholder="Jan 2024 - Present"
                                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={newExp.description}
                                onChange={handleChange}
                                placeholder="Describe your responsibilities and achievements..."
                                rows="3"
                                className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition resize-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => { handleAdd(); setIsAdding(false); }}
                        disabled={!newExp.role || !newExp.company}
                        className="w-full py-3 mt-4 bg-[#FFB300] hover:bg-[#faa300] text-gray-900 font-bold rounded-xl transition disabled:opacity-50"
                    >
                        Save Experience
                    </button>
                </div>
            ) : (
                <div className="border border-gray-400 hover:border-gray-500 transition rounded-2xl h-48 flex flex-col items-center justify-center bg-white shadow-sm">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition border border-gray-300 shadow-sm"
                    >
                        Add more Experience +
                    </button>
                </div>
            )}
        </div>
    );
};

export default Internship;
