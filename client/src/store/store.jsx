// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/Api';
import userReducer from './userSlice.jsx'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    loginUser:userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
