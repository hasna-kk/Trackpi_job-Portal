import Setting from "../models/Setting.js";

// @desc    Get all settings
// @route   GET /api/settings
// @access  Admin
export const getSettings = async (req, res) => {
    try {
        const settings = await Setting.find({});
        res.status(200).json(settings);
    } catch (error) {
        console.error("Get Settings Error:", error);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

// @desc    Update a specific setting
// @route   PUT /api/settings/:key
// @access  Admin
export const updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        if (!value) {
            return res.status(400).json({ message: "Value is required" });
        }

        const setting = await Setting.findOneAndUpdate(
            { key },
            { value },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.status(200).json({
            message: "Setting updated successfully",
            setting
        });
    } catch (error) {
        console.error("Update Setting Error:", error);
        res.status(500).json({ message: "Failed to update setting" });
    }
};
