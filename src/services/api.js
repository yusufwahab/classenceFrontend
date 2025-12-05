import axios from 'axios';

// Update this URL to match your backend server
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerStudent: (userData) => api.post('/auth/register', userData),
  registerAdmin: (userData) => api.post('/auth/register-admin', userData),
};

// Profile API
export const profileAPI = {
  saveSignature: (signatureData) => api.post('/profile/signature', { signatureImage: signatureData }),
  getProfile: () => api.get('/profile/me'),
};

// Student API
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  markAttendance: () => api.post('/student/attendance'),
  getUpdates: () => api.get('/student/updates'),
  getAttendanceLog: (params) => api.get('/student/attendance-log', { params }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (params) => api.get('/admin/students', { params }),
  getTodayAttendance: (date) => api.get('/admin/attendance/today', { params: { date } }),
  getAttendanceByDate: (date) => api.get('/admin/attendance', { params: { date } }),
  postUpdate: (updateData) => {
    return api.post('/admin/updates', updateData, {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  getUpdates: () => api.get('/admin/updates'),
  deleteUpdate: (updateId) => api.delete(`/admin/updates/${updateId}`),
  exportAttendance: (params) => api.get('/admin/attendance/export', { 
    params,
    responseType: 'blob'
  }),
};

// Shared API
export const sharedAPI = {
  getDepartments: () => api.get('/departments'),
};

export default api;