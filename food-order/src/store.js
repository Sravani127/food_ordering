// src/store.js

import { configureStore, createSlice } from '@reduxjs/toolkit';


// Define a slice for the loader
const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    isLoading: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

// Export actions
export const { setLoading } = loaderSlice.actions;

// Create the Redux store
export default configureStore({
  reducer: {
    loader: loaderSlice.reducer,
  },
});
