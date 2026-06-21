import { API_URL as BASE_URL } from "./config";
const API_URL = `${BASE_URL}/api/jobs`;

export const getAllJobs = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const getJobById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
};

export const applyForJob = async (id, formData) => {
    const res = await fetch(`${BASE_URL}/api/applications/${id}/apply`, {
        method: "POST",
        body: formData, // No Content-Type header needed for FormData
    });
    return res.json();
};
