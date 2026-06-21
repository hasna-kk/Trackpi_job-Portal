import express from "express";
import {
  getAdminCompetitionTestimonials,
  getCompetitionTestimonialById,
  createCompetitionTestimonial,
  updateCompetitionTestimonial,
  deleteCompetitionTestimonial,
  getPublicCompetitionTestimonials
} from "../controllers/competitionTestimonialsController.js";

import { upload } from "../middleware/uploadMiddleware.js";
import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

/* ================= LIST ================= */
router.get("/", getPublicCompetitionTestimonials);
router.get("/admin", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW), getAdminCompetitionTestimonials);

/* ================= ADD (STATIC) ================= */
router.get("/admin/add", protect, authorize("admin", "superadmin", "superuser"), (req, res) => {
  return res.status(200).json({ success: true });
});

/* ================= CREATE ================= */
router.post(
  "/admin",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_ADD),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createCompetitionTestimonial
);

/* ================= DYNAMIC (ALWAYS LAST) ================= */
router.get("/admin/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW_DETAILS), getCompetitionTestimonialById);

router.put(
  "/admin/:id",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_EDIT),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateCompetitionTestimonial
);

router.delete("/admin/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.COMPETITION_TESTIMONIALS_DELETE), deleteCompetitionTestimonial);

export default router;
