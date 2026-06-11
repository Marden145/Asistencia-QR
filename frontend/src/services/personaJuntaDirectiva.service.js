import api from './api';
const personaJuntaDirectivaService={
    getAll: async () => {
    const response = await api.get('/persona-junta-directiva');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/persona-junta-directiva/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/persona-junta-directiva', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/persona-junta-directiva/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/persona-junta-directiva/${id}`);
    return response.data;
  }



};
export default personaJuntaDirectivaService;