import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        level: {
            type: String,
            required: true,
            enum: ["Bachelor", "Post Graduate", "PhD / Doctorate"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
