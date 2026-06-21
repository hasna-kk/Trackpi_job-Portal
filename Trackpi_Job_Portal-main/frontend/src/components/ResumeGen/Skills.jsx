import React, { useState } from 'react';
import { useResume } from './ResumeContext';
import { Plus, Trash2 } from 'lucide-react';

const Skills = () => {
    const { resumeData, setResumeData } = useResume();
    const { skills } = resumeData;
    const { hard = [], soft = [], other = [] } = skills; // Fallback defaults

    const [newSkills, setNewSkills] = useState({ hard: '', soft: '', other: '' });

    const handleAdd = (type) => {
        if (!newSkills[type].trim()) return;
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: [...(prev.skills[type] || []), newSkills[type].trim()]
            }
        }));
        setNewSkills({ ...newSkills, [type]: '' });
    };

    const handleKeyDown = (e, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd(type);
        }
    };

    const handleRemove = (type, index) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: prev.skills[type].filter((_, i) => i !== index)
            }
        }));
    };

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* Hard Skills Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Hard skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {hard.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-sm text-sm font-medium flex items-center gap-2">
                            {skill}
                            <button onClick={() => handleRemove('hard', index)} className="text-gray-400 hover:text-red-500">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newSkills.hard}
                        onChange={(e) => setNewSkills({ ...newSkills, hard: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, 'hard')}
                        placeholder="Add your hard skills"
                        className="flex-1 border p-3 rounded-r-sm rounded-l-sm border-gray-400 focus:border-[#FFB300] outline-none transition"
                    />
                </div>
            </div>

            {/* Soft Skills Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Soft skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {soft.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-sm text-sm font-medium flex items-center gap-2">
                            {skill}
                            <button onClick={() => handleRemove('soft', index)} className="text-gray-400 hover:text-red-500">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newSkills.soft}
                        onChange={(e) => setNewSkills({ ...newSkills, soft: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, 'soft')}
                        placeholder="Add your soft skills"
                        className="flex-1 border p-3 rounded-r-sm rounded-l-sm border-gray-400 focus:border-[#FFB300] outline-none transition"
                    />
                </div>
            </div>

            {/* Other Skills Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Other skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {other.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-sm text-sm font-medium flex items-center gap-2">
                            {skill}
                            <button onClick={() => handleRemove('other', index)} className="text-gray-400 hover:text-red-500">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newSkills.other}
                        onChange={(e) => setNewSkills({ ...newSkills, other: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, 'other')}
                        placeholder="Add your other skills"
                        className="flex-1 border p-3 rounded-r-sm rounded-l-sm border-gray-400 focus:border-[#FFB300] outline-none transition bg-[#F3F2EA]"
                    />
                </div>
            </div>

        </div>
    );
};

export default Skills;
