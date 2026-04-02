import api from './api';

const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  // Get recommendations
  getRecommendations: async () => {
    const response = await api.get('/user/recommendations');
    return response.data;
  },

  // Get saved events
  getSavedEvents: async () => {
    const response = await api.get('/user/saved-events');
    return response.data;
  },

  // Get registered events
  getRegisteredEvents: async () => {
    const response = await api.get('/user/registered-events');
    return response.data;
  },

  // Get user stats
  getUserStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },
};

export default userService;
