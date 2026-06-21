import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { toast } from "react-hot-toast";

const EditSkillsModal = ({ isOpen, onClose, currentSkills, onSave }) => {
    const [skills, setSkills] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Normalize skills to objects
        const normalized = (currentSkills || []).map(skill => {
            if (typeof skill === 'string') return { name: skill, isStarred: false };
            return { name: skill.name, isStarred: !!skill.isStarred };
        });
        setSkills(normalized);
        setInputValue(""); 
    }, [currentSkills, isOpen]);

    // Debounce Search for Skills
    useEffect(() => {
        const fetchSkills = async () => {
            if (inputValue.length < 1) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await axios.get(`${config.API_URL}/api/skills/search?query=${inputValue}`);
                // Filter out already selected skills
                const availableSkills = res.data.filter(suggestedName => 
                    !skills.some(s => s.name.toLowerCase() === suggestedName.toLowerCase())
                );
                setSuggestions(availableSkills);
            } catch (err) {
                console.error("Failed to fetch skills", err);
            }
        };

        const timeoutId = setTimeout(fetchSkills, 300);
        return () => clearTimeout(timeoutId);
    }, [inputValue, skills]);

    const addSkill = (skillName) => {
        if (!/[a-zA-Z]/.test(skillName)) {
            setError("Skill must contain valid text.");
            return;
        }

        if (!skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
            setSkills([...skills, { name: skillName, isStarred: false }]);
        }
        setInputValue("");
        setSuggestions([]);
        setError(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addSkill(inputValue.trim());
        }
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const toggleStar = (index) => {
        const isCurrentlyStarred = skills[index].isStarred;
        const starredCount = skills.filter(s => s.isStarred).length;

        if (!isCurrentlyStarred && starredCount >= 4) {
            toast.error("Maximum 4 skills can be starred.");
            return;
        }

        const updated = [...skills];
        updated[index] = { ...updated[index], isStarred: !isCurrentlyStarred };
        setSkills(updated);
        setError(null);
    };

    const handleSave = () => {
        let finalSkills = [...skills];
        const trimmedInput = inputValue.trim();
        if (trimmedInput && !/\d/.test(trimmedInput) && !skills.find(s => s.name.toLowerCase() === trimmedInput.toLowerCase())) {
            finalSkills.push({ name: trimmedInput, isStarred: false });
        }
        onSave(finalSkills);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-10 relative" onClick={(e) => e.stopPropagation()}>

                <h2 className="text-2xl font-bold mb-8 text-black">Manage Skills</h2>

                <div className="mb-10">
                    <label className="block text-sm font-bold text-black mb-3 text-gray-500">Skills (Select up to 4 to highlight on profile)</label>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="border border-[#FFB300] px-4 py-2 rounded-lg bg-white text-gray-800 text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
                                <span 
                                    onClick={() => toggleStar(idx)}
                                    className={`cursor-pointer text-lg leading-none transition-colors ${skill.isStarred ? 'text-[#FFB300]' : 'text-gray-300 hover:text-yellow-400'}`}
                                    title={skill.isStarred ? "Unstar skill" : "Star skill"}
                                >
                                    ★
                                </span>
                                {skill.name}
                                <span
                                    onClick={() => removeSkill(idx)}
                                    className="cursor-pointer ml-1 hover:text-red-500 text-lg leading-none text-gray-400"
                                >
                                    ×
                                </span>
                            </span>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="border-b border-gray-400 pb-1">
                            <input
                                value={inputValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setInputValue(val);
                                    if (/\d/.test(val)) {
                                        setError("Skills cannot contain numbers.");
                                    } else {
                                        setError(null);
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                className={`w-full bg-transparent py-2 outline-none text-sm placeholder-gray-500 ${error ? 'text-red-500' : 'text-black'}`}
                                placeholder="Type a skill..."
                                autoComplete="off"
                            />
                        </div>
                        
                        {/* Auto-suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[60] max-h-[220px] overflow-y-auto">
                                {suggestions.map((suggestedSkill, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => addSkill(suggestedSkill)}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 border-b border-gray-50 last:border-0 flex items-center justify-between group transition-colors"
                                    >
                                        <span>{suggestedSkill}</span>
                                        <i className="ri-add-line text-lg text-[#FFB300] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {error && <p className="text-[#FF0000] text-xs mt-1">{error}</p>}
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={handleSave}
                        className="bg-gradient-to-b from-[#FFE587] to-[#FFB300] text-black font-bold py-3 px-12 rounded-lg shadow-sm hover:shadow-md transition w-40 border border-[#FFB300]/50"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white border border-gray-400 text-black font-bold py-3 px-12 rounded-lg hover:bg-gray-50 transition w-40"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSkillsModal;
