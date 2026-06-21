import express from "express";
import multer from "multer";
import pkg from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import ResumeCandidate from "../models/ResumeCandidate.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = pkg({
    cloudinary: cloudinary,
    params: {
        folder: "trackpi/resume_candidates",
        resource_type: "auto",
    },
});

const upload = multer({ storage: storage });

router.post("/build", optionalAuth, (req, res, next) => {
    upload.single("pdfFile")(req, res, (err) => {
        if (err) {
            console.error("Multer/Cloudinary Upload Error:", err);
            return res.status(500).json({ success: false, message: "Upload failed: " + err.message, error: err });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        const file = req.file;

        console.log("[ResumeBuild] Body:", req.body);
        console.log("[ResumeBuild] File:", file);

        if (!file) {
            return res.status(400).json({ success: false, message: "No PDF file provided" });
        }

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: "Name and phone are required" });
        }

        const role = req.user ? "jobseeker" : "guest";

        // file object from older multer-storage-cloudinary contains secure_url and public_id directly
        // Some versions/configs might use path/filename, so we'll use fallbacks
        const secure_url = file.secure_url || file.path;
        const public_id = file.public_id || file.filename;

        console.log("[ResumeBuild] Extracted:", { secure_url, public_id });

        if (!secure_url || !public_id) {
            throw new Error("Missing Cloudinary upload data (secure_url/public_id)");
        }

        // Save DB record
        const candidate = await ResumeCandidate.create({
            name,
            phone,
            email,
            role,
            cloudinaryUrl: secure_url,
            cloudinaryId: public_id,
            isWatermarked: false, // The uploaded file is clean
        });

        res.status(201).json({
            success: true,
            message: "Resume generated and saved successfully",
            data: candidate,
        });

    } catch (error) {
        console.error("Error building resume:", error);
        res.status(500).json({ success: false, message: "Server error during resume build", error: error.message });
    }
});

export default router;
