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
      Alert.alert("Error", error.response?.data?.message);
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const fetchBusinessJobs = createAsyncThunk(
  "job/fetchBusinessJobs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${Config.BASE_URL}/jobs/my-jobs/`, {
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

export const fetchApplications = createAsyncThunk(
  "job/fetchApplications",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${Config.BASE_URL}/jobs/my-jobs/${id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const handleDeleteJob = createAsyncThunk(
  "job/handleDeleteJob",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${Config.BASE_URL}/jobs/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  jobs: [],
  businessJobs: [],
  applications: [],
  jobLoading: false,
  jobError: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearJobs: (state) => {
      state.jobs = [];
      state.businessJobs = [];
      state.applications = [];
      state.jobLoading = false;
      state.jobError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })
      .addCase(handleBlock.pending, (state, action) => {
        const username = action.meta.arg;
        state.jobs = state.jobs.filter((job) => {
          return job.posted_by.user.username !== username;
        });
      })

      // Handle Collaboration Application
      .addCase(handleApplication.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(handleApplication.fulfilled, (state, action) => {
        const id = action.payload;
        const job = state.jobs.find((j) => j.id === id);
        if (job) job.is_applied = true;
        state.jobLoading = false;
      })
      .addCase(handleApplication.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })

      // Fetch Business Jobs
      .addCase(fetchBusinessJobs.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(fetchBusinessJobs.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.businessJobs = action.payload;
      })
      .addCase(fetchBusinessJobs.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })

      // Fetrch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })

      // Handle Delete Job
      .addCase(handleDeleteJob.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(handleDeleteJob.fulfilled, (state, action) => {
        const id = action.payload;
        state.businessJobs = state.businessJobs.filter((job) => job.id !== id);
        state.jobLoading = false;
      })
      .addCase(handleDeleteJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      });
  },
});

export const { clearJobs } = jobSlice.actions;
export default jobSlice.reducer;
