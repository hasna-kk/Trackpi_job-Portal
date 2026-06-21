import Video from "../models/Video.js";
import cloudinary from "../config/cloudinary.js";

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = "auto") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// Helper: Delete from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = "auto") => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
    }
};

// @desc    Get all background videos for departments
// @route   GET /api/videos
// @access  Private (Admin)
export const getVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: videos.length, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new video for a department
// @route   POST /api/videos/admin
// @access  Private (Admin with VIDEO_ADD permission)
export const createVideo = async (req, res) => {
    try {
        const { department } = req.body;
        
        // Ensure only one video per department?
        const existing = await Video.findOne({ department });
        if (existing) {
            return res.status(400).json({ success: false, message: "A video for this department already exists. Please update the existing one." });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a video file" });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, "competition_videos", "video");

        const video = await Video.create({
            department,
            video: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });

        res.status(201).json({ success: true, data: video });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a department video
// @route   PUT /api/videos/admin/:id
// @access  Private (Admin with VIDEO_EDIT permission)
export const updateVideo = async (req, res) => {
    try {
        const { department } = req.body;
        const videoEntry = await Video.findById(req.params.id);

        if (!videoEntry) {
            return res.status(404).json({ success: false, message: "Video entry not found" });
        }

        const updateData = {};
        if (department) updateData.department = department;

        if (req.file) {
            // Delete old video
            await deleteFromCloudinary(videoEntry.video.publicId, "video");
            
            // Upload new
            const result = await uploadToCloudinary(req.file.buffer, "competition_videos", "video");
            updateData.video = {
                url: result.secure_url,
                publicId: result.public_id
            };
        }

        const updated = await Video.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a department video
// @route   DELETE /api/videos/admin/:id
// @access  Private (Admin with VIDEO_DELETE permission)
export const deleteVideo = async (req, res) => {
    try {
        const videoEntry = await Video.findById(req.params.id);
        if (!videoEntry) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        await deleteFromCloudinary(videoEntry.video.publicId, "video");
        await Video.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
