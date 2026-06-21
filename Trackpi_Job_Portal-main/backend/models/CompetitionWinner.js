import mongoose from "mongoose";

const competitionWinnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    about: { type: String, required: true },

    image: { 
      public_id: String,
      url: String,
      originalName: String
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("CompetitionWinner", competitionWinnerSchema);
