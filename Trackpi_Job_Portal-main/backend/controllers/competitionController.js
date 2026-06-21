import Competition from "../models/Competition.js";

// @desc    Create a new competition
// @route   POST /api/competitions
// @access  Private (Admin with COMPETITION_ADD permission)
export const createCompetition = async (req, res) => {
    try {
        const { name, department, startDate, endDate, status } = req.body;
        const questionUrl = req.file ? req.file.path : null;

        const competition = await Competition.create({
            name,
            department,
            startDate,
            endDate,
            questionUrl,
            status: status || "live"
        });

        res.status(201).json({ success: true, competition });
    } catch (error) {
        console.error("Error creating competition:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all competitions
// @route   GET /api/competitions
// @access  Private (Admin with COMPETITION_VIEW permission)
export const getCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, competitions });
    } catch (error) {
        console.error("Error fetching competitions:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a competition
// @route   DELETE /api/competitions/:id
// @access  Private (Admin with COMPETITION_EDIT/DELETE permission)
export const deleteCompetition = async (req, res) => {
    try {
        const { id } = req.params;
        const competition = await Competition.findByIdAndDelete(id);
        if (!competition) {
            return res.status(404).json({ success: false, message: "Competition not found" });
        }
        res.status(200).json({ success: true, message: "Competition deleted successfully" });
    } catch (error) {
        console.error("Error deleting competition:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCompetition = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, startDate, endDate, status } = req.body;
        const updateData = { name, department, startDate, endDate, status };
        if (req.file) updateData.questionUrl = req.file.path;

        const competition = await Competition.findByIdAndUpdate(id, updateData, { new: true });
        if (!competition) {
            return res.status(404).json({ success: false, message: "Competition not found" });
        }
        res.status(200).json({ success: true, competition });
    } catch (error) {
        console.error("Error updating competition:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get active competition for public countdown
// @route   GET /api/competitions/active
// @access  Public
export const getActiveCompetition = async (req, res) => {
    try {
        const { department } = req.query;
        const now = new Date();
        let query = { 
            status: "live",
            endDate: { $gte: now } 
        };
        
        if (department) {
            // Find competition matching the candidate's department
            query.department = new RegExp(department, 'i');
        }

        // Find the most recently created 'live' competition that matches the criteria
        let competition = await Competition.findOne(query).sort({ startDate: 1 });
        
        if (!competition) {
            // Fallback: If no specific competition, find any live one
            competition = await Competition.findOne({ status: "live" }).sort({ startDate: 1 });
        }

        if (competition) {
            // Ensure the endDate is at the end of the day (23:59:59) for proper countdown
            const end = new Date(competition.endDate);
            end.setHours(23, 59, 59, 999);
            
            // Convert to a plain object to modify
            const compObj = competition.toObject();
            compObj.endDate = end;
            
            return res.status(200).json({ success: true, competition: compObj });
        }
        
        // Final fallback if nothing found
        return res.status(200).json({ 
            success: true, 
            isFallback: true,
            message: "No active competition found, using default timer" 
        });
    } catch (error) {
        console.error("Error fetching active competition:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
