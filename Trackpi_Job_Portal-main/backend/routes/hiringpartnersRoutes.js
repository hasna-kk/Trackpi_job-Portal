import express from "express";
import {
  getAdminHiringPartners,
  getAdminHiringPartnersById,
  createHiringPartners,
  updateHiringPartners,
  deleteHiringPartners,
  getPublicHiringPartners

} from "../controllers/hiringpartnersController.js";

import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

/* ================= LIST ================= */
router.get("/hiringpartners", getPublicHiringPartners);

// Admin routes
router.use("/admin", protect, authorize("admin", "superadmin", "superuser"));

router.get("/admin/hiringpartners", checkPermission(PERMISSIONS.PARTNERS_VIEW), getAdminHiringPartners);

/* ================= ADD (STATIC – IMPORTANT) ================= */
// prevents "/add" from being treated as ":id"
router.get("/admin/hiringpartners/add", (req, res) => {
  return res.status(200).json({ success: true });
});

/* ================= CREATE ================= */
router.post(
  "/admin/hiringpartners",
  checkPermission(PERMISSIONS.PARTNERS_ADD),
  upload.fields([
    { name: "logo", maxCount: 1 },

  ]),
  createHiringPartners
);

/* ================= DYNAMIC (ALWAYS LAST) ================= */
router.get("/admin/hiringpartners/:id", checkPermission(PERMISSIONS.PARTNERS_VIEW_DETAILS), getAdminHiringPartnersById);

router.put(
  "/admin/hiringpartners/:id",
  checkPermission(PERMISSIONS.PARTNERS_EDIT),
  upload.fields([
    { name: "logo", maxCount: 1 },

  ]),
  updateHiringPartners
);

router.delete("/admin/hiringpartners/:id", checkPermission(PERMISSIONS.PARTNERS_DELETE), deleteHiringPartners);

export default router;
