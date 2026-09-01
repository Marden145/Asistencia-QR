// sesion.controller.js
const sesionService = require('../services/sesion.service');

const sesionController = {
  abrir: async (req, res, next) => {
    try {
      const sesion = await sesionService.abrir();
      res.status(201).json(sesion);
    } catch (err) { 
      console.error('🔥 ERROR ASISTENCIA:', err);
      next(err); 
    }
  },

  cerrar: async (req, res, next) => {
    try {
      const resultado = await sesionService.cerrar();
      res.json(resultado);
    } catch (err) {
      console.error('🔥 ERROR ASISTENCIA:', err);
      next(err); }
  },

  estado: async (req, res, next) => {
    try {
      const estado = await sesionService.estadoHoy();
      res.json(estado);
    } catch (err) {
      console.error('🔥 ERROR ASISTENCIA:', err);
      next(err); }
  }
};

module.exports = sesionController;