const personaService = require('../services/persona.service');

const personaController = {

  listar: async (req, res, next) => {
    try {
      const personas = await personaService.listar();
      res.json(personas);
    } catch (err) {
      console.error('🔥 ERROR PERSONA:', err);
      next(err);
    }
  },

  obtener: async (req, res, next) => {
    try {
      // req.params.id es el :id de la URL → GET /personas/123
      const persona = await personaService.obtener(req.params.id);
      res.json(persona);
    } catch (err) {
      console.error('🔥 ERROR PERSONA:', err);
      next(err);
    }
  },

  crear: async (req, res, next) => {
    try {
      const { nombre, apellido,fechaNacimiento } = req.body;
       if (!nombre || !apellido) {
        return res.status(400).json({
          error: 'Nombre y apellido son requeridos'
        });
      }
      const fechaDate = fechaNacimiento ? new Date(fechaNacimiento) : null;
      const persona = await personaService.crear({ nombre, apellido, fechaNacimiento: fechaDate });
      res.status(201).json(persona);
    } catch (err) {
      console.error('🔥 ERROR PERSONA:', err);
      next(err);
    }
  },

  actualizar: async (req, res, next) => {
    try {
      const { nombre, apellido,fechaNacimiento } = req.body;
      const fechaDate = fechaNacimiento ? new Date(fechaNacimiento) : null;
      const persona = await personaService.actualizar(req.params.id, { nombre, apellido, fechaNacimiento: fechaDate });
      res.json(persona);
    } catch (err) {
      console.error('🔥 ERROR PERSONA:', err);
      next(err);
    }
  },

  eliminar: async (req, res, next) => {
    try {
      await personaService.eliminar(req.params.id);
      res.json({ mensaje: 'Persona eliminada correctamente' });
    } catch (err) {
      console.error('🔥 ERROR PERSONA:', err);
      next(err);
    }
  }

};

module.exports = personaController;