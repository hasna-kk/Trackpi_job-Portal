import Language from "../models/Language.js";

// @desc    Search languages
// @route   GET /api/languages/search
// @access  Public
export const searchLanguages = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query === "") {
            // Return popular/default languages if no query
            const defaultLanguages = ["English", "Malayalam", "Hindi", "Tamil", "Telugu", "Kannada", "Marathi"];
            // Find these specific ones to return first
            const languages = await Language.find({
                name: { $in: defaultLanguages }
            }).select('name');

            // Just return these for now as "Popular" defaults
            const languageNames = languages.map(lang => lang.name);
            // Ensure the order matches somewhat if possible, or just return found
            const orderedNames = defaultLanguages.filter(d => languageNames.includes(d));
            return res.json(orderedNames);
        }

        // Perform a regex search (case-insensitive)
        const languages = await Language.find({
            name: { $regex: query, $options: 'i' }
        })
            .limit(20)
            .select('name');

        const languageNames = languages.map(lang => lang.name);

        res.json(languageNames);
    } catch (error) {
        console.error('Search Languages Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
