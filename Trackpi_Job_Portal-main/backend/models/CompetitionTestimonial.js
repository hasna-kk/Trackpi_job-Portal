import mongoose from "mongoose";

const competitionTestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    jobTitle: { type: String, required: true },
    about: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },

    // Store file paths or URLs
    coverImage: { 
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

export default mongoose.model("CompetitionTestimonial", competitionTestimonialSchema);
