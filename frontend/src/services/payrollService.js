import api from './api';

export const payrollService = {
  getMyPayroll: async () => {
    const response = await api.get('/payroll/my');
    return response.data;
  },

  getAllPayrolls: async () => {
    const response = await api.get('/payroll/all');
    return response.data;
  },

  updatePayroll: async (userId, data) => {
    const response = await api.put(`/payroll/update/${userId}`, data);
    return response.data;
  }
};
