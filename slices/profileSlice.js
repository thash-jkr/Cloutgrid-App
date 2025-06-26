import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../config";
import { Alert } from "react-native";

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
      return response.data;
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

export const deletePost = createAsyncThunk(
  "profile/deletePost",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${Config.BASE_URL}/posts/${postId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return { id: postId };
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? error.message);
    }
  }
);

const initialState = {
  posts: [],
  collabs: [],
  profile: null,
  profileLoading: false,
  profileError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(fetchPosts.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(fetchCollabs.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchCollabs.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.collabs = action.payload;
      })
      .addCase(fetchCollabs.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(deletePost.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileError = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });
  },
});

export const { clearProfile, resetUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;
