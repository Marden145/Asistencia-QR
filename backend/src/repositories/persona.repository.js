const prisma = require('../prisma/client');

const personaRepository = {
  // Trae todas las personas activas
findAll: (mes, año) => {
  const añoActual = año || new Date().getFullYear();
  return prisma.persona.findMany({
    where: { activo: true },
    orderBy: [
      { nombre: 'asc' },
      { apellido: 'asc' }
    ],
    include: {
      pagos: {
        where: {
          mes: mes,
          año: añoActual
        },
        select: {
          total: true 
        }
      }
    }
  });
},

  // Busca una persona por su id
  findById: (id) => prisma.persona.findUnique({
    where: { id }
  }),

  // Busca una persona por su codigoQR (para el escaneo)
  findByCodigoQR: (codigoQR) => prisma.persona.findUnique({
    where: { codigoQR }
  }),

  // Crea una persona nueva
  create: (data) => prisma.persona.create({
    data
  }),

  // Actualiza campos de una persona
  update: (id, data) => prisma.persona.update({
    where: { id },
    data
  }),

  // Borrado suave — no elimina el registro, solo lo desactiva
  softDelete: (id) => prisma.persona.update({
    where: { id },
    data:  { activo: false }
  }),
  countActivos: () => prisma.persona.count({
  where: { activo: true }
}) 

};

module.exports = personaRepository;