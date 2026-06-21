import mongoose from "mongoose";

const adminRoleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        permissions: {
            type: [String], // Array of permission strings matching frontend constants
            default: []
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

export default mongoose.model("AdminRole", adminRoleSchema);
