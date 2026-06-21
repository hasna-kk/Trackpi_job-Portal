// models/Testimonial.js
import mongoose from "mongoose";

const HiringPartnersSchema = new mongoose.Schema(
  {
    organizationname: { type: String, required: true },
    email: { type: String, required: true },
    aboutcompany: { type: String, required: true },

    // Store file paths or URLs
    
    logo: { 
      public_id: String,
      url: String,
      originalName: String
    },
    
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("HiringPartners", HiringPartnersSchema);