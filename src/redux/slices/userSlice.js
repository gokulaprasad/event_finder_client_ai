import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../utils/userService';

const initialState = {
  profile: null,
  savedEvents: [],
  registeredEvents: [],
  recommendations: [],
  stats: null,
  isLoading: false,
  error: null,
};

// Get user profile
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getProfile();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await userService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get recommendations
export const getRecommendations = createAsyncThunk(
  'user/getRecommendations',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getRecommendations();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get saved events
export const getSavedEvents = createAsyncThunk(
  'user/getSavedEvents',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getSavedEvents();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get registered events
export const getRegisteredEvents = createAsyncThunk(
  'user/getRegisteredEvents',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getRegisteredEvents();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user stats
export const getUserStats = createAsyncThunk(
  'user/getUserStats',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getUserStats();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateSavedEvents: (state, action) => {
      const { eventId, saved } = action.payload;
      if (saved) {
        state.savedEvents.push(eventId);
      } else {
        state.savedEvents = state.savedEvents.filter(id => id !== eventId);
      }
    },
    updateRegisteredEvents: (state, action) => {
      const { eventId, registered } = action.payload;
      if (registered) {
        state.registeredEvents.push(eventId);
      } else {
        state.registeredEvents = state.registeredEvents.filter(id => id !== eventId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
        state.savedEvents = action.payload.data.savedEvents || [];
        state.registeredEvents = action.payload.data.registeredEvents || [];
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Recommendations
      .addCase(getRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload.data;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Saved Events
      .addCase(getSavedEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSavedEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedEvents = action.payload.data;
      })
      .addCase(getSavedEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Registered Events
      .addCase(getRegisteredEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRegisteredEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registeredEvents = action.payload.data;
      })
      .addCase(getRegisteredEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get User Stats
      .addCase(getUserStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateSavedEvents, updateRegisteredEvents } = userSlice.actions;
export default userSlice.reducer;
