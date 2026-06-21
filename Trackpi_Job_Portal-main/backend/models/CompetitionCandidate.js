import mongoose from "mongoose";

const competitionCandidateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        enrollmentId: { type: String, required: true, unique: true },
        department: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        location: { type: String },
        portfolio: { type: String },
        resumeUrl: { type: String },
        taskUrl: { type: String },
        status: {
            type: String,
            enum: ["Pending", "Pass", "Fail"],
            default: "Pending"
        },
        isLive: { type: Boolean, default: true },
        competitionId: { type: mongoose.Schema.Types.ObjectId, ref: "Competition" }
    },
    { timestamps: true }
);

export default mongoose.model("CompetitionCandidate", competitionCandidateSchema);
