import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

// Index for search capabilities
skillSchema.index({ name: 'text' });

export default mongoose.model('Skill', skillSchema);
