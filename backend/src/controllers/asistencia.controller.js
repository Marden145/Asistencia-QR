const asistenciaService = require('../services/asistencia.service');
const { getWeek, getYear } = require('date-fns');

const asistenciaController = {

  registrarPorQR: async (req, res, next) => {
    try {
      // El QR manda el UUID directamente en el body
      const { codigoQR } = req.body;

      if (!codigoQR) {
        return res.status(400).json({ error: 'codigoQR es requerido' });
      }

      const resultado = await asistenciaService.registrarPorQR(codigoQR);
      res.status(201).json(resultado);
    } catch (err) {
    console.error('🔥 ERROR ASISTENCIA:', err);
    next(err);
    }
  },

  reporteSemanal: async (req, res, next) => {
    try {
      // Si no mandan semana/año, usa la semana actual
      const hoy    = new Date();
      const semana = Number(req.query.semana) || getWeek(hoy, { weekStartsOn: 1 });
      const año    = Number(req.query.año)    || getYear(hoy);

      const reporte = await asistenciaService.reporteSemanal(semana, año);
      res.json(reporte);
    } catch (err) {
      console.error('🔥 ERROR ASISTENCIA:', err);
      next(err);
    }
  },
  metricas: async (req, res, next) => {
  try {
    const hoy    = new Date();
    const semana = Number(req.query.semana) || getWeek(hoy, { weekStartsOn: 1 });
    const año    = Number(req.query.año)    || getYear(hoy);

    const data = await asistenciaService.metricas(semana, año);
    res.json(data);
  } catch (err) {
    console.error('🔥 ERROR ASISTENCIA:', err);
    next(err);
  }
},
tablaAsistencia: async (req, res, next) => {
  try {
    const hoy    = new Date();
    const semana = Number(req.query.semana) || getWeek(hoy, { weekStartsOn: 1 });
    const año    = Number(req.query.año)    || getYear(hoy);

    const tabla = await asistenciaService.tablaAsistencia(semana, año);
    res.json({ tabla, semana, año });
  } catch (err) {
    console.error('🔥 ERROR ASISTENCIA:', err);
    next(err);
  }
}

};

module.exports = asistenciaController;