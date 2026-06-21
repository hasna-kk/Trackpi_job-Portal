import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        employeeId: {
            type: String, // Optional employee ID for staff/admins
            unique: true,
            sparse: true // Allows multiple null/undefined values
        },
        phone: {
            type: String,
            unique: true,
            sparse: true
        },
        password: {
            type: String,
            required: true,
        },
        profileCompleted: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["jobseeker", "admin", "superadmin", "superuser", "user"], // 'user' kept for legacy support until migration
            default: "jobseeker"
        },
        previousRole: {
            type: String, // Stores previous role when deactivated/demoted (e.g., 'admin', 'superadmin')
            default: null
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
        permissions: {
            type: [String],
            default: []
        },
        googleId: {
            type: String
        },
        linkedinId: {
            type: String
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);