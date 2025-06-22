import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const settingsApi = {
  // Get all settings with optional filters
  getSettings: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/settings`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single setting by key
  getSetting: async (key) => {
    try {
      const response = await axios.get(`${API_URL}/settings/${key}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update settings
  updateSettings: async (settingsData) => {
    try {
      const response = await axios.put(`${API_URL}/settings`, settingsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get settings by group
  getSettingsByGroup: async (group) => {
    try {
      const response = await axios.get(`${API_URL}/settings/group/${group}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default settingsApi;