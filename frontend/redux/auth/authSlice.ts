import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  signupThunk,
  fetchUsers,
  fetchCurrentUser,
} from "./authThunks";

import { deleteCookie } from "cookies-next";
import { AuthState } from "./authTypes";

const initialState: AuthState = {
  userId: null,
  token: null,
  currentUser: null,
  users: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.token = action.payload.token;
    },

    logout(state) {
      state.userId = null;
      state.token = null;
      state.currentUser = null;

      deleteCookie("token");
      localStorage.removeItem("token");

    },
  },

  extraReducers: (builder) => {
    builder


      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.userId = action.payload.user.userId;
        state.currentUser = action.payload.user;
        console.log(state.token)
        console.log(state.userId)
        console.log(state.currentUser)
      })

      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })


      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signupThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Signup failed";
      })


      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })


      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { setCurrentUser, logout } = authSlice.actions;
export default authSlice.reducer;