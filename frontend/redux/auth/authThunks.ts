/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginPayload, SignupPayload, User } from "./authTypes";
import api from "@/lib/api";


export const signupThunk = createAsyncThunk<
  User,
  SignupPayload,
  { rejectValue: string }
>("auth/signup", async (data, thunkAPI) => {
  try {
    const response = await api.post("/auth/signup", data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Signup failed"
    );
  }
});


export const loginThunk = createAsyncThunk<
  { access_token: string; user: User },
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (data, thunkAPI) => {
  try {
    const response = await api.post("/auth/login", data);

    const { access_token, user } = response.data;

    return { access_token, user };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Login failed"
    );
  }
});


export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("auth/fetchUsers", async (_, thunkAPI) => {
  try {
    const res = await api.get("/users/creators");
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch users"
    );
  }
});


export const fetchCurrentUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (userId, thunkAPI) => {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch user"
    );
  }
});