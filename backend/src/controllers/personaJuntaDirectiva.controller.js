const personaJuntaDirectivaService = require('../services/personaJuntaDirectiva.service');

const personaJuntaDirectivaController = {
     listar: async (req, res, next) => {
    try {
      const personas = await personaJuntaDirectivaService.listar();
      res.json(personas);
    } catch (err) {
      next(err);
    }
  },
  obtener: async (req, res, next) => {
    try {
      // req.params.id es el :id de la URL → GET /personas/123
      const persona = await personaJuntaDirectivaService.obtener(req.params.id);
      res.json(persona);
    } catch (err) {
      next(err);
    }
  },
  crear: async (req, res, next) => {
    try {
      const { nombre,apellido,cedula,telefono ,puesto } = req.body;
      const persona = await personaJuntaDirectivaService.crear({ nombre, apellido, cedula, telefono, puesto });
      res.status(201).json(persona);
    } catch (err) {
      next(err);
    }
  },
  actualizar: async (req, res, next) => {
    try {
      const { nombre, apellido, cedula, telefono, puesto } = req.body;
      const persona = await personaJuntaDirectivaService.actualizar(req.params.id, { nombre, apellido, cedula, telefono, puesto });
      res.json(persona);
    } catch (err) {
      next(err);
    }
  },
  eliminar: async (req, res, next) => {
    try {
      await personaJuntaDirectivaService.eliminar(req.params.id);
      res.json({ mensaje: 'Persona eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  }



};

module.exports = personaJuntaDirectivaController;