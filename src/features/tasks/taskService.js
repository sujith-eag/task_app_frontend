import apiClient from '../../app/apiClient.js';

const API_URL = '/tasks/';


/**
 * Creates a new task for the authenticated user.
 * @route POST /api/tasks/
 * @param {object} taskData - The data for the new task.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the newly created task object.
 */
const createTask = async (taskData) => {
    const response = await apiClient.post(API_URL, taskData);
    return response.data;
};


/**
 * Creates multiple tasks in a single request (e.g., from the AI planner).
 * @route POST /api/tasks/bulk
 * @param {object} tasksData - An object containing an array of tasks to be created.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of the newly created task objects.
 */
const createBulkTasks = async (tasksData) => {
    const response = await apiClient.post(`${API_URL}bulk`, tasksData);
    return response.data;
};


/**
 * Retrieves tasks for the authenticated user, with optional filtering and sorting.
 * @route GET /api/tasks/
 * @param {object} filterData - Optional query parameters for filtering and sorting (e.g., { status: 'Done' }).
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of task objects.
 */
const getTasks = async (filterData = {}) => {
    const response = await apiClient.get(API_URL, { params: filterData });
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
const updateTask = async (taskId, taskData) => {
    const response = await apiClient.put(API_URL + taskId, taskData);
    return response.data;
};


/**
 * Deletes a task.
 * @route DELETE /api/tasks/:taskId
 * @param {string} taskId - The ID of the task to delete.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the ID of the deleted task.
 */
const deleteTask = async (taskId) => {
    const response = await apiClient.delete(API_URL + taskId);
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
const addSubTask = async (taskId, subTaskData) => {
    const response = await apiClient.post(`${API_URL}${taskId}/subtasks`, subTaskData);
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
const updateSubTask = async (taskId, subTaskId, subTaskData) => {
    const response = await apiClient.put(`${API_URL}${taskId}/subtasks/${subTaskId}`, subTaskData);
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
const deleteSubTask = async (taskId, subTaskId) => {
    const response = await apiClient.delete(`${API_URL}${taskId}/subtasks/${subTaskId}`);
    return response.data;
};

/**
 * Retrieves a single task by ID.
 * @route GET /api/tasks/:id
 * @param {string} taskId - The ID of the task to retrieve.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} The task object.
 */
const getTask = async (taskId) => {
    const response = await apiClient.get(`${API_URL}${taskId}`);
    return response.data;
};

/**
 * Retrieves task statistics for the authenticated user.
 * @route GET /api/tasks/stats
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} An object containing task stats (counts by status, etc.).
 */
const getTaskStats = async () => {
    const response = await apiClient.get(`${API_URL}stats`);
    return response.data;
};

/**
 * Retrieves subtask completion statistics for a specific task.
 * @route GET /api/tasks/:id/subtasks/stats
 * @param {string} taskId - The task id to fetch subtask stats for.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} An object containing subtask counts and completion percentage.
 */
const getSubTaskStats = async (taskId) => {
    const response = await apiClient.get(`${API_URL}${taskId}/subtasks/stats`);
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
    ,getTask,
    getTaskStats,
    getSubTaskStats
};

export default taskService;