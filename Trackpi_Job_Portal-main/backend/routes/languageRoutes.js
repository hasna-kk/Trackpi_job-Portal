import express from "express";
import { searchLanguages } from "../controllers/languageController.js";

const router = express.Router();

router.get('/search', searchLanguages);

export default router;
