import mongoose from "mongoose";

const resumeCandidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String, // Kept optional in case some guests don't provide it, though usually good to have
        },
        role: {
            type: String,
            enum: ["guest", "jobseeker"],
            required: true,
        },
        cloudinaryUrl: {
            type: String,
            required: true, // Link to the uploaded PDF
        },
        cloudinaryId: {
            type: String,
            required: true, // Used for deleting the file from Cloudinary later
        },
        isWatermarked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ResumeCandidate", resumeCandidateSchema);
