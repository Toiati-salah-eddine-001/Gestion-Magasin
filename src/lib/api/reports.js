import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const reportsApi = {
  // Get daily sales statistics
  getDailyStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/daily-stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get monthly sales data
  getMonthlySales: async (year = new Date().getFullYear()) => {
    try {
      const response = await axios.get(`${API_URL}/reports/monthly-sales/${year}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get inventory movements
  getInventoryMovements: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/reports/inventory-movements`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get profit and loss data
  getProfitLoss: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/reports/profit-loss`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get top selling products
  getTopProducts: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/reports/top-products`, { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default reportsApi;