const prisma = require('../prisma/client');

const asistenciaRepository = {

  // Crea un registro de asistencia
  createMany: (registros) =>
    prisma.asistencia.createMany({
      data: registros,
      skipDuplicates: true
    }),
    // Crea un registro de asistencia
  create: (data) => prisma.asistencia.create({
    data,
    include: { persona: true } // devuelve también los datos de la persona
  }),

  // Busca si ya hay asistencia hoy para esta persona
  findHoy: (personaId) => {
    const hoy   = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const fin    = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

    return prisma.asistencia.findFirst({
      where: {
        personaId,
        estado: 'PRESENTE',
        fecha: { gte: inicio, lte: fin }
      }
    });
  },

  // Trae todas las asistencias de una semana específica
  findBySemana: (semana, año) => prisma.asistencia.findMany({
    where:   { semana, año },
    include: { persona: true },
    orderBy: { fecha: 'asc' }
  }),

  // Cuenta por estado en una semana
  contarPorEstado: (semana, año, estado) => prisma.asistencia.count({
    where: { semana, año, estado }
  }),
  // Busca presentes de hoy para saber quién ya escaneó
findBySesionFecha: (fecha) => {
  const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0);
  const fin    = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59);

  return prisma.asistencia.findMany({
    where: {
      estado: 'PRESENTE',
      fecha:  { gte: inicio, lte: fin }
    }
  });
},
findByAusentesFecha: (fecha) => {
  const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0);
  const fin    = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59);

  return prisma.asistencia.findMany({
    where: {
      estado: 'AUSENTE',
      fecha:  { gte: inicio, lte: fin }
    }
  });
}

};

module.exports = asistenciaRepository;