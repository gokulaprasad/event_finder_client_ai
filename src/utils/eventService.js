import api from './api';

const eventService = {
  // Get all events with filters
  getEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/events?${queryString}`);
    return response.data;
  },

  // Get trending events
  getTrendingEvents: async () => {
    const response = await api.get('/events/trending');
    return response.data;
  },

  // Get single event
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Register for event
  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },

  // Save/unsave event
  saveEvent: async (id) => {
    const response = await api.post(`/events/${id}/save`);
    return response.data;
  },

  // Get my events (for organizers)
  getMyEvents: async () => {
    const response = await api.get('/events/my-events');
    return response.data;
  },
};

export default eventService;
