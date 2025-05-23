import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authentication/authSlice";
import feedReducer from "./slices/feedSlice";
import notificationReducer from "./slices/notificationSlice";
import profileReducer from "./slices/profileSlice";
import profilesReducer from "./slices/profilesSlice";
import jobReducer from "./slices/jobSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    notif: notificationReducer,
    profile: profileReducer,
    profiles: profilesReducer,
    job: jobReducer,
  },
});
