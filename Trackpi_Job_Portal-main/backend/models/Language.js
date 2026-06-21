import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

// Index for search capabilities
languageSchema.index({ name: 'text' });

export default mongoose.model('Language', languageSchema);
