import express from "express";
import * as educationController from "../controllers/educationController.js";

const router = express.Router();

router.get("/courses", educationController.searchCourses);
router.get("/universities", educationController.searchUniversities);

export default router;
