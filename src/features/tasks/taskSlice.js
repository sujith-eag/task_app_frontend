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
    reset: () => initialState,
    
    // OPTIMISTIC REDUCER FOR TASK TOGGLE
    toggleSubTaskOptimistic: (state, action) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.tasks.find((t) => t._id === taskId);
      if (task) {
        const subTask = task.subTasks.find((sub) => sub._id === subTaskId);
        if (subTask) subTask.completed = !subTask.completed;
      }
    },
    // OPTIMISTIC REDUCER FOR DELETION
    removeSubTaskOptimistic: (state, action) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.tasks.find((t) => t._id === taskId);
      if (task) {
        const subTaskIndex = task.subTasks.findIndex((sub) => sub._id === subTaskId);
          if (subTaskIndex !== -1) {
            task.subTasks.splice(subTaskIndex, 1);
          }
        }
      },
    
    // OPTIMISTIC REDUCER FOR ADDING
    addSubTaskOptimistic: (state, action) => {
      const { taskId, subTaskData } = action.payload;
      const task = state.tasks.find((t) => t._id === taskId);
      if (task) {
        // Create a temporary sub-task object. The server will replace this with the real one.
        // We use Date.now() to create a temporary, unique key for React.
        const tempSubTask = { ...subTaskData, _id: `temp_${Date.now()}`, completed: false };
        task.subTasks.push(tempSubTask);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Cases for core tasks
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })


      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })


      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          const existing = state.tasks[index];
          Object.assign(existing, action.payload);
          // state.tasks[index] = action.payload;
        }
      })


      .addCase(deleteTask.pending, (state) => { // Reordered for clarity
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.tasks.findIndex((task) => task._id === action.payload.id);
        if (index !== -1) {
          state.tasks.splice(index, 1);
        }
      })

      // CASES FOR SUB-TASKS
// When the API call succeeds, the server returns the updated parent task,
// which replaces the task with the temporary sub-task.
      .addCase(addSubTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          // state.tasks[index] = action.payload;
          const existing = state.tasks[index];
          Object.assign(existing, action.payload);
        }
      })
      .addCase(addSubTask.rejected, (state, action) => {
        const { taskId, subTaskData } = action.meta.arg;
        const task = state.tasks.find((t) => t._id === taskId);
        // Remove the temporary sub-task that failed to save
        if (task) {
          task.subTasks = task.subTasks.filter(sub => !sub._id.startsWith('temp_'));
        }
        state.isError = true;
        state.message = action.payload;
      })

      
      .addCase(updateSubTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          // state.tasks[index] = action.payload;
          const existing = state.tasks[index];
          Object.assign(existing, action.payload);
        }
      })
      .addCase(updateSubTask.rejected, (state, action) => {
        const { taskId, subTaskId } = action.meta.arg;
        const task = state.tasks.find((task) => task._id === taskId);
        if (task) {
          const subTask = task.subTasks.find((sub) => sub._id === subTaskId);
          if (subTask) {
            subTask.completed = !subTask.completed; // Flip it back
          }
        }
        state.isError = true;
        state.message = action.payload;
      })

      
      .addCase(deleteSubTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          // state.tasks[index] = action.payload;
          const existing = state.tasks[index];
          Object.assign(existing, action.payload);
        }
      })
      .addCase(deleteSubTask.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        // Logic to revert is complex, so we'll just re-fetch the list for now.
        // This is a simple and effective way to handle the error case.
      });
    },
});

export const { reset, toggleSubTaskOptimistic, removeSubTaskOptimistic, addSubTaskOptimistic } = taskSlice.actions;
export default taskSlice.reducer;
