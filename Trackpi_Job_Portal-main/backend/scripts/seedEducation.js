import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import University from "../models/University.js";
import connectDB from "../config/db.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const courses = [

    // --- Bachelor Degrees ---
    // Priority: Business/Management
    { name: "BBA (Bachelor of Business Administration)", level: "Bachelor" },
    { name: "BCom (Bachelor of Commerce)", level: "Bachelor" },
    { name: "BHM (Bachelor of Hotel Management)", level: "Bachelor" },

    // Engineering/Technology
    { name: "BTech - Computer Science Engineering", level: "Bachelor" },
    { name: "BTech - Information Technology", level: "Bachelor" },
    { name: "BTech - Electronics & Communication", level: "Bachelor" },
    { name: "BTech - Mechanical Engineering", level: "Bachelor" },
    { name: "BTech - Civil Engineering", level: "Bachelor" },
    { name: "BTech - Electrical Engineering", level: "Bachelor" },
    { name: "BTech - Artificial Intelligence & Data Science", level: "Bachelor" },
    { name: "BE - Computer Science", level: "Bachelor" },
    { name: "BE - Civil Engineering", level: "Bachelor" },
    { name: "BE - Mechanical Engineering", level: "Bachelor" },
    { name: "BSc - Computer Science", level: "Bachelor" },
    { name: "BSc - Information Technology", level: "Bachelor" },
    { name: "BSc - Mathematics", level: "Bachelor" },
    { name: "BSc - Physics", level: "Bachelor" },
    { name: "BSc - Chemistry", level: "Bachelor" },
    { name: "BSc - Biotechnology", level: "Bachelor" },
    { name: "BSc - Agriculture", level: "Bachelor" },
    { name: "BSc - Nursing", level: "Bachelor" },
    { name: "BCA (Bachelor of Computer Applications)", level: "Bachelor" },
    // Arts/Other
    { name: "BA - English Literature", level: "Bachelor" },
    { name: "BA - Economics", level: "Bachelor" },
    { name: "BA - History", level: "Bachelor" },
    { name: "BA - Psychology", level: "Bachelor" },
    { name: "BA - Sociology", level: "Bachelor" },
    { name: "BA - Political Science", level: "Bachelor" },
    { name: "LLB (Bachelor of Laws)", level: "Bachelor" },
    { name: "MBBS (Bachelor of Medicine, Bachelor of Surgery)", level: "Bachelor" },
    { name: "BDS (Bachelor of Dental Surgery)", level: "Bachelor" },
    { name: "BAMS (Ayurvedic Medicine)", level: "Bachelor" },
    { name: "BHMS (Homeopathic Medicine)", level: "Bachelor" },
    { name: "B.Pharm (Bachelor of Pharmacy)", level: "Bachelor" },
    { name: "B.Arch (Bachelor of Architecture)", level: "Bachelor" },
    { name: "B.Des (Bachelor of Design)", level: "Bachelor" },
    { name: "B.Ed (Bachelor of Education)", level: "Bachelor" },
    { name: "Other - Bachelor Degree", level: "Bachelor" },

    // --- Post Graduate Degrees ---
    // Priority: Business/Management
    { name: "MBA - Marketing", level: "Post Graduate" },
    { name: "MBA - Finance", level: "Post Graduate" },
    { name: "MBA - Human Resource", level: "Post Graduate" },
    { name: "MBA - International Business", level: "Post Graduate" },
    { name: "MBA - Operations Management", level: "Post Graduate" },
    { name: "PG Diploma in Management", level: "Post Graduate" },
    { name: "MCom (Master of Commerce)", level: "Post Graduate" },

    // Tech/Science
    { name: "MCA (Master of Computer Applications)", level: "Post Graduate" },
    { name: "MTech - Computer Science Engineering", level: "Post Graduate" },
    { name: "MTech - Software Engineering", level: "Post Graduate" },
    { name: "MTech - Data Science", level: "Post Graduate" },
    { name: "MTech - VLSI Design", level: "Post Graduate" },
    { name: "ME - Structural Engineering", level: "Post Graduate" },
    { name: "MSc - Computer Science", level: "Post Graduate" },
    { name: "MSc - Information Technology", level: "Post Graduate" },
    { name: "MSc - Physics", level: "Post Graduate" },
    { name: "MSc - Chemistry", level: "Post Graduate" },
    { name: "MSc - Mathematics", level: "Post Graduate" },
    { name: "MSc - Biotechnology", level: "Post Graduate" },
    { name: "MSc - Microbiology", level: "Post Graduate" },
    // Arts/Other
    { name: "MA - English", level: "Post Graduate" },
    { name: "MA - Economics", level: "Post Graduate" },
    { name: "MA - Psychology", level: "Post Graduate" },
    { name: "MA - History", level: "Post Graduate" },
    { name: "MA - Political Science", level: "Post Graduate" },
    { name: "MA - Journalism & Mass Communication", level: "Post Graduate" },
    { name: "LLM (Master of Laws)", level: "Post Graduate" },
    { name: "MD - General Medicine", level: "Post Graduate" },
    { name: "MS - General Surgery", level: "Post Graduate" },
    { name: "M.Pharm (Master of Pharmacy)", level: "Post Graduate" },
    { name: "M.Arch (Master of Architecture)", level: "Post Graduate" },
    { name: "M.Des (Master of Design)", level: "Post Graduate" },
    { name: "M.Ed (Master of Education)", level: "Post Graduate" },
    { name: "PG Diploma in Data Science", level: "Post Graduate" },
    { name: "Other - Post Graduate Degree", level: "Post Graduate" },

    // --- PhD / Doctorate ---
    { name: "PhD - Computer Science", level: "PhD / Doctorate" },
    { name: "PhD - Information Technology", level: "PhD / Doctorate" },
    { name: "PhD - Electronics Engineering", level: "PhD / Doctorate" },
    { name: "PhD - Mechanical Engineering", level: "PhD / Doctorate" },
    { name: "PhD - Civil Engineering", level: "PhD / Doctorate" },
    { name: "PhD - Physics", level: "PhD / Doctorate" },
    { name: "PhD - Chemistry", level: "PhD / Doctorate" },
    { name: "PhD - Mathematics", level: "PhD / Doctorate" },
    { name: "PhD - Biotechnology", level: "PhD / Doctorate" },
    { name: "PhD - Management Studies", level: "PhD / Doctorate" },
    { name: "PhD - Economics", level: "PhD / Doctorate" },
    { name: "PhD - English Literature", level: "PhD / Doctorate" },
    { name: "PhD - Psychology", level: "PhD / Doctorate" },
    { name: "PhD - Law", level: "PhD / Doctorate" },
    { name: "Pharm.D (Doctor of Pharmacy)", level: "PhD / Doctorate" },
    { name: "Doctor of Medicine (DM)", level: "PhD / Doctorate" },
    { name: "Other - PhD / Doctorate Degree", level: "PhD / Doctorate" },
];

const universities = [
    "Anna University",
    "MG University",
    "Calicut University",
    "Bharathiar University",
    "IIT Delhi",
    "IISc Bangalore",
    "CUSAT",
    "Andhra University",
    "Birla Institute of Technology",
    "Jawaharlal Nehru University",
    "University of Kerala",
    "SRM Institute of Science and Technology",
    "VIT University",
    "Amrita Vishwa Vidyapeetham",
    "Manipal Academy of Higher Education",
    "University of Mumbai",
    "University of Delhi",
    "Banaras Hindu University"
];

const seedEducation = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Course.deleteMany({});
        await University.deleteMany({});

        // transform to objects
        // const courseDocs = courses.map(name => ({ name })); // Already objects
        const uniDocs = universities.map(name => ({ name }));

        const insertedCourses = await Course.insertMany(courses);
        const insertedUnis = await University.insertMany(uniDocs);

        console.log(`✅ Education data seeded successfully. Courses: ${insertedCourses.length}, Universities: ${insertedUnis.length}`);
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding education data:", error);
        process.exit(1);
    }
};

seedEducation();
