/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

const API = "/tasks";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  userId: string;
  assignedToId: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string }
>("tasks/fetchTasks", async (_, thunkAPI) => {
  try {
    const res = await api.get(API);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch tasks",
    );
  }
});

export const createTask = createAsyncThunk<
  Task,
  Partial<Task>,
  { rejectValue: string }
>("tasks/createTask", async (data, thunkAPI) => {
  try {
    const res = await api.post(API, data);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Task creation failed",
    );
  }
});

export const updateTaskStatus = createAsyncThunk<
  Task,
  { id: string; status: string },
  { rejectValue: string }
>("tasks/updateStatus", async ({ id, status }, thunkAPI) => {
  try {
    const res = await api.patch(`${API}/${id}/status`, { status });
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Update failed",
    );
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching tasks";
      })

      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })

      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Task creation failed";
      })

      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id,
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Update failed";
      });
  },
});

export default taskSlice.reducer;
