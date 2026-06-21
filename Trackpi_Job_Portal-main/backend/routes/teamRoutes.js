import express from "express";
import {
  getAdminTeam,
  getPublicTeam,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from "../controllers/teamController.js";

import { upload } from "../middleware/uploadMiddleware.js";
import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/team", getPublicTeam);

/* ================= ADMIN ================= */
router.get("/admin/team", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TEAM_VIEW), getAdminTeam);
router.get("/admin/team/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TEAM_VIEW_DETAILS), getTeamMemberById);

router.post(
  "/admin/team",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TEAM_ADD),
  upload.single("image"),
  createTeamMember
);

router.put(
  "/admin/team/:id",
  protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TEAM_EDIT),
  upload.single("image"),
  updateTeamMember
);

router.delete("/admin/team/:id", protect, authorize("admin", "superadmin", "superuser"), checkPermission(PERMISSIONS.TEAM_DELETE), deleteTeamMember);

export default router;
