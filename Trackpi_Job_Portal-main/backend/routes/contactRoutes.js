import express from "express";
import { submitContactForm, getAllContactForms, getContactFormById } from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", submitContactForm);
router.get("/all", protect, authorize("admin", "superadmin"), getAllContactForms);
router.get("/:id", protect, authorize("admin", "superadmin"), getContactFormById);

export default router;
