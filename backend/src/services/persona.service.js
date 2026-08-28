const { v4: uuidv4 }    = require('uuid');
const personaRepository = require('../repositories/persona.repository');

const personaService = {

  listar: async () => {
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1; 
  const añoActual = hoy.getFullYear();

  return personaRepository.findAll(mesActual, añoActual);
},

  obtener: async (id) => {
    const persona = await personaRepository.findById(id);

    // Regla de negocio: si no existe, lanzar error 404
    if (!persona) {
      const err = new Error('Persona no encontrada');
      err.statusCode = 404;
      throw err;
    }

    return persona;
  },

  crear: async (data) => {
    // Genera el UUID que irá dentro del código QR
    // Este UUID es lo que la cámara va a leer cuando escanees
    const codigoQR = uuidv4();

    return personaRepository.create({ ...data, codigoQR });
  },
  actualizar: async (id, data) => {
    // Primero verifica que existe (reutiliza la lógica de obtener)
    await personaService.obtener(id);

    // No permite cambiar el codigoQR desde este endpoint
    // Si alguien mandara codigoQR en el body, lo ignoramos
    const { codigoQR, ...dataSegura } = data;

    return personaRepository.update(id, dataSegura);
  },

  eliminar: async (id) => {
    // Verifica que existe antes de eliminar
    await personaService.obtener(id);

    return personaRepository.softDelete(id);
  }

};

module.exports = personaService;