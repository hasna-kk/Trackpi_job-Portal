import axios from 'axios';

/**
 * Fetches location details (City, State, Country) from a Pincode.
 * Uses the free public API: https://api.postalpincode.in/pincode/{pincode}
 * @param {string} pincode - The 6-digit pincode.
 * @returns {Promise<{city: string, state: string, country: string} | null>}
 */
export const fetchLocationDetails = async (pincode) => {
    if (!pincode || pincode.length !== 6) return null;

    try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = response.data;

        if (data && data[0] && data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            return {
                city: postOffice.District, // Using District as City acts as a good default
                state: postOffice.State,
                country: "India" // API is India-specific
            };
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch location from pincode:", error);
        return null;
    }
};
