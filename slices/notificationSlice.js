import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../config";
import { logoutThunk } from "../authentication/authSlice";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (showAll, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(
        `${Config.BASE_URL}/notifications/?all=${showAll}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { items: response.data, showAll };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.post(
        `${Config.BASE_URL}/notifications/${id}/mark_as_read/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  count: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { items, showAll } = action.payload;
        state.status = "succeeded";
        state.items = items;
        state.count = showAll ? state.count : state.items.length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.items = [];
        state.status = "idle";
        state.error = null;
        state.count = 0;
      });

    builder
      .addCase(markAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
        state.count -= 1;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
