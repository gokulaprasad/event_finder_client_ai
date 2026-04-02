import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '../../utils/eventService';

const initialState = {
  events: [],
  trendingEvents: [],
  currentEvent: null,
  recommendations: [],
  myEvents: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    category: '',
    location: '',
    date: '',
    search: '',
    sortBy: 'date',
    order: 'asc',
  },
};

// Get all events
export const getEvents = createAsyncThunk(
  'events/getEvents',
  async (params, thunkAPI) => {
    try {
      const response = await eventService.getEvents(params);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get trending events
export const getTrendingEvents = createAsyncThunk(
  'events/getTrendingEvents',
  async (_, thunkAPI) => {
    try {
      const response = await eventService.getTrendingEvents();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single event
export const getEventById = createAsyncThunk(
  'events/getEventById',
  async (id, thunkAPI) => {
    try {
      const response = await eventService.getEventById(id);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create event
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, thunkAPI) => {
    try {
      const response = await eventService.createEvent(eventData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update event
export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, thunkAPI) => {
    try {
      const response = await eventService.updateEvent(id, eventData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete event
export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, thunkAPI) => {
    try {
      await eventService.deleteEvent(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register for event
export const registerForEvent = createAsyncThunk(
  'events/registerForEvent',
  async (id, thunkAPI) => {
    try {
      const response = await eventService.registerForEvent(id);
      return { id, ...response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save/unsave event
export const saveEvent = createAsyncThunk(
  'events/saveEvent',
  async (id, thunkAPI) => {
    try {
      const response = await eventService.saveEvent(id);
      return { id, ...response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my events
export const getMyEvents = createAsyncThunk(
  'events/getMyEvents',
  async (_, thunkAPI) => {
    try {
      const response = await eventService.getMyEvents();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Events
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Trending Events
      .addCase(getTrendingEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrendingEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trendingEvents = action.payload.data;
      })
      .addCase(getTrendingEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Event By Id
      .addCase(getEventById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload.data;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events.unshift(action.payload.data);
        state.myEvents.unshift(action.payload.data);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.events.findIndex(e => e._id === action.payload.data._id);
        if (index !== -1) {
          state.events[index] = action.payload.data;
        }
        if (state.currentEvent?._id === action.payload.data._id) {
          state.currentEvent = action.payload.data;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = state.events.filter(e => e._id !== action.payload);
        state.myEvents = state.myEvents.filter(e => e._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register For Event
      .addCase(registerForEvent.fulfilled, (state, action) => {
        if (state.currentEvent && state.currentEvent._id === action.payload.id) {
          state.currentEvent.isRegistered = action.payload.data.registered;
        }
      })
      // Save Event
      .addCase(saveEvent.fulfilled, (state, action) => {
        if (state.currentEvent && state.currentEvent._id === action.payload.id) {
          state.currentEvent.isSaved = action.payload.data.saved;
        }
      })
      // Get My Events
      .addCase(getMyEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myEvents = action.payload.data;
      })
      .addCase(getMyEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentEvent, clearError } = eventSlice.actions;
export default eventSlice.reducer;
