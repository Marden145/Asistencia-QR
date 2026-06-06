const personaService = require('../services/persona.service');

const personaController = {

  listar: async (req, res, next) => {
    try {
      const personas = await personaService.listar();
      res.json(personas);
    } catch (err) {
      next(err);
    }
  },

  obtener: async (req, res, next) => {
    try {
      // req.params.id es el :id de la URL → GET /personas/123
      const persona = await personaService.obtener(req.params.id);
      res.json(persona);
    } catch (err) {
      next(err);
    }
  },

  crear: async (req, res, next) => {
    try {
      const { nombre, apellido, email, telefono } = req.body;
      const persona = await personaService.crear({ nombre, apellido, email, telefono });
      res.status(201).json(persona);
    } catch (err) {
      next(err);
    }
  },

  actualizar: async (req, res, next) => {
    try {
      const persona = await personaService.actualizar(req.params.id, req.body);
      res.json(persona);
    } catch (err) {
      next(err);
    }
  },

  eliminar: async (req, res, next) => {
    try {
      await personaService.eliminar(req.params.id);
      res.json({ mensaje: 'Persona eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  }

};

module.exports = personaController;