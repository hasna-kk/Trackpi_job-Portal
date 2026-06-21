import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        status: {
            type: String,
            default: "applied",
        },
        isChecked: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        resumeUrl: {
            type: String, // Cloudinary URL
            required: true,
        },
        portfolio: {
            type: String, // URL
        },
    },
    { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
