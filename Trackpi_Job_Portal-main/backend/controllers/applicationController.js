import Application from "../models/Application.js";
import Profile from "../models/Profile.js";
import mongoose from "mongoose";
import fs from "fs";

// @desc    Apply for a job
// @route   POST /api/jobs/:jobId/apply
// @access  Public
export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { name, email, phone, experience, portfolio, userId } = req.body;

        let resumePath = req.file ? req.file.path : null;

        // If no file uploaded, check if user is logged in and has a profile resume
        if (!resumePath) {
            let searchUserId = userId;
            if (searchUserId && searchUserId !== "null" && searchUserId !== "undefined") {
                if (mongoose.Types.ObjectId.isValid(searchUserId)) {
                    const profile = await Profile.findOne({ user: searchUserId });
                    if (profile && profile.resumeUrl) {
                        resumePath = profile.resumeUrl;
                    }
                }
            }
        }

        if (!resumePath) {
            return res.status(400).json({
                success: false,
                message: "Resume is required (none uploaded and none found in profile)",
                debug: { userId, hasFile: !!req.file }
            });
        }

        // Final ID verification
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Invalid Job ID format" });
        }

        // Prevent duplicate applications
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const existingApplication = await Application.findOne({ jobId, userId });
            if (existingApplication) {
                return res.status(400).json({ success: false, message: "You have already applied for this job." });
            }
        }

        const application = await Application.create({
            jobId,
            userId: (userId && mongoose.Types.ObjectId.isValid(userId)) ? userId : null,
            name,
            email,
            phone,
            experience,
            resumeUrl: resumePath,
            portfolio
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        console.error("Error submitting application:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error during application submission",
            error: error.message
        });
    }
};

// @desc    Get applications for the logged-in user
// @route   GET /api/applications/my-applications
// @access  Private
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user._id; // Assumes middleware sets req.user

        const applications = await Application.find({ userId })
            .populate('jobId') // Populate job details
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
