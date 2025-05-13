import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authentication/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
