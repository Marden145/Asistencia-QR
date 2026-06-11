const personaJuntaDirectivaRepository = require('../repositories/personaJuntaDirectiva.repository');

const personaJuntaDirectivaService = {
    listar: async () => {
    return personaJuntaDirectivaRepository.findAll();
  },
  obtener: async (id) => {
    const persona = await personaJuntaDirectivaRepository.findById(id);
    // Regla de negocio: si no existe, lanzar error 404
    if (!persona) {
      const err = new Error('Persona no encontrada');
      err.statusCode = 404;
      throw err;
    }

    return persona;
  },
  crear: async (data) => {
    return personaJuntaDirectivaRepository.create(data);
  },
  actualizar: async (id, data) => {
    await personaJuntaDirectivaService.obtener(id);
    return personaJuntaDirectivaRepository.update(id, data);
  },

  eliminar: async (id) => {
    // Verifica que existe antes de eliminar
    await personaJuntaDirectivaService.obtener(id);
    return personaJuntaDirectivaRepository.softDelete(id);
  },
};
module.exports = personaJuntaDirectivaService;