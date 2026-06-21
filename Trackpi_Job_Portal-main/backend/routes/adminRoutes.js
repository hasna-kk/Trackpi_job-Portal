import express from "express";
import * as adminController from "../controllers/adminController.js";
import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

// All admin routes are protected and require admin, superadmin, or superuser role
router.use(protect);
router.use(authorize("admin", "superadmin", "superuser"));

// Dashboard Stats
router.get("/dashboard-stats", checkPermission(PERMISSIONS.DASHBOARD_VIEW), adminController.getDashboardStats);

// Get All Candidates (Job Seekers)
router.get("/candidates", checkPermission(PERMISSIONS.SIGNUP_VIEW), adminController.getAllCandidates);

// Get Single Candidate Profile
router.get("/candidates/:id", checkPermission(PERMISSIONS.SIGNUP_VIEW_DETAILS), adminController.getCandidateById);

// Get All Jobs (Admin View)
router.get("/jobs", checkPermission(PERMISSIONS.JOBS_VIEW), adminController.getAdminJobs);

// Get Job Specific Applicants
router.get("/jobs/:id/applicants", checkPermission(PERMISSIONS.APPLICANTS_VIEW), adminController.getJobApplicants);

// Get All Applications Globally
router.get("/applications/all", checkPermission(PERMISSIONS.APPLICANTS_VIEW), adminController.getAllApplications);

// Toggle Application Check
router.patch("/applications/:id/toggle-check", checkPermission(PERMISSIONS.APPLICANTS_VIEW), adminController.toggleApplicationChecked);

// Delete Candidate
router.delete("/candidates/:id", checkPermission(PERMISSIONS.SIGNUP_DELETE), adminController.deleteCandidate);

// Super Admin Only: Manage Admins (Full Admins)
router.post(
    "/create-admin",
    authorize("superadmin"),
    adminController.createAdmin
);

// Super Admin & Admin: Manage Super Users (Restricted Staff)
router.post(
    "/create-superuser",
    authorize("superadmin", "admin"),
    adminController.createSuperUser
);

router.put(
    "/update-permissions",
    authorize("superadmin"),
    adminController.updateAdminPermissions
);

router.get(
    "/users",
    checkPermission(PERMISSIONS.USERS_VIEW),
    adminController.getAllUsers
);

// Role Management (Super Admin & Admin)
router.post("/permissions", authorize("superadmin", "admin"), adminController.createRole);
router.get("/permissions", checkPermission(PERMISSIONS.ROLES_VIEW), adminController.getAllRoles);
router.put("/permissions/:id", authorize("superadmin", "admin"), adminController.updateRole);
router.delete("/permissions/:id", authorize("superadmin", "admin"), adminController.deleteRole);

// Manage Admin Status
router.put("/admin-status/:id", authorize("superadmin"), adminController.toggleAdminStatus);

// Update Super User (Super Admin & Admin)
router.put(
    "/superuser/:id",
    authorize("superadmin", "admin"),
    adminController.updateSuperUser
);

// Demote Super User (Super Admin & Admin)
router.put(
    "/remove-superuser/:id",
    authorize("superadmin", "admin"),
    adminController.demoteSuperUser
);

// Update Admin (Super Admin Only)
router.put(
    "/update-admin/:id",
    authorize("superadmin"),
    adminController.updateAdmin
);

// Demote Admin (Super Admin Only)
router.put(
    "/demote-admin/:id",
    authorize("superadmin"),
    adminController.demoteAdmin
);

export default router;
