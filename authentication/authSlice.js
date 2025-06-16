import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Config from "../config";
import { fetchProfile, updateProfile } from "../slices/profileSlice";

export const loginThunk = createAsyncThunk(
  "auth/loginThunk",
  async ({ email, password, type }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Config.BASE_URL}/login/${type}/`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        return rejectWithValue("Invalid Credentials");
      }

      const { access, refresh, user } = response.data;

      await SecureStore.setItemAsync("access", access, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
      await SecureStore.setItemAsync("refresh", refresh, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
      await SecureStore.setItemAsync("type", type, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
      await SecureStore.setItemAsync("user", JSON.stringify(user), {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });

      return {
        token: access,
        refresh,
        user,
        type: type,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logoutThunk",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("access");
      const refresh = await SecureStore.getItemAsync("refresh");

      if (!refresh) throw new Error("No refresh token found");

      await axios.post(
        `${Config.BASE_URL}/logout/`,
        { refresh },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await SecureStore.deleteItemAsync("access");
      await SecureStore.deleteItemAsync("refresh");
      await SecureStore.deleteItemAsync("type");
      await SecureStore.deleteItemAsync("user");
      axios.defaults.headers.common.Authorization = null;

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  refresh: null,
  type: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.refresh = null;
      state.type = null;
      state.status = "idle";
      state.error = null;
    },

    setCredentiels(state, action) {
      const { user, token, refresh, type } = action.payload;
      state.user = user;
      state.token = token;
      state.refresh = refresh;
      state.type = type;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refresh = action.payload.refresh;
        state.type = action.payload.type;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refresh = null;
        state.type = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logoutLocal, setCredentiels } = authSlice.actions;
export default authSlice.reducer;
