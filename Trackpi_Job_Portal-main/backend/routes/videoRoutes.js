import express from "express";
import { getVideos, createVideo, updateVideo, deleteVideo } from "../controllers/videoController.js";
import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ================= LIST ================= */
router.get("/", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.VIDEO_VIEW), getVideos);

/* ================= CREATE ================= */
router.post(
  "/admin",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.VIDEO_ADD),
  upload.single("video"),
  createVideo
);

/* ================= UPDATE ================= */
router.put(
  "/admin/:id",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.VIDEO_EDIT),
  upload.single("video"),
  updateVideo
);

/* ================= DELETE ================= */
router.delete("/admin/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.VIDEO_DELETE), deleteVideo);

export default router;
