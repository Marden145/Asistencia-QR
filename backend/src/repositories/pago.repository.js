const prisma = require('../prisma/client');

const pagoRepository = {

  // Busca el pago de una persona en un mes/año específico
  findByPersonaMesAño: (personaId, mes, año) =>
    prisma.pago.findUnique({
      where: { personaId_mes_año: { personaId, mes, año } }
    }),

  // Crea o actualiza — si ya existe ese mes lo sobreescribe
  upsert: (personaId, mes, año, data) =>
    prisma.pago.upsert({
      where:  { personaId_mes_año: { personaId, mes, año } },
      create: { personaId, mes, año, ...data },
      update: { ...data, actualizadoAt: new Date() }
    }),

  // Historial completo de pagos de una persona
  findAllByPersona: (personaId) =>
    prisma.pago.findMany({
      where:   { personaId },
      orderBy: [{ año: 'desc' }, { mes: 'desc' }]
    }),

  // Todos los pagos de un mes/año (para reportes)
  findByMesAño: (mes, año) =>
    prisma.pago.findMany({
      where:   { mes, año },
      include: { persona: true },
      orderBy: { persona: { apellido: 'asc' } }
    }),
    // Obtiene el resumen de ingresos y estados de pago por semanas para el dashboard
  obtenerResumenDashboard: (mes, año) =>
    prisma.$queryRaw`SELECT * FROM obtener_resumen_dashboard(${mes}, ${año})`
    
};

module.exports = pagoRepository;