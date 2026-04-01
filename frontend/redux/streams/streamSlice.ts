/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

const API = "/streams";

export interface Stream {
  id: number;
  title: string;
  description?: string;
  scheduledAt: string;
  status: "SCHEDULED" | "LIVE" | "CANCELLED" | "COMPLETED";
  creator?: {
    id: number;
    name: string;
  };
}

interface StreamState {
  streams: Stream[];
  loading: boolean;
  error: string | null;
}

const initialState: StreamState = {
  streams: [],
  loading: false,
  error: null,
};


export const createStream = createAsyncThunk<
  Stream,
  { title: string; description?: string; scheduledAt: string },
  { rejectValue: string }
>("streams/create", async (data, thunkAPI) => {
  try {
    const res = await api.post(API, data);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to create stream"
    );
  }
});


export const fetchStreams = createAsyncThunk<
  Stream[],
  void,
  { rejectValue: string }
>("streams/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await api.get(API);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch streams"
    );
  }
});


export const fetchMyStreams = createAsyncThunk<
  Stream[],
  void,
  { rejectValue: string }
>("streams/fetchMine", async (_, thunkAPI) => {
  try {
    const res = await api.get(`${API}/my-streams`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch your streams"
    );
  }
});


export const updateStreamStatus = createAsyncThunk<
  Stream,
  { id: number; status: Stream["status"] },
  { rejectValue: string }
>("streams/updateStatus", async ({ id, status }, thunkAPI) => {
  try {
    const res = await api.patch(`${API}/${id}/status`, { status });
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to update stream"
    );
  }
});


const streamSlice = createSlice({
  name: "streams",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchStreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchStreams.fulfilled, (state, action) => {
        state.loading = false;
        state.streams = action.payload;
      })

      .addCase(fetchStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching streams";
      })

      .addCase(fetchMyStreams.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchMyStreams.fulfilled, (state, action) => {
        state.loading = false;
        state.streams = action.payload;
      })

      .addCase(fetchMyStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching streams";
      })

      .addCase(createStream.pending, (state) => {
        state.loading = true;
      })

      .addCase(createStream.fulfilled, (state, action) => {
        state.loading = false;
        state.streams.unshift(action.payload); // newest on top
      })

      .addCase(createStream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Stream creation failed";
      })

      .addCase(updateStreamStatus.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateStreamStatus.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.streams.findIndex(
          (stream) => stream.id === action.payload.id
        );

        if (index !== -1) {
          state.streams[index] = action.payload;
        }
      })

      .addCase(updateStreamStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Update failed";
      });
  },
});

export default streamSlice.reducer;