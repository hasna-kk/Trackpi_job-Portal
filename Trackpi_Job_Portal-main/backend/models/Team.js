import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  image: {
    url: String,
    public_id: String
  },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" }
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Team", teamSchema);
