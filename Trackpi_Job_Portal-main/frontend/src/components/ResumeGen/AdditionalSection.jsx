import React, { useState } from 'react';
import { useResume } from './ResumeContext';
import { Trash2 } from 'lucide-react';

const AdditionalSection = () => {
    const { resumeData, setResumeData } = useResume();
    const { additional = {} } = resumeData;
    const { projects = [], languages = [], awards = [], interests = [] } = additional;

    const [isAddingProject, setIsAddingProject] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });
    const [newItems, setNewItems] = useState({ languages: '', awards: '', interests: '' });

    const handleAddProject = () => {
        if (!newProject.title) return;
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                projects: [...(prev.additional.projects || []), { ...newProject, id: Date.now() }]
            }
        }));
        setNewProject({ title: '', description: '', link: '' });
        setIsAddingProject(false);
    };

    const handleAddItem = (e, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!newItems[type].trim()) return;
            setResumeData(prev => ({
                ...prev,
                additional: {
                    ...prev.additional,
                    [type]: [...(prev.additional[type] || []), newItems[type].trim()]
                }
            }));
            setNewItems({ ...newItems, [type]: '' });
        }
    };

    const handleRemoveProject = (id) => {
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                projects: prev.additional.projects.filter(p => p.id !== id)
            }
        }));
    };

    const handleRemoveItem = (type, index) => {
        setResumeData(prev => ({
            ...prev,
            additional: {
                ...prev.additional,
                [type]: prev.additional[type].filter((_, i) => i !== index)
            }
        }));
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-10">

            {/* Projects Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Projects (Title, Description, Link)</label>

                {projects.length > 0 && (
                    <div className="space-y-3 mb-2">
                        {projects.map(proj => (
                            <div key={proj.id} className="p-3 bg-gray-50 border border-gray-200 rounded-sm flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-gray-800 text-sm">{proj.title}</div>
                                    <div className="text-xs text-gray-600 truncate max-w-sm">{proj.description}</div>
                                </div>
                                <button onClick={() => handleRemoveProject(proj.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                )}

                {!isAddingProject ? (
                    <button
                        onClick={() => setIsAddingProject(true)}
                        className="w-full text-left border border-gray-400 text-gray-400 p-3 rounded-sm transition hover:border-[#FFB300] hover:text-gray-500 bg-white"
                    >
                        Add your projects
                    </button>
                ) : (
                    <div className="space-y-3 border border-gray-300 p-4 rounded-sm bg-white shadow-sm mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-bold text-gray-800">New Project</h4>
                            <button onClick={() => setIsAddingProject(false)} className="text-gray-500 hover:text-gray-800 font-bold">&times;</button>
                        </div>
                        <input type="text" placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className="w-full border-b border-gray-300 outline-none focus:border-[#FFB300] py-2" />
                        <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} className="w-full border-b border-gray-300 outline-none focus:border-[#FFB300] py-2 resize-none" rows="2" />
                        <input type="text" placeholder="Link (Optional)" value={newProject.link} onChange={e => setNewProject({ ...newProject, link: e.target.value })} className="w-full border-b border-gray-300 outline-none focus:border-[#FFB300] py-2" />
                        <button onClick={handleAddProject} disabled={!newProject.title} className="w-full bg-[#FFB300] text-gray-900 font-bold py-2 rounded-sm hover:opacity-90 disabled:opacity-50 mt-2">Save Project</button>
                    </div>
                )}
            </div>

            {/* Language Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Language</label>
                <div className="flex gap-2 flex-wrap mb-2">
                    {languages.map((lang, idx) => (
                        <span key={idx} className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-sm text-sm font-medium flex items-center gap-2">
                            {lang} <button onClick={() => handleRemoveItem('languages', idx)} className="text-gray-400 hover:text-red-500">&times;</button>
                        </span>
                    ))}
                </div>
                <div className="relative">
                    <input type="text" placeholder="Choose language (press enter to add)"
                        value={newItems.languages}
                        onChange={e => setNewItems({ ...newItems, languages: e.target.value })}
                        onKeyDown={e => handleAddItem(e, 'languages')}
                        className="w-full border border-gray-400 p-3 rounded-sm outline-none focus:border-[#FFB300] placeholder-gray-400"
                    />
                    <div className="absolute right-3 top-3 pointer-events-none text-gray-800 font-bold">▾</div>
                </div>
            </div>

            {/* Awards Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Awards and Achievements</label>
                <div className="space-y-2 mb-2">
                    {awards.map((award, idx) => (
                        <div key={idx} className="bg-[#F3F2EA] px-3 py-2 rounded-sm border border-gray-200 text-sm font-medium flex justify-between items-center text-gray-800">
                            {award}
                            <button onClick={() => handleRemoveItem('awards', idx)} className="text-gray-400 hover:text-red-500 font-bold">&times;</button>
                        </div>
                    ))}
                </div>
                <input type="text" placeholder="Add awards and achievements"
                    value={newItems.awards}
                    onChange={e => setNewItems({ ...newItems, awards: e.target.value })}
                    onKeyDown={e => handleAddItem(e, 'awards')}
                    className="w-full border border-gray-400 bg-[#F3F2EA] p-3 rounded-sm outline-none focus:border-[#FFB300] placeholder-gray-400"
                />
            </div>

            {/* Interest Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Interest (optional)</label>
                <div className="flex gap-2 flex-wrap mb-2">
                    {interests.map((interest, idx) => (
                        <span key={idx} className="bg-[#F3F2EA] border border-gray-200 px-3 py-1 rounded-sm text-sm font-medium flex items-center gap-2">
                            {interest} <button onClick={() => handleRemoveItem('interests', idx)} className="text-gray-400 hover:text-red-500">&times;</button>
                        </span>
                    ))}
                </div>
                <input type="text" placeholder="Type here......"
                    value={newItems.interests}
                    onChange={e => setNewItems({ ...newItems, interests: e.target.value })}
                    onKeyDown={e => handleAddItem(e, 'interests')}
                    className="w-full border border-gray-400 bg-[#F3F2EA] p-3 rounded-sm outline-none focus:border-[#FFB300] placeholder-gray-400"
                />
            </div>

        </div>
    );
};

export default AdditionalSection;
