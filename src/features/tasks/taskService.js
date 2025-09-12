import axios from 'axios'

// const API_URL = '/api/tasks/'
const API_URL = 'https://task-app-backend-8j57.onrender.com/api/tasks/'


// Create a new task
const createTask = async (taskData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, taskData, config)
  return response.data
}


// Get user tasks (now with filtering and sorting)
const getTasks = async (filterData = {}, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Pass filter data as URL query parameters
    params: filterData,
  }
  const response = await axios.get(API_URL, config)
  return response.data
}

// Update a user task
const updateTask = async (taskId, taskData, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.put(API_URL + taskId, taskData, config)
    return response.data
}

// Delete a user task
const deleteTask = async (taskId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.delete(API_URL + taskId, config)
  return response.data
}

// --- SUB-TASK SERVICES ---

// Add a sub-task to a task
const addSubTask = async (taskId, subTaskData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.post(`${API_URL}${taskId}/subtasks`, subTaskData, config)
    return response.data
}

// Update a sub-task
const updateSubTask = async (taskId, subTaskId, subTaskData, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.put(`${API_URL}${taskId}/subtasks/${subTaskId}`, subTaskData, config)
    return response.data
}

// Delete a sub-task
const deleteSubTask = async (taskId, subTaskId, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete(`${API_URL}${taskId}/subtasks/${subTaskId}`)
    return response.data
}


const taskService = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  addSubTask,
  updateSubTask,
  deleteSubTask
}

export default taskService