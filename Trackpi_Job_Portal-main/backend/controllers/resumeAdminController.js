import ResumeCandidate from "../models/ResumeCandidate.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import https from "https";

// Get paginated active resume candidates
export const getResumeCandidates = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const candidates = await ResumeCandidate.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ResumeCandidate.countDocuments(query);

        res.status(200).json({
            success: true,
            data: candidates,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching resume candidates:", error);
        res.status(500).json({ success: false, message: "Server Error fetching candidates" });
    }
};

// Delete multiple (or single) resume candidates
export const deleteResumeCandidates = async (req, res) => {
    try {
        const { ids } = req.body; // Expect an array of IDs

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "No IDs provided for deletion" });
        }

        // Fetch candidates to get Cloudinary IDs
        const candidates = await ResumeCandidate.find({ _id: { $in: ids } });

        if (candidates.length === 0) {
            return res.status(404).json({ success: false, message: "No candidates found to delete" });
        }

        // Delete from Cloudinary
        for (const candidate of candidates) {
            if (candidate.cloudinaryId) {
                try {
                    await cloudinary.uploader.destroy(candidate.cloudinaryId, { resource_type: "raw" }); // PDFs are raw/image depending on upload
                } catch (cloudinaryError) {
                    console.error(`Failed to delete Cloudinary file ${candidate.cloudinaryId}:`, cloudinaryError);
                    // Decide if you want to fail the whole delete or just skip if cloudinary fails. Usually continue.
                }
            }
        }

        // Delete from DB
        await ResumeCandidate.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ success: true, message: `Successfully deleted ${candidates.length} candidates` });
    } catch (error) {
        console.error("Error deleting resume candidates:", error);
        res.status(500).json({ success: false, message: "Server Error deleting candidates" });
    }
};

// Download a resume candidate PDF by proxying the Cloudinary URL
export const downloadResumeCandidate = async (req, res) => {
    try {
        const candidate = await ResumeCandidate.findById(req.params.id);
        if (!candidate || !candidate.cloudinaryUrl) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        // Clean any fl_attachment transforms or double slashes that might cause 401 Unauthorized
        let fetchUrl = candidate.cloudinaryUrl;
        fetchUrl = fetchUrl.replace('/fl_attachment/', '/');
        fetchUrl = fetchUrl.replace('/upload//v', '/upload/v');

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/pdf,*/*'
            }
        };

        const handleDownload = (requestUrl) => {
            https.get(requestUrl, options, (cloudinaryRes) => {
                // Cloudinary sometimes issues 302 redirects for raw files
                if (cloudinaryRes.statusCode >= 300 && cloudinaryRes.statusCode < 400 && cloudinaryRes.headers.location) {
                    return handleDownload(cloudinaryRes.headers.location);
                }

                if (cloudinaryRes.statusCode !== 200) {
                    console.error(`Cloudinary returned ${cloudinaryRes.statusCode} for url ${requestUrl}`);
                    return res.status(500).json({ success: false, message: `Cloudinary returned ${cloudinaryRes.statusCode}` });
                }

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${candidate.name || 'Resume'}_Candidate.pdf"`);

                cloudinaryRes.pipe(res);

            }).on('error', (e) => {
                console.error("HTTPS GET Error:", e);
                res.status(500).json({ success: false, message: "Failed to stream download" });
            });
        };

        handleDownload(fetchUrl);

    } catch (error) {
        console.error("Error downloading resume:", error.message);
        res.status(500).json({ success: false, message: "Failed to download resume" });
    }
};
