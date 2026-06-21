import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import pkg from "multer-storage-cloudinary";

// ─── Helper: Stream buffer to Cloudinary ─────────────────────────────────────
const streamToCloudinary = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        Readable.from(buffer).pipe(stream);
    });
};

// ─── Helper: Build a custom upload middleware ─────────────────────────────────
const buildUploadMiddleware = ({ fieldName, mimeTypes, mimeError, folder, resourceType, getPublicId }) => {
    const memMulter = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
            if (mimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(mimeError), false);
            }
        }
    });

    const middleware = (req, res, next) => {
        console.log(`[Upload] Starting '${fieldName}' upload check...`);
        memMulter.single(fieldName)(req, res, async (err) => {
            if (err) {
                console.error(`[Upload] multer error for '${fieldName}':`, err.message);
                return next(err);
            }
            if (!req.file) {
                console.warn(`[Upload] No file found in request for field '${fieldName}'`);
                return next(); // no file, let controller handle
            }

            console.log(`[Upload] Received file: ${req.file.originalname} (${req.file.size} bytes)`);

            try {
                const publicId = getPublicId ? getPublicId(req) : `${fieldName}_${Date.now()}`;
                console.log(`[Upload] Uploading to Cloudinary folder '${folder}' with ID '${publicId}'...`);

                const result = await streamToCloudinary(req.file.buffer, {
                    folder,
                    resource_type: resourceType || "image",
                    public_id: publicId,
                    type: "upload"
                });

                // Set req.file.path to the secure URL so all controllers work consistently
                req.file.path = result.secure_url;
                console.log(`[Upload] ${fieldName} successfully uploaded: ${result.secure_url}`);
                next();
            } catch (uploadError) {
                console.error(`[Upload] Cloudinary error for '${fieldName}':`, uploadError.message || uploadError);
                next(uploadError);
            }
        });
    };

    // Return object with .single() method to match multer API used in routes
    return { single: () => middleware };
};

// ─── Profile Image Upload ─────────────────────────────────────────────────────
export const profileImageUpload = buildUploadMiddleware({
    fieldName: "profileImage",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    mimeError: "Only image files (JPG, PNG, WEBP) are allowed!",
    folder: "trackpi/profile/images",
    resourceType: "image",
    getPublicId: (req) => `profile_${req.user?.id || "unknown"}_${Date.now()}`
});

// ─── Cover Image Upload ───────────────────────────────────────────────────────
export const coverImageUpload = buildUploadMiddleware({
    fieldName: "coverImage",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    mimeError: "Only image files (JPG, PNG, WEBP) are allowed!",
    folder: "trackpi/profile/covers",
    resourceType: "image",
    getPublicId: (req) => `cover_${req.user?.id || "unknown"}_${Date.now()}`
});

// ─── Resume Upload ────────────────────────────────────────────────────────────
export const resumeUploadMiddleware = buildUploadMiddleware({
    fieldName: "resume",
    mimeTypes: ["application/pdf"],
    mimeError: "Only PDF files are allowed!",
    folder: "trackpi/profile/resumes",
    resourceType: "raw",
    getPublicId: (req) => {
        const user = req.user;
        let prefix = "resume";
        if (user?.name) {
            prefix = user.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
        }
        return `${prefix}_resume_${Date.now()}`;
    }
});

// ─── Testimonial Upload ───────────────────────────────────────────────────────
// Kept as-is since it needs auto resource_type for video support
const testimonialStorage = pkg({
    cloudinary,
    params: {
        folder: "trackpi/testimonials",
        resource_type: "auto",
    },
});

export const uploadTestimonial = multer({
    storage: testimonialStorage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// ─── Competition Upload ──────────────────────────────────────────────────────
export const competitionUpload = buildUploadMiddleware({
    fieldName: "question", // Field name from the frontend form
    mimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
    mimeError: "Only PDF or image files (JPG, PNG, PDF) are allowed!",
    folder: "trackpi/competitions",
    resourceType: "auto", // Automatically detect if PDF (raw) or Image
    getPublicId: (req) => {
        const { name } = req.body;
        const prefix = name ? name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "") : "competition";
        return `${prefix}_question_${Date.now()}`;
    }
});

// ─── Generic upload (memory) ──────────────────────────────────────────────────
export const upload = multer({ storage: multer.memoryStorage() });

// ─── Competition Task Upload ────────────────────────────────────────────────
export const competitionTaskUpload = buildUploadMiddleware({
    fieldName: "taskFile",
    mimeTypes: ["application/pdf"],
    mimeError: "Only PDF files are allowed for task submission!",
    folder: "trackpi/competitions/tasks",
    resourceType: "raw",
    getPublicId: (req) => {
        const { enrollmentId } = req.body;
        return `${enrollmentId || "task"}_${Date.now()}`;
    }
});

export default uploadTestimonial;

