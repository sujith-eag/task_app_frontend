import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/teacher/`;

// Get the necessary data to populate the class creation form
const getClassCreationData = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'class-creation-data', config);
    return response.data;
};

// Create a new class session
const createClassSession = async (sessionData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'class-sessions', sessionData, config);
    return response.data;
};

// Get a history of the teacher's past sessions
const getTeacherSessionsHistory = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'class-sessions', config);
    return response.data;
};

const teacherService = {
    getClassCreationData,
    createClassSession,
    getTeacherSessionsHistory,
};

export default teacherService;