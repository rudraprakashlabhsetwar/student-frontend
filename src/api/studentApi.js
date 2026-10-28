import axios from 'axios';

// Support VITE_API_URL or REACT_APP_API_URL with automatic fallback and /api normalization
const rawBaseURL =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL)) ||
  'https://student-api-xjlq.onrender.com/api';

const cleanBase = rawBaseURL.replace(/\/+$/, '');
const baseURL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const studentApi = {
  getAll: async () => {
    const { data } = await api.get('/students');
    return data;
  },
  create: async (student) => {
    const { data } = await api.post('/students', student);
    return data;
  },
  update: async (id, student) => {
    const { data } = await api.put(`/students/${id}`, student);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/students/${id}`);
    return data;
  },
};
