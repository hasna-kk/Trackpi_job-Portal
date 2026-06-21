import express from "express";
import {
  getAdminTestimonials,
  getAdminTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getPublicTestimonials
} from "../controllers/testimonialsController.js";

import { upload } from "../middleware/uploadMiddleware.js";
import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

/* ================= LIST ================= */
router.get("/testimonials", getPublicTestimonials);
router.get("/admin/testimonials", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TESTIMONIALS_VIEW), getAdminTestimonials);

/* ================= ADD (STATIC – IMPORTANT) ================= */
// prevents "/add" from being treated as ":id"
router.get("/admin/testimonials/add", protect, authorize("admin", "superadmin", "superuser"), (req, res) => {
  return res.status(200).json({ success: true });
});

/* ================= CREATE ================= */
router.post(
  "/admin/testimonials",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TESTIMONIALS_ADD),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "thumbnailImage", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createTestimonial
);

/* ================= DYNAMIC (ALWAYS LAST) ================= */
router.get("/admin/testimonials/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TESTIMONIALS_VIEW_DETAILS), getAdminTestimonialById);

router.put(
  "/admin/testimonials/:id",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TESTIMONIALS_EDIT),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "thumbnailImage", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateTestimonial
);

router.delete("/admin/testimonials/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TESTIMONIALS_DELETE), deleteTestimonial);

export default router;
