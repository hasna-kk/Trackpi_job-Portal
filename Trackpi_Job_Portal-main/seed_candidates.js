import mongoose from "mongoose";
import CompetitionCandidate from "./backend/models/CompetitionCandidate.js";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/job-portal");
        
        // Check if data already exists
        const count = await CompetitionCandidate.countDocuments();
        if (count > 0) {
            console.log("Data already exists. Skipping seed.");
            process.exit(0);
        }

        const candidates = [
            { name: "Mark Jacobs", enrollmentId: "ENDG235#", department: "UI UX Designer", phone: "9735276590", email: "abc@gmail.com", status: "Pending", isLive: true },
            { name: "Stephen Jacobs", enrollmentId: "ENDG236#", department: "Graphic designer", phone: "9735276590", email: "abc@gmail.com", status: "Pass", isLive: true },
            { name: "Mark Jacobs", enrollmentId: "ENDG237#", department: "UI UX Designer", phone: "9735276590", email: "abc@gmail.com", status: "Fail", isLive: true },
            { name: "Stephen Jacobs", enrollmentId: "ENDG238#", department: "Graphic designer", phone: "9735276590", email: "abc@gmail.com", status: "Pass", isLive: false },
            { name: "Mark Jacobs", enrollmentId: "ENDG239#", department: "UI UX Designer", phone: "9735276590", email: "abc@gmail.com", status: "Fail", isLive: false }
        ];

        await CompetitionCandidate.insertMany(candidates);
        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seed();
