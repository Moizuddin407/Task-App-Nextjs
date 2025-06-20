import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

// Utility to include Authorization header
const getAuthConfig = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Async Thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
});

export const addTask = createAsyncThunk('tasks/addTask', async ({ title, description }) => {
  const response = await axios.post(API_URL, { title, description }, getAuthConfig());
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return id;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, title, description }) => {
  const response = await axios.put(`${API_URL}/${id}`, { title, description }, getAuthConfig());
  return response.data;
});

// Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      })

      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
