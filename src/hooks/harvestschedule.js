import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const harvestAPI = {
  getAll: () => api.get('/erp/harvests/'),
  getById: (id) => api.get(`/api/harvests/${id}/`),
  create: (data) => api.post('/erp/harvests/', data),
  update: (id, data) => api.put(`/erp/harvests/${id}/`, data),
  delete: (id) => api.delete(`/erp/harvests/${id}/`),
};