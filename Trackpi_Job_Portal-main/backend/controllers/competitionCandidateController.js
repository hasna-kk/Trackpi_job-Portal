import CompetitionCandidate from "../models/CompetitionCandidate.js";
import CompetitionWinner from "../models/CompetitionWinner.js";

// @desc    Register for a competition
// @route   POST /api/competitions/register
export const registerForCompetition = async (req, res) => {
    try {
        const { name, email, phone, portfolio, role, location, department, competitionId } = req.body;

        // Generate enrollment ID: ENDG + 6 random digits (Ensures higher uniqueness)
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        const enrollmentId = `ENDG${randomDigits}`;

        const candidate = await CompetitionCandidate.create({
            name,
            email,
            phone,
            portfolio,
            department: department || role || "UI/UX Designer",
            location,
            enrollmentId,
            status: "Pending",
            isLive: true,
            competitionId
        });

        res.status(201).json({ success: true, candidate });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all candidates for admin
// @route   GET /api/competitions/candidates
export const getAdminCandidates = async (req, res) => {
    try {
        const candidates = await CompetitionCandidate.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, candidates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update candidate status (Pass/Fail)
// @route   PUT /api/competitions/candidates/:id/status
export const updateCandidateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const candidate = await CompetitionCandidate.findByIdAndUpdate(
            req.params.id,
            {
                status,
                isLive: status === "Pending" ? true : false
            },
            { new: true }
        );
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

        // AUTOMATION: Synchronize with Previous Winners
        if (status === "Pass") {
            // Add to winners if not already there
            const existingWinner = await CompetitionWinner.findOne({ name: candidate.name, department: candidate.department });
            if (!existingWinner) {
                await CompetitionWinner.create({
                    name: candidate.name,
                    department: candidate.department,
                    about: `Successfully completed the competition. Their dedication and hard work have truly paid off.`,
                    isActive: true
                });
            }
        } else {
            // Remove from winners if status is changed back to Pending or Fail
            await CompetitionWinner.deleteOne({ name: candidate.name, department: candidate.department });
        }

        res.status(200).json({ success: true, candidate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete multiple candidates
// @route   POST /api/competitions/candidates/bulk-delete
export const bulkDeleteCandidates = async (req, res) => {
    try {
        const { ids } = req.body;
        await CompetitionCandidate.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: "Candidates deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Toggle live status
// @route   PUT /api/competitions/candidates/:id/toggle-live
export const toggleLiveStatus = async (req, res) => {
    try {
        const candidate = await CompetitionCandidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

        candidate.isLive = !candidate.isLive;
        await candidate.save();

        res.status(200).json({ success: true, candidate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// @desc    Submit a task for a competition
// @route   POST /api/competitions/submit-task
export const submitTask = async (req, res) => {
    try {
        let { enrollmentId } = req.body;
        if (enrollmentId) enrollmentId = enrollmentId.trim().toUpperCase();

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a PDF file" });
        }

        const candidate = await CompetitionCandidate.findOne({ enrollmentId });

        if (!candidate) {
            return res.status(404).json({ success: false, message: "Invalid Enrollment ID" });
        }

        candidate.taskUrl = req.file.path;
        candidate.status = "Pending"; // Reset status if they resubmit? Or keep as is.
        await candidate.save();

        res.status(200).json({ success: true, message: "Task submitted successfully", candidate });
    } catch (error) {
        console.error("Task submission error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
// @desc    Log in with enrollment ID
// @route   POST /api/competitions/login
export const loginCandidate = async (req, res) => {
    try {
        let { enrollmentId } = req.body;
        if (enrollmentId) enrollmentId = enrollmentId.trim().toUpperCase();
        const candidate = await CompetitionCandidate.findOne({ enrollmentId });

        if (!candidate) {
            return res.status(404).json({ success: false, message: "Invalid Enrollment ID. Please check and try again." });
        }

        if (!candidate.isLive && candidate.status === "Pending") {
            return res.status(403).json({ success: false, message: "This enrollment code has expired and is no longer valid for the current process." });
        }

        res.status(200).json({ success: true, candidate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get candidate status by enrollment ID
// @route   GET /api/competitions/status/:enrollmentId
export const getCandidateStatus = async (req, res) => {
    try {
        const candidate = await CompetitionCandidate.findOne({ enrollmentId: req.params.enrollmentId });
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });
        res.status(200).json({ success: true, status: candidate.status });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
