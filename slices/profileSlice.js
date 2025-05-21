import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../config";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, type } = getState().auth;
      const response = await axios.get(`${Config.BASE_URL}/profile/${type}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "profile/fetchPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, user } = getState().auth;
      const response = await axios.get(
        `${Config.BASE_URL}/posts/${user.user.username}/`,
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

export const fetchCollabs = createAsyncThunk(
  "profile/fetchCollabs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${Config.BASE_URL}/posts/collabs/`, {
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

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (updates, { getState, rejectWithValue }) => {
    try {
      const { token, type } = getState().auth;

      const data = new FormData();
      data.append("user[name]", updates.user.name);
      data.append("user[email]", updates.user.email);
      data.append("user[username]", updates.user.username);

      if (updates.user.profile_photo) {
        data.append("user[profile_photo]", updates.user.profile_photo);
      }

      if (updates.user.password) {
        data.append("user[password]", updates.user.password);
      }

      data.append("user[bio]", updates.user.bio);

      if (type == "creator") {
        data.append("date_of_birth", updates.date_of_birth);
        data.append("area", updates.area);
      } else {
        data.append("website", updates.website);
        data.append("target_audience", updates.target_audience);
      }

      const response = await axios.put(
        `${Config.BASE_URL}/profile/${type}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  posts: [],
  profileStatus: "idle",
  profileError: null,
  postsStatus: "idle",
  postsError: null,
  collabs: [],
  collabsStatus: "idle",
  collabsError: null,
  updateStatus: "idle",
  updateError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      Object.assign(state, initialState);
    },
    resetUpdateStatus(state) {
      (state.updateStatus = "idle"), (state.updateError = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = "loading";
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError = action.payload;
      });

    builder
      .addCase(fetchPosts.pending, (state) => {
        state.postsStatus = "loading";
        state.postsError = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.postsStatus = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.postsStatus = "failed";
        state.postsError = action.payload;
      });

    builder
      .addCase(fetchCollabs.pending, (state) => {
        state.collabsStatus = "loading";
        state.collabsError = null;
      })
      .addCase(fetchCollabs.fulfilled, (state, action) => {
        state.collabsStatus = "succeeded";
        state.collabs = action.payload;
      })
      .addCase(fetchCollabs.rejected, (state, action) => {
        state.collabsStatus = "failed";
        state.collabsError = action.payload;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      });
  },
});

export const { clearProfile, resetUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;
