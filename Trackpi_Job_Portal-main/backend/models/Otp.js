import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 }
}, { timestamps: true });

// Auto delete after expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", otpSchema);
