import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import PERMISSIONS from "../config/permissions.js";
import Otp from "../models/Otp.js";
import Setting from "../models/Setting.js";

const DEFAULT_REPAIR_PERMISSIONS = [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.APPLICANTS_VIEW,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT
];

// ============================
// GOOGLE AUTH
export const googleAuth = async (req, res) => {
    try {
        const { access_token } = req.body;

        const googleRes = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        );

        const { email, name, sub } = googleRes.data;

        if (!email) {
            return res.status(400).json({ message: "Google account does not have a verified email." });
        }

        // Case-insensitive search
        let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (user) {
            if (!user.googleId) {
                user.googleId = sub;
            }
            user.lastLogin = new Date();
            await user.save();

            // Check Status - Block if inactive (Admin only check, or global?)
            // Only block admins/superusers if inactive
            if (['admin', 'superadmin', 'superuser'].includes(user.role) && user.status === 'inactive') {
                return res.status(403).json({ message: "Access Denied: Your account has been deactivated." });
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId: sub,
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
                role: "jobseeker",
                permissions: [],
                lastLogin: new Date()
            });
        }

        if (user.role === 'admin' && (!user.permissions || user.permissions.length === 0)) {
            user.permissions = DEFAULT_REPAIR_PERMISSIONS;
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Google Auth Controller Error:", error.message);
        if (error.response) {
            console.error("Google API Response:", error.response.data);
        }
        res.status(500).json({ message: "Google authentication failed", error: error.message });
    }
};

// ============================
// GET CURRENT USER (ME)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ============================
// LINKEDIN AUTH
export const linkedinAuth = async (req, res) => {
    try {
        const { code } = req.body;

        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
        const redirectUri = "http://localhost:5173/linkedin/callback";

        const tokenRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { access_token } = tokenRes.data;

        const userRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { email, name, sub } = userRes.data;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.linkedinId) {
                user.linkedinId = sub;
            }
            user.lastLogin = new Date();
            await user.save();
            // Check Status - Block if inactive
            if (user.role === 'admin' && user.status === 'inactive') {
                return res.status(403).json({ message: "Access Denied: Your account has been deactivated by the administrator." });
            }
        } else {
            user = await User.create({
                name,
                email,
                linkedinId: sub,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                role: "jobseeker",
                permissions: [],
                lastLogin: new Date()
            });
        }

        if (user.role === 'admin' && (!user.permissions || user.permissions.length === 0)) {
            user.permissions = DEFAULT_REPAIR_PERMISSIONS;
            await user.save();
            console.log("Auto-repaired admin permissions");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("LinkedIn Auth Error:", error.response?.data || error.message);
        res.status(500).json({ message: "LinkedIn authentication failed" });
    }
};

// ============================
// REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

// ============================
// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check Status - Block if inactive
        if (user.role === 'admin' && user.status === 'inactive') {
            return res.status(403).json({ message: "Access Denied: Your account has been deactivated by the administrator." });
        }

        // Auto Repair Permissions
        if (user.role === 'admin' && (!user.permissions || user.permissions.length === 0)) {
            user.permissions = DEFAULT_REPAIR_PERMISSIONS;
            await user.save();
            console.log("Auto-repaired admin permissions");
        }

        // Update Last Login
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};

// ============================
// WHATSAPP OTP SYSTEM (PRODUCTION)
// ============================

// SEND OTP
export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone required" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Remove old OTP
        await Otp.deleteMany({ phone });

        // Save new OTP
        await Otp.create({
            phone,
            otpHash: hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min
        });

        // Format phone number for WhatsApp API (remove + or any non-digits)
        const cleanPhone = phone.replace(/\D/g, '');

        let webhookUrl = "https://bot.wabis.in/webhook/whatsapp-workflow/144262.154414.344372.1774953295";
        const webhookSetting = await Setting.findOne({ key: "whatsapp_webhook_url" });
        if (webhookSetting && webhookSetting.value) {
            webhookUrl = webhookSetting.value;
        }

        // 🔥 SEND WHATSAPP MESSAGE
        await axios.post(
            webhookUrl,
            {
                number: cleanPhone,
                otp: otp,
                type: "text",
                message: `TrackPi Verification - Your OTP is: ${otp} - Valid for 5 minutes. Do not share this code.`
            }
        );

        res.status(200).json({
            success: true,
            message: "OTP sent via WhatsApp"
        });

    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone and OTP are required"
            });
        }

        const record = await Otp.findOne({ phone });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        if (record.expiresAt < new Date()) {
            await Otp.deleteOne({ phone });
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        if (record.attempts >= 3) {
            return res.status(400).json({
                success: false,
                message: "Too many attempts. Request a new OTP."
            });
        }

        const isMatch = await bcrypt.compare(otp, record.otpHash);

        if (!isMatch) {
            record.attempts += 1;
            await record.save();
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // OTP Verified Success
        await Otp.deleteOne({ phone });

        // CHECK IF USER EXISTS FOR LOGIN FLOW
        let user = await User.findOne({ phone });

        if (user) {
            // LOGIN USER
            if (user.status === 'inactive') {
                return res.status(403).json({ message: "Access Denied: Your account has been deactivated." });
            }

            user.lastLogin = new Date();
            await user.save();

            const token = jwt.sign(
                { id: user._id, role: user.role, permissions: user.permissions },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone
                }
            });
        } else {
            // NEW USER -> PROMPT REGISTRATION
            return res.status(200).json({
                success: true,
                message: "OTP verified. Please complete registration.",
                action: "register",
                phone: phone // Send back confirmed phone
            });
        }

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "Verification failed"
        });
    }
};
