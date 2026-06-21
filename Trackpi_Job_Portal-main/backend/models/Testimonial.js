// models/Testimonial.js
import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    jobTitle: { type: String, required: true },
    about: { type: String, required: true },

    // Store file paths or URLs
    coverImage: { 
      public_id: String,
      url: String,
      originalName: String
    },
    thumbnailImage: { 
      public_id: String,
      url: String,
      originalName: String
    },
    video: { 
      public_id: String,
      url: String,
      originalName: String,
      mimetype: String,
      size: Number
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);