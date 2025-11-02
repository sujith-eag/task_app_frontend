import { createSlice } from '@reduxjs/toolkit';

// Slimmed down files slice: keep only client-side UI state.
const initialState = {
  message: '',
  currentParentId: null,
  currentFolder: null,
  breadcrumbs: [],
};

// Simple selectors for the UI state
export const selectCurrentParentId = (state) => state.files.currentParentId;
export const selectCurrentFolder = (state) => state.files.currentFolder;
export const selectBreadcrumbs = (state) => state.files.breadcrumbs;

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    resetFileStatus: (state) => {
      state.message = '';
    },
    setCurrentParentId: (state, action) => {
      state.currentParentId = action.payload;
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload || [];
    },
  },
});

export const { resetFileStatus, setCurrentParentId, setCurrentFolder, setBreadcrumbs } = fileSlice.actions;
export default fileSlice.reducer;