const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('../models/Skill');
const connectDB = require('../config/db'); // Assuming this exists based on folder structure

dotenv.config();

const SKILLS = [
    // Tech & Programming
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust", "TypeScript", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "CI/CD", "DevOps", "Agile", "Scrum", "Jira", "Figma", "Adobe XD", "Redux", "Angular", "Vue.js", "Express.js", "Django", "Flask", "Spring Boot", ".NET", "Unity", "Unreal Engine", "Machine Learning", "Deep Learning", "Artificial Intelligence", "Data Science", "Data Analysis", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Blockchain", "Solidity", "Smart Contracts", "Web3", "Cybersecurity", "Ethical Hacking", "Penetration Testing", "Network Security", "Linux", "Shell Scripting", "Bash", "PowerShell",

    // Design & Creative
    "UI/UX Design", "UI Design", "User Research", "Graphic Design", "Web Design", "Logo Design", "Branding", "Illustration", "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Adobe Premiere Pro", "Adobe After Effects", "Motion Graphics", "Video Editing", "Photography", "Photo Editing", "3D Modeling", "Blender", "Maya", "Cinema 4D", "Sketch", "InVision", "Prototyping", "Wireframing", "Interaction Design", "Typography", "Color Theory", "Layout Design",

    // Marketing & Sales
    "Digital Marketing", "SEO", "SEM", "Content Marketing", "Social Media Marketing", "Email Marketing", "Affiliate Marketing", "Influencer Marketing", "Google Analytics", "Google Ads", "Facebook Ads", "Instagram Marketing", "LinkedIn Marketing", "Twitter Marketing", "YouTube Marketing", "Copywriting", "Content Writing", "Blogging", "Sales", "Business Development", "Lead Generation", "Cold Calling", "Email Outreach", "CRM", "Salesforce", "HubSpot", "Account Management", "Customer Success", "Negotiation", "Pitching", "Market Research", "Brand Management", "Public Relations",

    // Business & Finance
    "Accounting", "Finance", "Bookkeeping", "Tally", "QuickBooks", "Xero", "Excel", "Financial Analysis", "Investing", "Stock Market", "Trading", "Cryptocurrency", "Business Strategy", "Entrepreneurship", "Management", "Project Management", "Product Management", "Operations Management", "Supply Chain Management", "Logistics", "Human Resources", "Recruitment", "Talent Acquisition", "Employee Relations", "Payroll", "Business Law", "Taxation", "Auditing",

    // Soft Skills
    "Communication", "Leadership", "Teamwork", "Problem Solving", "Time Management", "Critical Thinking", "Adaptability", "Creativity", "Emotional Intelligence", "Decision Making", "Conflict Resolution", "Negotiation", "Public Speaking", "Presentation Skills", "Active Listening", "Collaboration", "Mentoring", "Teaching", "Networking", "Stress Management", "Organization", "Detail Oriented",

    // Healthcare & Medical
    "Nursing", "Patient Care", "Medical Terminology", "First Aid", "CPR", "Phlebotomy", "Pharmacy", "Medical Billing", "Medical Coding", "Radiology", "Physiotherapy", "Nutrition", "Dietetics", "Mental Health", "Psychology", "Counseling", "Healthcare Management", "Public Health",

    // Engineering (Non-CS)
    "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Chemical Engineering", "AutoCAD", "SolidWorks", "MATLAB", "Ansys", "Revit", "PCB Design", "Embedded Systems", "Robotics", "Automation", "PLC Programming", "Hydraulics", "Pneumatics", "Thermodynamics", "Structural Analysis",

    // Other Common Skills
    "Customer Support", "Data Entry", "Virtual Assistant", "Transcription", "Translation", "Localization", "Event Planning", "Hospitality", "Tourism", "Cooking", "Catering", "Cleaning", "Driving", "Plumbing", "Carpentry", "Electrician", "Painting", "Construction", "Gardening", "Farming", "Teaching", "Tutoring", "Curriculum Development", "Research", "Academic Writing"
];

const seedSkills = async () => {
    try {
        await connectDB();

        console.log('Clearing existing skills...');
        await Skill.deleteMany({});

        console.log('Seeding skills...');
        const skillDocs = SKILLS.map(name => ({ name }));
        await Skill.insertMany(skillDocs);

        console.log('Skills seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding skills:', error);
        process.exit(1);
    }
};

seedSkills();
