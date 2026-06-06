const prisma = require('../prisma/client');

const sesionRepository = {

  // Busca si hay sesión abierta hoy
  findAbiertaHoy: () => {
    const hoy   = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const fin    = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

    return prisma.sesion.findFirst({
      where: {
        abierta: true,
        fecha: { gte: inicio, lte: fin }
      }
    });
  },

  create: (data) => prisma.sesion.create({ data }),

  // Cierra la sesión y devuelve el objeto actualizado
  cerrar: (id) => prisma.sesion.update({
    where: { id },
    data:  { abierta: false, cerradaAt: new Date() }
  }),

  findAll: () => prisma.sesion.findMany({
    orderBy: { fecha: 'desc' }
  })
};

module.exports = sesionRepository;