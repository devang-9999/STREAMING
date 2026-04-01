/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Notification {
  id: number;
  message: string;
  type: "SCHEDULED" | "REMINDER";
  isRead: boolean;
  createdAt: string;
  stream?: {
    id: number;
    title: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};


export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notifications/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await api.get("/notifications");
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch notifications"
    );
  }
});


export const markAsRead = createAsyncThunk<
  Notification,
  number,
  { rejectValue: string }
>("notifications/markRead", async (id, thunkAPI) => {
  try {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to mark as read"
    );
  }
});


const notificationSlice = createSlice({
  name: "notifications",
  initialState,

  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },

    clearNotifications(state) {
      state.notifications = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch notifications";
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.id
        );

        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      });
  },
});

export const { addNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;