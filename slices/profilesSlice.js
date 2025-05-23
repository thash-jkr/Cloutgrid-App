import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../config";

export const fetchOtherProfile = createAsyncThunk(
  "profiles/fetchOtherProfile",
  async (username, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${Config.BASE_URL}/profiles/${username}/`,
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

export const fetchOtherPosts = createAsyncThunk(
  "profiles/fetchOtherPosts",
  async (username, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${Config.BASE_URL}/posts/${username}/`,
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

export const fetchOtherCollabs = createAsyncThunk(
  "profiles/fetchOtherCollabs",
  async (username, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${Config.BASE_URL}/posts/collabs/${username}/`,
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

export const handleFollow = createAsyncThunk(
  "profiles/handleFollow",
  async (username, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.post(`${Config.BASE_URL}/profiles/${username}/follow/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const handleUnfollow = createAsyncThunk(
  "profiles/handleUnfollow",
  async (username, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.post(`${Config.BASE_URL}/profiles/${username}/unfollow/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const handleBlock = createAsyncThunk(
  "profiles/handleBlock",
  async (username, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.post(
        `${Config.BASE_URL}/profiles/${username}/block/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { username };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const handleUnblock = createAsyncThunk(
  "profiles/handleUnblock",
  async (username, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.post(
        `${Config.BASE_URL}/profiles/${username}/unblock/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  otherProfile: null,
  otherPosts: [],
  otherCollabs: [],
  profilesLoading: false,
  profilesError: null,
};

const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    clearProfiles: (state) => {
      state.otherProfile = null;
      state.otherPosts = [];
      state.otherCollabs = [];
      state.profilesLoading = false;
      state.profilesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherProfile.pending, (state) => {
        state.profilesLoading = true;
        state.profilesError = null;
      })
      .addCase(fetchOtherProfile.fulfilled, (state, action) => {
        state.profilesLoading = false;
        state.otherProfile = action.payload;
      })
      .addCase(fetchOtherProfile.rejected, (state, action) => {
        state.profilesLoading = false;
        state.profilesError = action.payload;
      })

      .addCase(fetchOtherPosts.pending, (state) => {
        state.profilesLoading = true;
        state.profilesError = null;
      })
      .addCase(fetchOtherPosts.fulfilled, (state, action) => {
        state.profilesLoading = false;
        state.otherPosts = action.payload;
      })
      .addCase(fetchOtherPosts.rejected, (state, action) => {
        state.profilesLoading = false;
        state.profilesError = action.payload;
      })

      .addCase(fetchOtherCollabs.pending, (state) => {
        state.profilesLoading = true;
        state.profilesError = null;
      })
      .addCase(fetchOtherCollabs.fulfilled, (state, action) => {
        state.profilesLoading = false;
        state.otherCollabs = action.payload;
      })
      .addCase(fetchOtherCollabs.rejected, (state, action) => {
        state.profilesLoading = false;
        state.profilesError = action.payload;
      })

      .addCase(handleFollow.pending, (state) => {
        state.profilesLoading = true;
        state.profilesError = null;
      })
      .addCase(handleFollow.fulfilled, (state) => {
        state.profilesLoading = false;
        state.otherProfile.is_following = true;
        state.otherProfile.user.followers_count += 1;
      })
      .addCase(handleFollow.rejected, (state, action) => {
        state.profilesLoading = false;
        state.profilesError = action.payload;
      })

      .addCase(handleUnfollow.pending, (state) => {
        state.profilesLoading = true;
        state.profilesError = null;
      })
      .addCase(handleUnfollow.fulfilled, (state) => {
        state.profilesLoading = false;
        state.otherProfile.is_following = false;
        state.otherProfile.user.followers_count -= 1;
      })
      .addCase(handleUnfollow.rejected, (state, action) => {
        state.profilesLoading = false;
        state.profilesError = action.payload;
      })

      .addCase(handleBlock.pending, (state) => {
        state.profilesLoading = true;
        state.profilesError = null;
      })
      .addCase(handleBlock.fulfilled, (state) => {
        state.profilesLoading = false;
        state.otherProfile.is_blocking = true;
      })
      .addCase(handleBlock.rejected, (state, action) => {
        state.profilesLoading = false;
        state.profilesError = action.payload;
      })

      .addCase(handleUnblock.pending, (state) => {
        state.profilesLoading = true;
        state.profilesError = null;
      })
      .addCase(handleUnblock.fulfilled, (state) => {
        state.profilesLoading = false;
        state.otherProfile.is_blocking = false;
      })
      .addCase(handleUnblock.rejected, (state, action) => {
        state.profilesLoading = false;
        state.profilesError = action.payload;
      });
  },
});

export const { clearProfiles } = profilesSlice.actions;
export default profilesSlice.reducer;
