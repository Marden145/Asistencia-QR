import api from './api';

const productoService={
    getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/productos', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/productos/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
  recordExpenses: async (id,cantidad)=>{
    const response = await api.post(`/productos/egreso/${id}`, { cantidad });
    return response.data;
  },
  recordRevenue: async (id,cantidad)=>{
    const response = await api.post(`/productos/ingreso/${id}`, { cantidad });
    return response.data;
  }

};
export default productoService;