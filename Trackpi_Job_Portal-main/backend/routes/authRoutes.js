import express from "express";
import rateLimit from "express-rate-limit";

const router = express.Router();

const otpLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5
});

import {
    registerUser,
    loginUser,
    googleAuth,
    linkedinAuth,
    sendOtp,
    verifyOtp,
    getMe
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/linkedin", linkedinAuth);
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", protect, getMe);

export default router;
