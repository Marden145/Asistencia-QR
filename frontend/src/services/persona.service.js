import api from './api';

const personaService = {

  // Trae todas las personas
  getAll: async () => {
    const response = await api.get('/personas');
    return response.data;
  },

  // Trae una persona por id
  getById: async (id) => {
    const response = await api.get(`/personas/${id}`);
    return response.data;
  },

  // Crea una persona nueva
  create: async (data) => {
    const response = await api.post('/personas', data);
    return response.data;
  },

  // Actualiza una persona
  update: async (id, data) => {
    const response = await api.put(`/personas/${id}`, data);
    return response.data;
  },

  // Elimina una persona
  remove: async (id) => {
    const response = await api.delete(`/personas/${id}`);
    return response.data;
  }

};

export default personaService;