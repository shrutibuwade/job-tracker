import axios from 'axios';

const API_URL = 'https://job-tracker-production-ae77.up.railway.app';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// User APIs
export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => api.post('/users/login', data);

// Job APIs
export const addJob = (userId, data) => api.post(`/jobs/${userId}`, data);
export const getAllJobs = (userId) => api.get(`/jobs/${userId}`);
export const updateJob = (jobId, data) => api.put(`/jobs/${jobId}`, data);
export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);
export const filterByStatus = (userId, status) => api.get(`/jobs/${userId}/filter?status=${status}`);
export const searchByCompany = (userId, companyName) => api.get(`/jobs/${userId}/search?companyName=${companyName}`);
export const getDashboardStats = (userId) => api.get(`/jobs/${userId}/dashboard`);