import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const salesApi = {
  // Get all sales with optional filters
  getSales: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/sales`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single sale by ID
  getSale: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/sales/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new sale
  createSale: async (saleData) => {
    try {
      const response = await axios.post(`${API_URL}/sales`, saleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get product by barcode
  getProductByBarcode: async (barcode) => {
    try {
      const response = await axios.get(`${API_URL}/products/barcode/${barcode}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get daily sales statistics
  getDailyStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/sales/daily-stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default salesApi;