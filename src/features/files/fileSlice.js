import { createSlice } from '@reduxjs/toolkit';

// Slimmed down files slice: keep only client-side UI state.
const initialState = {
  message: '',
  currentParentId: null,
  currentFolder: null,
  breadcrumbs: [],
  isSharedContext: false, // true when viewing a shared folder (not owned by current user)
  shareRootId: null, // ID of the topmost shared folder for back navigation
};

// Simple selectors for the UI state
export const selectCurrentParentId = (state) => state.files.currentParentId;
export const selectCurrentFolder = (state) => state.files.currentFolder;
export const selectBreadcrumbs = (state) => state.files.breadcrumbs;
export const selectIsSharedContext = (state) => state.files.isSharedContext;
export const selectShareRootId = (state) => state.files.shareRootId;

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
    setIsSharedContext: (state, action) => {
      state.isSharedContext = action.payload;
    },
    setShareRootId: (state, action) => {
      state.shareRootId = action.payload;
    },
  },
});

export const { resetFileStatus, setCurrentParentId, setCurrentFolder, setBreadcrumbs, setIsSharedContext, setShareRootId } = fileSlice.actions;
export default fileSlice.reducer;