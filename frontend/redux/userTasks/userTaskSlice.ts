/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/tasks";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface UserTaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: UserTaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchUserTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string }
>("userTasks/fetchUserTasks", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API}/my-tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch tasks"
    );
  }
});

export const updateUserTaskStatus = createAsyncThunk<
  Task,
  { taskId: number; status: string },
  { rejectValue: string }
>(
  "userTasks/updateUserTaskStatus",
  async ({ taskId, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${API}/${taskId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

const userTaskSlice = createSlice({
  name: "userTasks",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching tasks";
      })

      .addCase(updateUserTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export default userTaskSlice.reducer;