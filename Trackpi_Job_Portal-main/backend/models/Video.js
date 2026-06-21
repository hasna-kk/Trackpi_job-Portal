import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        enum: ["UI UX Design", "Graphic Design", "Video editing"]
    },
    video: {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

export default Video;
