import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register/register/', data),
  login: (credentials) => api.post('/auth/token/', credentials),
  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
};

// Word Lists APIs
export const wordListAPI = {
  getAll: () => api.get('/word-lists/'),
  getById: (id) => api.get(`/word-lists/${id}/`),
  getByDifficulty: (difficulty) => api.get('/word-lists/by_difficulty/', { params: { difficulty } }),
};

// Typing Test Results APIs
export const resultsAPI = {
  submitResult: (data) => api.post('/results/', data),
  getMyResults: () => api.get('/results/my_results/'),
  getRecent: (limit = 10) => api.get('/results/recent/', { params: { limit } }),
  getBestResults: (metric = 'wpm', limit = 10) => 
    api.get('/results/best_results/', { params: { metric, limit } }),
  getStatistics: () => api.get('/results/statistics/'),
  getResultById: (id) => api.get(`/results/${id}/`),
};

// Statistics APIs
export const statisticsAPI = {
  getMyStatistics: () => api.get('/statistics/my_statistics/'),
  getLeaderboard: (metric = 'best_wpm', limit = 100) =>
    api.get('/statistics/leaderboard/', { params: { metric, limit } }),
};

// User Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/users/profile/me/'),
};

export default api;
