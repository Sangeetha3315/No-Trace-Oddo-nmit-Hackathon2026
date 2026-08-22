import api from './api';

export const leaveService = {
  applyForLeave: async (data) => {
    const response = await api.post('/leaves/apply', data);
    return response.data;
  },

  getMyLeaves: async () => {
    const response = await api.get('/leaves/my');
    return response.data;
  },

  getLeaveBalance: async () => {
    const response = await api.get('/leaves/balance');
    return response.data;
  },

  getAllLeaves: async (status) => {
    const response = await api.get('/leaves/all', { params: status ? { status } : {} });
    return response.data;
  },

  reviewLeave: async (id, status, reviewerComments) => {
    const response = await api.put(`/leaves/${id}/review`, { status, reviewerComments });
    return response.data;
  }
};
