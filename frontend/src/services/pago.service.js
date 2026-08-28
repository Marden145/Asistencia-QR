import api from './api';

const pagoService = {

  guardar: async (data) => {
    const response = await api.post('/pagos', data);
    return response.data;
  },

  obtenerPorMes: async (personaId, mes, año) => {
    const response = await api.get(`/pagos/${personaId}/mes`, {
      params: { mes, año }
    });
    return response.data;
  },

  historial: async (personaId) => {
    const response = await api.get(`/pagos/${personaId}/historial`);
    return response.data;
  },
  reporteMensual: async (mes, año) => {
  const response = await api.get('/pagos/reporte', {
    params: { mes, año }
  });
  return response.data;
},
  obtenerResumenDashboard: async (mes, año) => {
    const response = await api.get('/pagos/resumen-dashboard', {
      params: { mes, año }
    });
    return response.data;
  }

};

export default pagoService;