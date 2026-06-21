import express from "express";
import { createCompetition, getCompetitions, updateCompetition, deleteCompetition, getActiveCompetition } from "../controllers/competitionController.js";
import { 
    registerForCompetition, 
    getAdminCandidates, 
    updateCandidateStatus, 
    bulkDeleteCandidates,
    toggleLiveStatus,
    submitTask,
    loginCandidate,
    getCandidateStatus
} from "../controllers/competitionCandidateController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";
import { competitionUpload, competitionTaskUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET active competition for public countdown
router.get("/active", getActiveCompetition);

// GET all competitions (Public for landing page)
router.get("/all-public", getCompetitions);

// GET all competitions
router.get("/", 
    protect, 
    checkPermission(PERMISSIONS.COMPETITION_VIEW), 
    getCompetitions
);

// CREATE a new competition with file upload
router.post("/", 
    protect, 
    checkPermission(PERMISSIONS.COMPETITION_ADD), 
    competitionUpload.single(), 
    createCompetition
);

// UPDATE a competition with optional file upload
router.put("/:id", 
    protect, 
    checkPermission(PERMISSIONS.COMPETITION_EDIT), 
    competitionUpload.single(), 
    updateCompetition
);

// DELETE a competition
router.delete("/:id", 
    protect, 
    checkPermission(PERMISSIONS.COMPETITION_EDIT), 
    deleteCompetition
);

/* ================= COMP CANDIDATES ================= */

// Registration (Public)
router.post("/register", registerForCompetition);
router.post("/login", loginCandidate);
router.get("/status/:enrollmentId", getCandidateStatus);

// Submit Task (Public - uses enrollmentId)
router.post("/submit-task", competitionTaskUpload.single(), submitTask);


// GET all competition candidates for admin
router.get("/candidates/all", 
    protect, 
    checkPermission(PERMISSIONS.COMPETITION_CANDIDATES_VIEW), 
    getAdminCandidates
);

// Update status (Pass/Fail)
router.put("/candidates/:id/status", 
    protect, 
    checkPermission(PERMISSIONS.COMPETITION_CANDIDATES_EDIT), 
    updateCandidateStatus
);

// Toggle live status
router.put("/candidates/:id/toggle-live", 
    protect, 
    checkPermission(PERMISSIONS.COMPETITION_CANDIDATES_EDIT), 
    toggleLiveStatus
);

// Bulk delete candidates
router.post("/candidates/bulk-delete", 
    protect, 
    checkPermission(PERMISSIONS.COMPETITION_CANDIDATES_DELETE), 
    bulkDeleteCandidates
);

export default router;
