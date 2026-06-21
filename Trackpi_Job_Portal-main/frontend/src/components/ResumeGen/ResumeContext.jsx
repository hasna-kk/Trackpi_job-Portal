import React, { createContext, useState, useContext } from 'react';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            role: '',
            summary: '',
        },
        education: [],
        experience: [], // For Internship/Work Experience
        skills: {
            hard: [],
            soft: []
        },
        additional: {
            projects: [],
            languages: [],
            awards: [],
            interests: []
        },
    });

    const updatePersonalInfo = (data) => {
        setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, ...data },
        }));
    };

    const addEducation = (edu) => {
        setResumeData((prev) => ({
            ...prev,
            education: [...prev.education, edu],
        }));
    };

    // Add other update functions as needed...

    return (
        <ResumeContext.Provider value={{ resumeData, updatePersonalInfo, addEducation, setResumeData }}>
            {children}
        </ResumeContext.Provider>
    );
};
