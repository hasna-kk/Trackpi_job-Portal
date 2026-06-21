import express from "express";
const router = express.Router();

import {
    createOrUpdateProfile,
    getMyProfile,
    checkProfileStatus,
    uploadCoverImage,
    uploadProfileImage,
    uploadResume,
    deleteCoverImage,
    deleteProfileImage,
    deleteResume
} from "../controllers/profileController.js";

import { profileImageUpload, coverImageUpload, resumeUploadMiddleware } from "../middleware/uploadMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";

// All profile routes are protected
router.post("/", protect, createOrUpdateProfile);       // Create or update profile
router.get("/me", protect, getMyProfile);               // Get my profile
router.get("/status", protect, checkProfileStatus);     // Check if profile exists

router.post(
    "/cover-image",
    protect, // Using protect alias for authMiddleware
    coverImageUpload.single("coverImage"),
    uploadCoverImage
);

router.delete("/cover-image", protect, deleteCoverImage);
router.delete("/profile-image", protect, deleteProfileImage);

router.post(
    "/profile-image",
    protect,
    profileImageUpload.single("profileImage"),
    uploadProfileImage
);

router.post(
    "/resume",
    protect,
    resumeUploadMiddleware.single("resume"),
    uploadResume
);

router.delete("/resume", protect, deleteResume);

export default router;
