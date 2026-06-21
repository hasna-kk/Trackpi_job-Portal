import Skill from "../models/Skill.js";

// @desc    Search skills
// @route   GET /api/skills/search
// @access  Public
export const searchSkills = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        // Perform a regex search (case-insensitive)
        // Limit results to 20 for performance
        const skills = await Skill.find({
            name: { $regex: query, $options: 'i' }
        })
            .limit(20)
            .select('name');

        const skillNames = skills.map(skill => skill.name);

        res.json(skillNames);
    } catch (error) {
        console.error('Search Skills Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
