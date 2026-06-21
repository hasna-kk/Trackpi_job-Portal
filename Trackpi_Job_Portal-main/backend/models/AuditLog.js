import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // Optional, as the target might not always be a user (e.g., system config)
        },
        details: {
            type: Object,
        },
        ipAddress: {
            type: String,
        }
    },
    { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
