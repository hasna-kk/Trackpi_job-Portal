import express from "express";
import {
  getAdminWinners,
  getWinnerById,
  createWinner,
  updateWinner,
  deleteWinner,
  getPublicWinners
} from "../controllers/competitionWinnerController.js";

import { upload } from "../middleware/uploadMiddleware.js";
import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

/* ================= LIST ================= */
router.get("/", getPublicWinners);
router.get("/admin", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.WINNERS_VIEW), getAdminWinners);

/* ================= ADD (STATIC) ================= */
router.get("/admin/add", protect, authorize("admin", "superadmin", "superuser"), (req, res) => {
  return res.status(200).json({ success: true });
});

/* ================= CREATE ================= */
router.post(
  "/admin",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.WINNERS_ADD),
  upload.single("image"),
  createWinner
);

/* ================= DYNAMIC (ALWAYS LAST) ================= */
router.get("/admin/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.WINNERS_VIEW), getWinnerById);

router.put(
  "/admin/:id",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.WINNERS_EDIT),
  upload.single("image"),
  updateWinner
);

router.delete("/admin/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.WINNERS_DELETE), deleteWinner);

export default router;
