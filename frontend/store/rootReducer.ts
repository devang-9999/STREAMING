import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/redux/auth/authSlice";
import streamReducer from "@/redux/streams/streamSlice";
import notificationReducer from "@/redux/notifications/notificationsSlice";
import followReducer from "@/redux/follow/followSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  streams: streamReducer,
  notifications: notificationReducer,
  followers: followReducer,
});

export default rootReducer;