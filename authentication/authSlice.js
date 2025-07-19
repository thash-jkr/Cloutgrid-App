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
      return rejectWithValue(
        error.response?.data.message || "Something went wrong!"
      );
    }
  }
);

export const handleSendOTP = createAsyncThunk(
  "auth/handleSendOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Config.BASE_URL}/otp/send/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        return rejectWithValue(response.data.message || "Failed to send OTP");
      }

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Something went wrong!"
      );
    }
  }
);

export const handleVerifyOTP = createAsyncThunk(
  "auth/handleVerifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Config.BASE_URL}/otp/verify/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        return rejectWithValue("Invalid OTP");
      }

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Something went wrong!"
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logoutThunk",
  async (_, { rejectWithValue }) => {
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
      return rejectWithValue(
        error.response?.data.message || "Something went wrong!"
      );
    }
  }
);

const initialState = {
  user: null,
  token: null,
  refresh: null,
  type: null,
  authLoading: false,
  authError: null,
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
      state.authLoading = false;
      state.authError = null;
    },

    setCredentiels(state, action) {
      const { user, token, refresh, type } = action.payload;
      state.user = user;
      state.token = token;
      state.refresh = refresh;
      state.type = type;
      state.authLoading = false;
      state.authError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.authLoading = false;
        state.authError = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refresh = action.payload.refresh;
        state.type = action.payload.type;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });

    builder
      .addCase(handleSendOTP.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(handleSendOTP.fulfilled, (state) => {
        state.authLoading = false;
        state.authError = null;
      })
      .addCase(handleSendOTP.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      });

    builder
      .addCase(handleVerifyOTP.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(handleVerifyOTP.fulfilled, (state) => {
        state.authLoading = false;
        state.authError = null;
      })
      .addCase(handleVerifyOTP.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refresh = null;
        state.type = null;
        state.authLoading = false;
        state.authError = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      });
  },
});

export const { logoutLocal, setCredentiels } = authSlice.actions;
export default authSlice.reducer;
