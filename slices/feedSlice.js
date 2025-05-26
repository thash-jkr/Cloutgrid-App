import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../config";
import { handleBlock } from "./profilesSlice";
import { deletePost } from "./profileSlice";

export const fetchFeed = createAsyncThunk(
  "feed/fetchFeed",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${Config.BASE_URL}/posts/`, {
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

export const likePost = createAsyncThunk(
  "feed/likePost",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        `${Config.BASE_URL}/posts/${postId}/like/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const is_liked = response.data.liked;
      const like_count = response.data.like_count;
      return {
        postId,
        is_liked,
        like_count,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    clearFeed(state) {
      state.posts = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, is_liked, like_count } = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === postId ? { ...post, like_count, is_liked } : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleBlock.pending, (state, action) => {
        const username = action.meta.arg;
        state.posts = state.posts.filter((post) => {
          return post.author.username !== username;
        });
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.id
        );
      })
  },
});

export const { clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
