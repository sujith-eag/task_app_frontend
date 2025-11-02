import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import taskService from './taskService.js'
import { generateTasksWithAI, saveAIPlan } from '../ai/aiTaskSlice.js';


const initialState = {
  tasks: [],
  pendingDeletions: [],
  lastDeletedTask: null,
  lastDeletedSubTask: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isCreating: false,
  message: '',
}


// --- CORE TASK THUNKS ---

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      return await taskService.createTask(taskData)
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
      return await taskService.getTasks(filterData)
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
      return await taskService.updateTask(taskId, taskData)
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
      return await taskService.deleteTask(id)
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
      return await taskService.addSubTask(taskId, subTaskData)
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
      return await taskService.updateSubTask(taskId, subTaskId, subTaskData)
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
      return await taskService.deleteSubTask(taskId, subTaskId)
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

    addTaskOptimistic: (state, action) => {
      const { user, taskData } = action.payload;
      const tempTask = {
        ...taskData,
        _id: `temp_${Date.now()}`, // Create a temporary ID
        user: { _id: user._id, name: user.name }, // Use user data
        // status: 'To Do',
        subTasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.unshift(tempTask); // Add to the top of the list
    },
    
    // Storing before removing    
    removeTaskOptimistic: (state, action) => {
      const taskId = action.payload;
      const taskIndex = state.tasks.findIndex((t) => t._id === taskId);
      if (taskIndex !== -1) {
        const [deletedTask] = state.tasks.splice(taskIndex, 1);        
        // state.lastDeletedTask = state.tasks[taskIndex];
        state.pendingDeletions.push(deletedTask);
        // state.tasks.splice(taskIndex, 1);
      }
    },
        // New reducer to handle the "Undo" action
      undoDeleteTask: (state, action) => {
        const taskId = action.payload;
        const taskIndex = state.pendingDeletions.findIndex((t) => t._id === taskId);
        if (taskIndex !== -1) {
          const [restoredTask] = state.pendingDeletions.splice(taskIndex, 1);
          state.tasks.unshift(restoredTask);
      }
    },
    
    
    // OPTIMISTIC REDUCER FOR SUB TASK TOGGLE
    toggleSubTaskOptimistic: (state, action) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.tasks.find((t) => t._id === taskId);
      if (task) {
        const subTask = task.subTasks.find((sub) => sub._id === subTaskId);
        if (subTask) subTask.completed = !subTask.completed;
      }
    },
    // OPTIMISTIC REDUCER FOR SUB Task DELETION
    removeSubTaskOptimistic: (state, action) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.tasks.find((t) => t._id === taskId);
      if (task) {
        const subTaskIndex = task.subTasks.findIndex((sub) => sub._id === subTaskId);
          if (subTaskIndex !== -1) {
            state.lastDeletedSubTask = {
              taskIndex: state.tasks.findIndex(t => t._id === taskId),
              subTask: task.subTasks[subTaskIndex]
            };
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
      .addCase(createTask.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isCreating = false;
        state.isSuccess = true;
          // Find the temporary task and replace it with the real one from the server
        const index = state.tasks.findIndex((t) => t._id.startsWith('temp_'));
        if (index !== -1) {
          state.tasks[index] = action.payload;
        } else {
          state.tasks.unshift(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isCreating = false;
        state.isError = true;
        state.message = action.payload;
        // If creation failed, remove the temporary task
        state.tasks = state.tasks.filter((t) => !t._id.startsWith('temp_'));        
      })


      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        // ONLY action that controls the main isLoading flag
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // If payload is undefined (e.g., network/cache returned no body), do not
        // overwrite existing tasks — keep previous list. Otherwise normalize both
        // array and wrapped ({ tasks: [...] }) shapes.
        if (typeof action.payload === 'undefined') {
          return;
        }
        if (Array.isArray(action.payload)) {
          state.tasks = action.payload;
        } else if (action.payload && Array.isArray(action.payload.tasks)) {
          state.tasks = action.payload.tasks;
        } else {
          // Fallback to an empty array to avoid runtime errors in components
          state.tasks = [];
        }
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
          Object.assign(state.tasks[index], action.payload);
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const taskId = action.meta.arg;
        state.pendingDeletions = state.pendingDeletions.filter(t => t._id !== taskId);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        const taskId = action.meta.arg;
        const taskIndex = state.pendingDeletions.findIndex((t) => t._id === taskId);
        if (taskIndex !== -1) {
          const [restoredTask] = state.pendingDeletions.splice(taskIndex, 1);
          state.tasks.unshift(restoredTask);
        }
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // CASES FOR SUB-TASKS
      .addCase(addSubTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          Object.assign(state.tasks[index], action.payload);
        }
        state.lastDeletedSubTask=null;
      })
      .addCase(addSubTask.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;

        if (state.lastDeletedSubTask) {
          const { taskIndex, subTask } = state.lastDeletedSubTask;
          if (state.tasks[taskIndex]) {
            state.tasks[taskIndex].subTasks.push(subTask);
          }
          state.lastDeletedSubTask = null;
        }

        const { taskId, subTaskData } = action.meta.arg;
        const task = state.tasks.find((t) => t._id === taskId);
        if (task) {
          task.subTasks = task.subTasks.filter(sub => !sub._id.startsWith('temp_'));
        }
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
          Object.assign(state.tasks[index], action.payload);
        }
        state.lastDeletedSubTask = null;
      })
      .addCase(deleteSubTask.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        if (state.lastDeletedSubTask) {
          const { taskIndex, subTask } = state.lastDeletedSubTask;
          if (state.tasks[taskIndex]) {
            state.tasks[taskIndex].subTasks.push(subTask);
          }
          state.lastDeletedSubTask = null;
        }
      })


      
      // When the AI generation succeeds, add the new tasks to this slice's state
      .addCase(generateTasksWithAI.fulfilled, (state, action) => {
          state.tasks.unshift(...action.payload);
        })
      .addCase(saveAIPlan.fulfilled, (state, action) => {
        // Add the new array of tasks from the payload to the main task list
          state.tasks.unshift(...action.payload);
          state.status = 'succeeded';
        })
        
        
      ;
    },
});

export const {
  reset,
  addTaskOptimistic,
  removeTaskOptimistic,
  undoDeleteTask,
  toggleSubTaskOptimistic,
  addSubTaskOptimistic,
  removeSubTaskOptimistic,
} = taskSlice.actions;

export default taskSlice.reducer;
