import axios from 'axios';

// Define the base URL for your public API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PUBLIC_API_URL = `${API_BASE_URL}/public/`;

/**
 * Fetches a secure download URL using a public share code.
 * @route /api/public/files/download
 * @param {object} data - The data containing the share code.
 * @param {string} data.code - The 8-character public share code.
 * @returns {Promise<object>} A promise that resolves to an object containing the download URL.
 */
const getPublicDownloadLink = async ({ code }) => {
    const response = await axios.post(`${PUBLIC_API_URL}files/download`, { code });
    return response.data;
};

const publicService = {
    getPublicDownloadLink,
};

export default publicService;