/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface FollowUser {
  id: number;
  name: string;
  email: string;
}

interface FollowState {
  followers: FollowUser[];
  following: FollowUser[];
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FollowState = {
  followers: [],
  following: [],
  followersCount: 0,
  followingCount: 0,
  isFollowing: false,
  loading: false,
  error: null,
};

const API = "/followers";


export const followUser = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>("followers/follow", async (targetUserId, thunkAPI) => {
  try {
    const res = await api.post(`${API}/${targetUserId}`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to follow"
    );
  }
});


export const unfollowUser = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>("followers/unfollow", async (targetUserId, thunkAPI) => {
  try {
    const res = await api.delete(`${API}/${targetUserId}`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to unfollow"
    );
  }
});


export const fetchFollowers = createAsyncThunk<
  FollowUser[],
  number,
  { rejectValue: string }
>("followers/getFollowers", async (userId, thunkAPI) => {
  try {
    const res = await api.get(`${API}/followers/${userId}`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch followers"
    );
  }
});


export const fetchFollowing = createAsyncThunk<
  FollowUser[],
  number,
  { rejectValue: string }
>("followers/getFollowing", async (userId, thunkAPI) => {
  try {
    const res = await api.get(`${API}/following/${userId}`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch following"
    );
  }
});


export const fetchFollowersCount = createAsyncThunk<
  { count: number },
  number,
  { rejectValue: string }
>("followers/getFollowersCount", async (userId, thunkAPI) => {
  try {
    const res = await api.get(`${API}/followers-count/${userId}`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch count"
    );
  }
});


export const fetchFollowingCount = createAsyncThunk<
  { count: number },
  number,
  { rejectValue: string }
>("followers/getFollowingCount", async (userId, thunkAPI) => {
  try {
    const res = await api.get(`${API}/following-count/${userId}`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch count"
    );
  }
});


export const fetchFollowStatus = createAsyncThunk<
  { isFollowing: boolean },
  number,
  { rejectValue: string }
>("followers/getStatus", async (targetUserId, thunkAPI) => {
  try {
    const res = await api.get(`${API}/status/${targetUserId}`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch status"
    );
  }
});


const followSlice = createSlice({
  name: "followers",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(followUser.fulfilled, (state) => {
        state.isFollowing = true;
        state.followingCount += 1;
      })

      .addCase(unfollowUser.fulfilled, (state) => {
        state.isFollowing = false;
        state.followingCount -= 1;
      })

      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })

      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      })

      .addCase(fetchFollowersCount.fulfilled, (state, action) => {
        state.followersCount = action.payload.count;
      })

      .addCase(fetchFollowingCount.fulfilled, (state, action) => {
        state.followingCount = action.payload.count;
      })

      .addCase(fetchFollowStatus.fulfilled, (state, action) => {
        state.isFollowing = action.payload.isFollowing;
      });
  },
});

export default followSlice.reducer;