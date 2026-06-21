import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        jobType: {
            type: String, // Full time / Part time
            required: true,
        },
        workMode: {
            type: String, // WFH / Hybrid / Office
            required: true,
        },
        education: {
            type: String,
            required: true,
        },
        salary: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Both", "Any"],
            default: "Any"
        },
        vacancies: {
            type: Number,
        },
        workingDays: {
            type: String,
        },
        workingHours: {
            type: String,
        },
        description: {
            type: String,
        },
        skills: {
            type: String,
        },
        eligibility: {
            type: String,
        },
        benefits: {
            type: String,
        },
        incentive: {
            type: String,
        },
        responsibilities: {
            type: String,
        },
        status: {
            type: String,
            enum: ["urgent", "new", "closed"],
            default: "new",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
