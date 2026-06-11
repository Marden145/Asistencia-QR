const { getWeek, getYear } = require('date-fns');
const personaRepository    = require('../repositories/persona.repository');
const asistenciaRepository = require('../repositories/asistencia.repository');
const obtenerMesYSemanaDelMes = require('../helper/obtenerMesYSemanaDelMes');
const pagoRepository = require('../repositories/pago.repository');
const asistenciaService = {

  registrarPorQR: async (codigoQR) => {

    // REGLA 1: El QR debe pertenecer a alguien
    const persona = await personaRepository.findByCodigoQR(codigoQR);
    if (!persona) {
      const err = new Error('QR no reconocido — persona no encontrada');
      err.statusCode = 404;
      throw err;
    }

    // REGLA 2: La persona debe estar activa
    if (!persona.activo) {
      const err = new Error('Esta persona está inactiva en el sistema');
      err.statusCode = 400;
      throw err;
    }

    // REGLA 3: No registrar dos veces el mismo día
    const yaRegistrado = await asistenciaRepository.findHoy(persona.id);
    if (yaRegistrado) {
      const err = new Error(`${persona.nombre} ${persona.apellido} ya fue registrado hoy`);
      err.statusCode = 409; // 409 Conflict
      throw err;
    }

    // Calcular número de semana y año automáticamente
    const hoy    = new Date();
    const semana = getWeek(hoy,   { weekStartsOn: 1 }); // semana empieza el lunes
    const año    = getYear(hoy);
    const dia    = hoy.getDate();

    // Registrar asistencia
    const asistencia = await asistenciaRepository.create({
      personaId: persona.id,
      semana,
      año,
      dia,
      estado: 'PRESENTE'
    });

    return {
      mensaje:    `✅ ${persona.nombre} ${persona.apellido} registrado como PRESENTE`,
      persona:    { id: persona.id, nombre: persona.nombre, apellido: persona.apellido },
      asistencia: { id: asistencia.id, fecha: asistencia.fecha, semana, año }
    };
  },

  // Para el dashboard — reporte semanal
  reporteSemanal: async (semana, año) => {
    const asistencias = await asistenciaRepository.findBySemana(semana, año);
    const presentes   = await asistenciaRepository.contarPorEstado(semana, año, 'PRESENTE');
    const ausentes    = await asistenciaRepository.contarPorEstado(semana, año, 'AUSENTE');

    return { asistencias, presentes, ausentes, semana, año };
  },
  metricas: async (semana, año) => {
  const [presentes, ausentes, totalPersonas, asistencias] = await Promise.all([
    asistenciaRepository.contarPorEstado(semana, año, 'PRESENTE'),
    asistenciaRepository.contarPorEstado(semana, año, 'AUSENTE'),
    personaRepository.countActivos(),
    asistenciaRepository.findBySemana(semana, año)
  ]);

  const porcentaje = totalPersonas > 0
    ? Math.round((presentes / totalPersonas) * 100)
    : 0;

  // Filtra y calcula las asistencias únicamente para el día Martes
const asistenciasMartes = asistencias.filter(a => {
  const fecha = new Date(a.fecha);
  return fecha.getDay() === 2; // 2 = Martes
});

const metricasMartes = {
  dia: 'Martes',
  presentes: asistenciasMartes.filter(a => a.estado === 'PRESENTE').length,
  ausentes:  asistenciasMartes.filter(a => a.estado === 'AUSENTE').length,
};

const porDia = [metricasMartes];

  return {
    totalPersonas,
    presentes,
    ausentes,
    porcentaje,
    porDia,
    asistencias
  };
},
tablaAsistencia: async (semana, año) => {
  const { mes, semanaDelMes } = obtenerMesYSemanaDelMes(semana, año);
  const [todasPersonas, asistencias] = await Promise.all([
    personaRepository.findAll(),           // ← trae TODAS las personas
    asistenciaRepository.findBySemana(semana, año)
  ]);

  const filasTabla = await Promise.all(todasPersonas.map(async (persona) => {
    const asistenciasPersona = asistencias.filter(
      a => a.personaId === persona.id
    );
    const pagoMensual = await pagoRepository.findByPersonaMesAño(persona.id, mes, año);
    const campoSemana = `semana${semanaDelMes}`;
    const montoSemana = pagoMensual ? (pagoMensual[campoSemana] || 0) : 0;

    const asistencia = {
  martes:    asistenciasPersona.filter(a => new Date(a.fecha).getDay() === 2),//debe ser 2
};
const reporteFinanciero = {
      monto: montoSemana,
      recibo: pagoMensual ? (pagoMensual.recibo || '—') : '—',
      estado: montoSemana > 0 ? 'CANCELADO' : 'PENDIENTE'
    };

    return { persona, asistencia,reporteFinanciero };
  }));
  return filasTabla;
}

};

module.exports = asistenciaService;