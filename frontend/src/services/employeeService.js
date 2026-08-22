import api from './api';

export const employeeService = {
  getMyProfile: async () => {
    const response = await api.get('/employees/me');
    return response.data;
  },

  updateSelfProfile: async (data) => {
    const response = await api.put('/employees/me/update', data);
    return response.data;
  },

  getProfileById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  getAllEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  adminUpdateProfile: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  }
};
