import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/auth/authSlice";
import tasksReducer from "@/redux/tasks/taskSlice";
import userTaskReducer from "@/redux/userTasks/userTaskSlice";

const rootReducer = combineReducers({
  authenticator: authReducer,
  tasks: tasksReducer,
  userTasks: userTaskReducer,
});

export default rootReducer;
