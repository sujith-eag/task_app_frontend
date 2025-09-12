import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import taskService from './taskService.js'

const initialState = {
  tasks: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}


// --- CORE TASK THUNKS ---

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await taskService.createTask(taskData, token)
    } catch (error) {
      const message =(
	      error.response?.data?.message || error.message || error.toString() )
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (filterData, thunkAPI) => { // Now accepts filterData
    try {
      const token = thunkAPI.getState().auth.user.token
      return await taskService.getTasks(filterData, token)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, taskData }, thunkAPI) => { // Accepts taskId and taskData
    try {
      const token = thunkAPI.getState().auth.user.token
      return await taskService.updateTask(taskId, taskData, token)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await taskService.deleteTask(id, token)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// --- SUB-TASK THUNKS ---

export const addSubTask = createAsyncThunk(
  'tasks/addSubTask',
  async ({ taskId, subTaskData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await taskService.addSubTask(taskId, subTaskData, token)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateSubTask = createAsyncThunk(
  'tasks/updateSubTask',
  async ({ taskId, subTaskId, subTaskData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await taskService.updateSubTask(taskId, subTaskId, subTaskData, token)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const deleteSubTask = createAsyncThunk(
  'tasks/deleteSubTask',
  async ({ taskId, subTaskId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await taskService.deleteSubTask(taskId, subTaskId, token)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)


export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Cases for core tasks
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tasks.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tasks = action.payload
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        // Find the task and replace it with the updated one
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        )
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload.id
        )
      })
      // Cases for sub-tasks
      // Note: All sub-task operations return the full parent task.
      // So, the logic is the same as updating a task.
      .addCase(addSubTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        )
      })
      .addCase(updateSubTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        )
      })
      .addCase(deleteSubTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        )
      })
  },
})

export const { reset } = taskSlice.actions
export default taskSlice.reducer