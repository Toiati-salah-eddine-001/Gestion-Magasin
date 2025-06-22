// API configuration and service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API client class
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Get authentication token
  getToken() {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const api = new ApiClient();

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/auth/user'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
  getSalesChart: (days = 7) => api.get('/dashboard/sales-chart', { days }),
  getTopProducts: (limit = 10) => api.get('/dashboard/top-products', { limit }),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', params),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get('/products/search', { query }),
  getByBarcode: (barcode) => api.get('/products/barcode', { barcode }),
  updateStock: (id, data) => api.put(`/products/${id}/stock`, data),
};

// Sales API
export const salesAPI = {
  getAll: (params = {}) => api.get('/sales', params),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  updateStatus: (id, status) => api.put(`/sales/${id}/status`, { status }),
  getStatistics: (params = {}) => api.get('/sales/statistics', params),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', params),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, password) => api.put(`/users/${id}/reset-password`, { new_password: password }),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
  getStatistics: () => api.get('/users/statistics'),
};

// Reports API
export const reportsAPI = {
  getSalesReport: (params = {}) => api.get('/reports/sales', params),
  getInventoryReport: () => api.get('/reports/inventory'),
  getProfitLossReport: (params = {}) => api.get('/reports/profit-loss', params),
};

// Settings API
export const settingsAPI = {
  getAll: (group = null) => api.get('/settings', group ? { group } : {}),
  get: (key) => api.get(`/settings/${key}`),
  update: (settings) => api.put('/settings', { settings }),
  updateStore: (data) => api.put('/settings/store', data),
  updatePrinting: (data) => api.put('/settings/printing', data),
  updateSystem: (data) => api.put('/settings/system', data),
  reset: (group) => api.post('/settings/reset', { group }),
};

// Export API client for direct use
export { api };

// Export default
export default api;
