import React from 'react';
import { useResume } from './ResumeContext';

const ResumePreview = () => {
    const { resumeData } = useResume();
    const { personalInfo, education, experience, skills, additional } = resumeData;
    const { hard = [], soft = [], other = [] } = skills;
    const { projects = [], languages = [], awards = [], interests = [] } = additional;

    const themeColor = "#1D7B64"; // Teal/Green from Figma

    return (
        <div className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto p-[15mm] text-gray-800 font-sans leading-relaxed overflow-hidden relative box-border" id="resume-preview">

            {/* Header */}
            <div className="text-center mb-4 mt-4">
                <h1 className="text-[2.2rem] font-serif text-gray-900 mb-1 leading-none tracking-tight">
                    {personalInfo.fullName || "Emma Ahearn"}
                </h1>
                <p className="text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase mt-2">
                    {personalInfo.role || "CHEMIST"}
                </p>
                <div className="w-full h-[1.5px] bg-gray-900 mt-5 mb-5 opacity-80"></div>
            </div>

            {/* Professional Summary */}
            <div className="mb-5 text-center px-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-900 mt-1">Professional Summary</h3>
                <p className="text-[9.5px] text-center text-gray-800 italic leading-relaxed">
                    {personalInfo.summary || "I am a chemistry graduate seeking to apply my extensive academic background and laboratory experience in an organization with an innovative vision. I am looking forward to contributing to a dynamic team and supporting research and development efforts."}
                </p>
            </div>

            {/* Contact Info */}
            <div className="flex justify-between items-start border-t border-b border-gray-200 py-[12px] mb-6 text-[8.5px] text-gray-700 px-6">
                <div className="flex flex-col">
                    <span style={{ color: themeColor }} className="font-bold mb-[2px]">Phone:</span>
                    <span>{personalInfo.phone || "+123-456-7890"}</span>
                </div>
                <div className="flex flex-col">
                    <span style={{ color: themeColor }} className="font-bold mb-[2px]">Email:</span>
                    <span>{personalInfo.email || "hello@reallygreatsite.com"}</span>
                </div>
                <div className="flex flex-col">
                    <span style={{ color: themeColor }} className="font-bold mb-[2px]">Location:</span>
                    <span className="max-w-[120px] leading-tight">{personalInfo.address || "123 Anywhere St., Any City, ST 12345"}</span>
                </div>
            </div>

            {/* Main Content Info */}
            <div className="space-y-[18px] text-sm px-1">

                {/* Education */}
                {(education.length > 0 || !personalInfo.fullName) && (
                    <section>
                        <h3 style={{ color: themeColor }} className="text-[11px] font-bold uppercase tracking-widest mb-[6px]">Education</h3>
                        <div className="space-y-3">
                            {(education.length > 0 ? education : [{
                                id: 1, degree: 'Bachelor of Science in Chemistry', year: '2026-2030', school: 'East State University, Valley City',
                                description: 'Relevant Coursework: Organic Chemistry, Inorganic Chemistry, Physical Chemistry, Analytical Chemistry, Chemical Engineering Principles, Thermodynamics, Material Science\nGPA: 3.8'
                            }]).map(edu => (
                                <div key={edu.id}>
                                    <h4 className="font-bold text-gray-900 text-[9.5px]">
                                        {edu.degree} {edu.year && <span className="text-gray-900 font-bold">| {edu.year}</span>}
                                    </h4>
                                    <p style={{ color: themeColor }} className="text-[8.5px] italic mb-[3px] leading-tight">{edu.school}</p>
                                    {edu.description && (
                                        <ul className="list-disc pl-[14px] space-y-[1px]">
                                            {edu.description.split('\n').map((line, i) => (
                                                <li key={i} className="text-[9px] text-gray-800 leading-snug">{line}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience / Internship */}
                {(experience.length > 0 || !personalInfo.fullName) && (
                    <section>
                        <h3 style={{ color: themeColor }} className="text-[11px] font-bold uppercase tracking-widest mb-[6px]">Research Internship</h3>
                        <div className="space-y-3">
                            {(experience.length > 0 ? experience : [{
                                id: 1, role: 'Undergraduate Research Assistant', duration: '2029-2030', company: 'Chemistry Department of East State University',
                                description: 'Collaborated with a research team to study the synthesis of novel organic compounds\nConducted experiments using chromatography, spectroscopy, and other analytical techniques\nAnalyzed and interpreted data, contributing to a research paper submitted for publication'
                            }]).map(exp => (
                                <div key={exp.id}>
                                    <h4 className="font-bold text-gray-900 text-[9.5px]">
                                        {exp.role} {exp.duration && <span className="text-gray-900 font-bold">| {exp.duration}</span>}
                                    </h4>
                                    <p style={{ color: themeColor }} className="text-[8.5px] italic mb-[3px] leading-tight">{exp.company}</p>
                                    {exp.description && (
                                        <ul className="list-disc pl-[14px] space-y-[1px]">
                                            {exp.description.split('\n').map((line, i) => (
                                                <li key={i} className="text-[9px] text-gray-800 leading-snug">{line}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {(projects.length > 0 || !personalInfo.fullName) && (
                    <section>
                        <h3 style={{ color: themeColor }} className="text-[11px] font-bold uppercase tracking-widest mb-[6px]">Projects</h3>
                        <div className="space-y-[10px]">
                            {(projects.length > 0 ? projects : [
                                { id: 1, title: 'Fabrication of a Miniature Chemical Reactor', link: 'Chemical Engineering Course, Second Semester of 2028', description: 'Engineered a small-scale chemical reactor using principles of chemical engineering\nConducted performance tests and optimization checks to ensure efficiency and safety\nPresented findings to faculty and peers and received excellent marks for innovation' },
                                { id: 2, title: 'The Green Thumb Chemist', link: 'Chemistry Club, First Semester of 2029', description: 'Developed a project aimed at implementing environmentally-friendly lab practices\nResearched and implemented sustainable alternatives to hazardous chemicals\nEducated peers on the importance of green chemistry through workshops and forums' }
                            ]).map((proj, idx) => (
                                <div key={proj.id || idx}>
                                    <h4 className="font-bold text-gray-900 text-[9.5px] leading-snug">{proj.title}</h4>
                                    {(proj.link) && <p style={{ color: themeColor }} className="text-[8.5px] italic mb-[3px] leading-tight">{proj.link}</p>}
                                    {proj.description && (
                                        <ul className="list-disc pl-[14px] space-y-[1px]">
                                            {proj.description.split('\n').map((line, i) => (
                                                <li key={i} className="text-[9px] text-gray-800 leading-snug">{line}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Awards */}
                {(awards.length > 0 || !personalInfo.fullName) && (
                    <section>
                        <h3 style={{ color: themeColor }} className="text-[11px] font-bold uppercase tracking-widest mb-[6px]">Notable Awards</h3>
                        <ul className="list-disc pl-[14px] space-y-[2px]">
                            {(awards.length > 0 ? awards : [
                                'Dean\'s List, East State University, 2026-2030', 'Gold Award, Chemistry Olympiad, 2027'
                            ]).map((award, idx) => (
                                <li key={idx} className="text-[9px] text-gray-800 leading-snug">{award}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Skills & Others */}
                {(hard.length > 0 || soft.length > 0 || other.length > 0 || languages.length > 0 || interests.length > 0) && (
                    <div className="grid grid-cols-2 gap-6 mt-[14px] page-break-inside-avoid pt-2 border-t border-gray-100">
                        {(hard.length > 0 || soft.length > 0 || other.length > 0) && (
                            <section>
                                <h3 style={{ color: themeColor }} className="text-[11px] font-bold uppercase tracking-widest mb-[6px]">Skills</h3>
                                <ul className="list-none space-y-[2px]">
                                    {[...hard, ...soft, ...other].map((skill, idx) => (
                                        <li key={`skill-${idx}`} className="text-[9px] text-gray-800 pl-2 border-l-2 border-gray-300 leading-snug">{skill}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                        {(languages.length > 0 || interests.length > 0) && (
                            <section>
                                {languages.length > 0 && (
                                    <div className="mb-3">
                                        <h3 style={{ color: themeColor }} className="text-[11px] font-bold uppercase tracking-widest mb-[6px]">Languages</h3>
                                        <div className="flex flex-wrap gap-1 text-[9px] text-gray-800 font-medium">
                                            {languages.join(', ')}
                                        </div>
                                    </div>
                                )}
                                {interests.length > 0 && (
                                    <div>
                                        <h3 style={{ color: themeColor }} className="text-[11px] font-bold uppercase tracking-widest mb-[6px]">Interests</h3>
                                        <div className="flex flex-wrap gap-1 text-[9px] text-gray-800 font-medium">
                                            {interests.join(', ')}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}

                {/* Bottom Line Border */}
                <div className="w-full h-[1.5px] bg-[#1D7B64] mt-8 opacity-60"></div>

            </div>
        </div>
    );
};

export default ResumePreview;
