const pagoRepository = require('../repositories/pago.repository');

const pagoService = {

  guardar: async (personaId, mes, año, semanas) => {
    const { semana1 = 0, semana2 = 0, semana3 = 0, semana4 = 0, notas } = semanas;

    // Valida que los montos sean números positivos
    const montos = [semana1, semana2, semana3, semana4];
    if (montos.some(m => isNaN(m) || m < 0)) {
      const err = new Error('Los montos no pueden ser negativos');
      err.statusCode = 400;
      throw err;
    }

    // Calcula el total en el backend también — no confiar solo en el frontend
    const total = montos.reduce((sum, m) => sum + Number(m), 0);

    return pagoRepository.upsert(personaId, mes, año, {
      semana1: Number(semana1),
      semana2: Number(semana2),
      semana3: Number(semana3),
      semana4: Number(semana4),
      total,
      notas
    });
  },

  obtenerPorMes: async (personaId, mes, año) => {
    const pago = await pagoRepository.findByPersonaMesAño(personaId, mes, año);

    // Si no existe ese mes, devuelve estructura vacía
    return pago || {
      personaId, mes, año,
      semana1: 0, semana2: 0,
      semana3: 0, semana4: 0,
      total: 0, notas: ''
    };
  },

  historial: async (personaId) => {
    return pagoRepository.findAllByPersona(personaId);
  },

  reporteMensual: async (mes, año) => {
    return pagoRepository.findByMesAño(mes, año);
  }
};

module.exports = pagoService;