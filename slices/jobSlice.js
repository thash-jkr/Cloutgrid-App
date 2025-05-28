import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../config";
import { handleBlock } from "./profilesSlice";
import { Alert } from "react-native";

export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${Config.BASE_URL}/jobs/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const handleApplication = createAsyncThunk(
  "job/handleApplication",
  async ({ id, answers }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.post(
        `${Config.BASE_URL}/jobs/${id}/apply/`,
        { answers },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Application Successful", "You have applied for the job.");

      return id;
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message)
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearJobs: (state) => {
      state.jobs = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleBlock.pending, (state, action) => {
        const username = action.meta.arg;
        state.jobs = state.jobs.filter((job) => {
          return job.posted_by.user.username !== username;
        });
      })

      .addCase(handleApplication.fulfilled, (state, action) => {
        const id = action.payload;
        const job = state.jobs.find((j) => j.id === id);
        if (job) job.is_applied = true;
        state.loading = false;
      })
      .addCase(handleApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobs } = jobSlice.actions;
export default jobSlice.reducer;
