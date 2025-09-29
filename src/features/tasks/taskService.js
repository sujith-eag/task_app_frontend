import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/tasks/`;


/**
 * Creates a new task for the authenticated user.
 * @route POST /api/tasks/
 * @param {object} taskData - The data for the new task.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the newly created task object.
 */
const createTask = async (taskData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, taskData, config);
    return response.data;
};


/**
 * Creates multiple tasks in a single request (e.g., from the AI planner).
 * @route POST /api/tasks/bulk
 * @param {object} tasksData - An object containing an array of tasks to be created.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of the newly created task objects.
 */
const createBulkTasks = async (tasksData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}bulk`, tasksData, config);
    return response.data;
};


/**
 * Retrieves tasks for the authenticated user, with optional filtering and sorting.
 * @route GET /api/tasks/
 * @param {object} filterData - Optional query parameters for filtering and sorting (e.g., { status: 'Done' }).
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of task objects.
 */
const getTasks = async (filterData = {}, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filterData,
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};


/**
 * Updates an existing task.
 * @route PUT /api/tasks/:taskId
 * @param {string} taskId - The ID of the task to update.
 * @param {object} taskData - The fields of the task to be updated.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated task object.
 */
const updateTask = async (taskId, taskData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + taskId, taskData, config);
    return response.data;
};


/**
 * Deletes a task.
 * @route DELETE /api/tasks/:taskId
 * @param {string} taskId - The ID of the task to delete.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the ID of the deleted task.
 */
const deleteTask = async (taskId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + taskId, config);
    return response.data;
};


// --- SUB-TASK SERVICES ---

/**
 * Adds a new sub-task to a parent task.
 * @route POST /api/tasks/:taskId/subtasks
 * @param {string} taskId - The ID of the parent task.
 * @param {object} subTaskData - The data for the new sub-task (e.g., { text: 'New sub-task' }).
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated parent task object.
 */
const addSubTask = async (taskId, subTaskData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}${taskId}/subtasks`, subTaskData, config);
    return response.data;
};


/**
 * Updates an existing sub-task.
 * @route PUT /api/tasks/:taskId/subtasks/:subTaskId
 * @param {string} taskId - The ID of the parent task.
 * @param {string} subTaskId - The ID of the sub-task to update.
 * @param {object} subTaskData - The fields of the sub-task to update (e.g., { text, completed }).
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated parent task object.
 */
const updateSubTask = async (taskId, subTaskId, subTaskData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}${taskId}/subtasks/${subTaskId}`, subTaskData, config);
    return response.data;
};


/**
 * Deletes a sub-task.
 * @route DELETE /api/tasks/:taskId/subtasks/:subTaskId
 * @param {string} taskId - The ID of the parent task.
 * @param {string} subTaskId - The ID of the sub-task to delete.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated parent task object.
 */
const deleteSubTask = async (taskId, subTaskId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}${taskId}/subtasks/${subTaskId}`, config);
    return response.data;
};


const taskService = {
    createTask,
    createBulkTasks,
    getTasks,
    updateTask,
    deleteTask,
    addSubTask,
    updateSubTask,
    deleteSubTask
};

export default taskService;