import express from "express";
import { searchSkills } from "../controllers/skillController.js";

const router = express.Router();

router.get('/search', searchSkills);

export default router;
