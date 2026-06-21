import express from 'express';
import { applyForJob, getAppliedJobs } from '../controllers/applicationController.js';
import { resumeUploadMiddleware } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All applications are now handled via Cloudinary middleware
router.post('/:jobId/apply', resumeUploadMiddleware.single('resume'), applyForJob);

// Alias for singular (in case frontend uses it)
router.post('/application/:jobId/apply', resumeUploadMiddleware.single('resume'), applyForJob);

router.get('/my-applications', protect, getAppliedJobs);

export default router;
