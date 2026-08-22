import api from './api';

export const attendanceService = {
  checkIn: async () => {
    const response = await api.post('/attendance/check-in');
    return response.data;
  },

  checkOut: async () => {
    const response = await api.post('/attendance/check-out');
    return response.data;
  },

  getMyAttendance: async () => {
    const response = await api.get('/attendance/my');
    return response.data;
  },

  getMyWeeklyAttendance: async () => {
    const response = await api.get('/attendance/weekly');
    return response.data;
  },

  getAllAttendance: async (params = {}) => {
    const response = await api.get('/attendance/all', { params });
    return response.data;
  }
};
