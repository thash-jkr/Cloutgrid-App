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

export const fetchComments = createAsyncThunk(
  "feed/fetchComments",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(
        `${Config.BASE_URL}/posts/${postId}/comments/`,
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

export const handleAddComment = createAsyncThunk(
  "feed/handleAddComment",
  async ({ postId, comment }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        `${Config.BASE_URL}/posts/${postId}/comments/`,
        { content: comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { newComment: response.data, postId: postId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const handleDeleteComment = createAsyncThunk(
  "feed/handleDeleteComment",
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(
        `${Config.BASE_URL}/posts/${postId}/comment/${commentId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const selectPostById = (state, postId) =>
  state.feed.posts.find((post) => post.id === postId);

const initialState = {
  posts: [],
  comments: [],
  feedLoading: false,
  feedError: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    clearFeed(state) {
      state.posts = [];
      state.feedLoading = false;
      state.feedError = null;
    },
    clearComments(state) {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
      })

      .addCase(likePost.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feedError = null;
        const { postId, is_liked, like_count } = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === postId ? { ...post, like_count, is_liked } : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
      })

      .addCase(fetchComments.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feedError = null;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
      })

      .addCase(handleAddComment.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(handleAddComment.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feedError = null;
        const { newComment, postId } = action.payload;
        state.comments.push(newComment);
        state.posts = state.posts.map((post) =>
          post.id === postId
            ? { ...post, comment_count: post.comment_count + 1 }
            : post
        );
      })
      .addCase(handleAddComment.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
      })

      .addCase(handleDeleteComment.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(handleDeleteComment.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feedError = null;
        const { postId, commentId } = action.payload;
        state.comments = state.comments.filter(
          (comment) => comment.id !== commentId
        );
        state.posts = state.posts.map((post) =>
          post.id === postId
            ? { ...post, comment_count: post.comment_count - 1 }
            : post
        );
      })
      .addCase(handleDeleteComment.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
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
      });
  },
});

export const { clearFeed, clearComments } = feedSlice.actions;
export default feedSlice.reducer;
