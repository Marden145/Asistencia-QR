import api from './api';

const asistenciaService = {

  registrarPorQR: async (codigoQR) => {
    const response = await api.post('/asistencia/registrar', { codigoQR });
    return response.data;
  },

  getReporteSemanal: async (semana, año) => {
    const response = await api.get('/asistencia/reporte', {
      params: { semana, año } // Axios convierte esto a ?semana=20&año=2026
    });
    return response.data;
  },
  getMetricas: async (semana, año) => {
  const response = await api.get('/asistencia/metricas', {
    params: { semana, año }
  });
  return response.data;
},
getTabla: async (semana, año) => {
  const response = await api.get('/asistencia/tabla', {
    params: { semana, año }
  });
  return response.data;
}

};

export default asistenciaService;