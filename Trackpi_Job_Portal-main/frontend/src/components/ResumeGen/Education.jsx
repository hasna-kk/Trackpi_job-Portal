import React, { useState } from 'react';
import { useResume } from './ResumeContext';
import { Plus, Trash2 } from 'lucide-react';

const Education = () => {
    const { resumeData, setResumeData } = useResume();
    const { education } = resumeData;

    const [isAdding, setIsAdding] = useState(false);

    // Local state for the new entry being added form
    const [newEdu, setNewEdu] = useState({
        school: '',
        degree: '',
        year: '',
        gpa: '', // Added GPA field based on the design
        description: '' // Added description based on design
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEdu({ ...newEdu, [name]: value });
    };

    const handleAdd = () => {
        if (!newEdu.school || !newEdu.degree) return;
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { ...newEdu, id: Date.now() }]
        }));
        setNewEdu({ school: '', degree: '', year: '', gpa: '', description: '' });
    };

    const handleRemove = (id) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800">Education</h3>

            {/* List of added education */}
            <div className="space-y-4">
                {education.map((edu) => (
                    <div key={edu.id} className="p-4 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-start group">
                        <div>
                            <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.school} • {edu.year}</p>
                            {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                        </div>
                        <button
                            onClick={() => handleRemove(edu.id)}
                            className="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add New Education Form */}
            {isAdding ? (
                <div className="bg-white p-6 border border-gray-300 rounded-2xl space-y-6 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-bold text-gray-800">Add Education Details</h4>
                        <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1">School / University</label>
                        <input
                            type="text"
                            name="school"
                            value={newEdu.school}
                            onChange={handleChange}
                            placeholder="e.g. Oxford University"
                            className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">Degree</label>
                            <input
                                type="text"
                                name="degree"
                                value={newEdu.degree}
                                onChange={handleChange}
                                placeholder="e.g. BSc Computer Science"
                                className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Year</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={newEdu.year}
                                    onChange={handleChange}
                                    placeholder="2020-2024"
                                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-semibold text-gray-900 mb-1">GPA</label>
                                <input
                                    type="text"
                                    name="gpa"
                                    value={newEdu.gpa}
                                    onChange={handleChange}
                                    placeholder="GPA"
                                    className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={newEdu.description}
                            onChange={handleChange}
                            placeholder="Relevant Coursework, Honors, etc."
                            rows="3"
                            className="w-full border-b border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition resize-none"
                        />
                    </div>

                    <button
                        onClick={() => { handleAdd(); setIsAdding(false); }}
                        disabled={!newEdu.school || !newEdu.degree}
                        className="w-full py-3 mt-4 bg-[#FFB300] hover:bg-[#faa300] text-gray-900 font-bold rounded-xl transition disabled:opacity-50"
                    >
                        Save Education
                    </button>
                </div>
            ) : (
                <div className="border hover:border-gray-500 transition border-gray-400 rounded-2xl h-48 flex flex-col items-center justify-center bg-white shadow-sm">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition border border-gray-300 shadow-sm"
                    >
                        Add more Education +
                    </button>
                </div>
            )}
        </div>
    );
};

export default Education;
