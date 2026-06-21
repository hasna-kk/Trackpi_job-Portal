import express from "express";
import {
    getResumeCandidates,
    deleteResumeCandidates,
    downloadResumeCandidate,
} from "../controllers/resumeAdminController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

// Get list of resume build candidates
router.get(
    "/",
    protect,
    checkPermission(PERMISSIONS.RESUME_VIEW),
    getResumeCandidates
);

// Delete bulk/single candidates
router.delete(
    "/bulk",
    protect,
    checkPermission(PERMISSIONS.RESUME_DELETE),
    deleteResumeCandidates
);

// Download a candidate's resume securely through backend
router.get(
    "/download/:id",
    protect,
    checkPermission(PERMISSIONS.RESUME_DOWNLOAD),
    downloadResumeCandidate
);

export default router;
