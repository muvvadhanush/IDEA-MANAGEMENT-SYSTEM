import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = {
    createIdea: (data) => axios.post(`${API_URL}/ideas`, data),
    getIdeas: () => axios.get(`${API_URL}/ideas`),
    getIdea: (id) => axios.get(`${API_URL}/ideas/${encodeURIComponent(id)}`),
    evaluateIdea: (id, data) => axios.put(`${API_URL}/ideas/${encodeURIComponent(id)}/evaluate`, data),
    approveBudget: (id, data) => axios.put(`${API_URL}/ideas/${encodeURIComponent(id)}/budget`, data),
    estimateEffort: (id, data) => axios.put(`${API_URL}/ideas/${encodeURIComponent(id)}/estimation`, data),
    scheduleIdea: (id, data) => axios.put(`${API_URL}/ideas/${encodeURIComponent(id)}/schedule`, data),
    goLive: (id) => axios.put(`${API_URL}/ideas/${encodeURIComponent(id)}/golive`),
    deleteIdea: (id) => axios.delete(`${API_URL}/ideas/${encodeURIComponent(id)}`),
};
