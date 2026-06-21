import express from "express";
import { getSettings, updateSetting } from "../controllers/settingController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

router.get("/", protect, checkPermission(PERMISSIONS.SETTINGS_MANAGE), getSettings);
router.put("/:key", protect, checkPermission(PERMISSIONS.SETTINGS_MANAGE), updateSetting);

export default router;
