import Course from "../models/Course.js";
import University from "../models/University.js";
import axios from "axios";

export const searchCourses = async (req, res) => {
    try {
        const { query, level } = req.query;
        let filter = {};

        if (level) {
            filter.level = level;
        }

        if (query) {
            const regex = new RegExp(query, "i"); // case-insensitive fuzzy search
            filter.name = { $regex: regex };
        }

        // Fetch ONLY from real DB
        const courses = await Course.find(filter)
            .limit(20)
            .select("name level");

        // Return empty array if not found (No fake data)
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error searching courses:", error);
        // Resilience: Return empty array on error instead of 500
        res.status(200).json([]);
    }
};

export const searchUniversities = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(200).json([]);
        }

        // 1. Local DB Search (Fastest) in parallel with Hipolabs
        const [localResults, hipolabsResults] = await Promise.allSettled([
            University.find({ name: { $regex: new RegExp(query, "i") } })
                .limit(10)
                .select("name domain")
                .lean(),

            axios.get(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`, { timeout: 5000 })
        ]);

        let results = [];

        // Add Local Results
        if (localResults.status === 'fulfilled') {
            results.push(...localResults.value.map(d => ({ name: d.name, domain: d.domain || null })));
        }

        // Add Hipolabs Results
        if (hipolabsResults.status === 'fulfilled') {
            const apiData = hipolabsResults.value.data.slice(0, 20).map(u => ({
                name: u.name,
                domain: u.domains?.[0] || null
            }));
            results.push(...apiData);
        }

        // Deduplicate by name
        const uniqueResults = [];
        const seenNames = new Set();

        for (const item of results) {
            const normalized = item.name.trim().toLowerCase();
            if (!seenNames.has(normalized)) {
                seenNames.add(normalized);
                uniqueResults.push(item);
            }
        }

        // Ensure "Other" is NOT in the backend response (Frontend handles injection)
        // But if we wanted to be safe we could, but let's stick to returning valid unis.

        res.status(200).json(uniqueResults.slice(0, 50));

    } catch (error) {
        console.error("Error searching institutions:", error.message);
        // Return empty array on critical failure to prevent frontend crash
        res.status(200).json([]);
    }
};
