import express from "express";
const router = express.Router();

import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob
} from "../controllers/jobController.js";

import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

router.post("/", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.JOBS_NEW_URGENT_JOB), createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.JOBS_EDIT), updateJob);

export default router;
