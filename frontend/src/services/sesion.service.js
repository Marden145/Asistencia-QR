import api from './api';

const sesionService = {
  getEstado: async () => {
    const response = await api.get('/sesion/estado');
    return response.data;
  },
  abrir: async () => {
    const response = await api.post('/sesion/abrir');
    return response.data;
  },
  cerrar: async () => {
    const response = await api.post('/sesion/cerrar');
    return response.data;
  }
};

export default sesionService;