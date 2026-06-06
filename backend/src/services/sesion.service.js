const { getWeek, getYear }     = require('date-fns');
const sesionRepository         = require('../repositories/sesion.repository');
const personaRepository        = require('../repositories/persona.repository');
const asistenciaRepository     = require('../repositories/asistencia.repository');

const sesionService = {

  abrir: async () => {
    // Solo puede haber una sesión abierta por día
    const yaExiste = await sesionRepository.findAbiertaHoy();
    if (yaExiste) {
      const err = new Error('Ya hay una sesión abierta hoy');
      err.statusCode = 409;
      throw err;
    }

    const hoy    = new Date();
    const semana = getWeek(hoy, { weekStartsOn: 1 });
    const año    = getYear(hoy);

    return sesionRepository.create({ semana, año });
  },

  cerrar: async () => {
    // Verifica que haya sesión abierta
    const sesion = await sesionRepository.findAbiertaHoy();
    if (!sesion) {
      const err = new Error('No hay ninguna sesión abierta hoy');
      err.statusCode = 404;
      throw err;
    }

    // Obtiene todas las personas activas
    const todasPersonas = await personaRepository.findAll();

    // Obtiene quiénes ya marcaron presente hoy
    const presentes = await asistenciaRepository.findBySesionFecha(new Date());
    const yaAusentes = await asistenciaRepository.findByAusentesFecha(new Date());
    const genteProcesadaHoy = new Set(presentes.map(a => a.personaId));
    const totalPresentesUnicos = genteProcesadaHoy.size;
    yaAusentes.forEach(a => genteProcesadaHoy.add(a.personaId));


    // Marca como AUSENTE a quien no escaneó
    const ausentes = todasPersonas.filter(p => !genteProcesadaHoy.has(p.id));

    const hoy = new Date();
    const dia = hoy.getDate();

    if (ausentes.length > 0) {
      await Promise.all(
        ausentes.map(persona =>
          asistenciaRepository.create({
            personaId: persona.id,
            semana:    sesion.semana,
            año:       sesion.año,
            dia,
            estado:    'AUSENTE'
          })
        )
      );
    }

    // Cierra la sesión
    const sesionCerrada = await sesionRepository.cerrar(sesion.id);

    return {
      sesion:           sesionCerrada,
      totalPresentes:   totalPresentesUnicos,
      totalAusentes:    ausentes.length,
      ausentesNombres:  ausentes.map(p => `${p.nombre} ${p.apellido}`)
    };
  },

  estadoHoy: async () => {
    const sesion = await sesionRepository.findAbiertaHoy();
    return {
      sesionAbierta: !!sesion,
      sesion:        sesion || null
    };
  }
};

module.exports = sesionService;