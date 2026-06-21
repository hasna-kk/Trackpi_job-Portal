import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    questionUrl: { type: String }, // URL to the uploaded file (Cloudinary)
    status: { 
        type: String, 
        enum: ["live", "future", "previous"], 
        default: "live" 
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Competition", competitionSchema);
