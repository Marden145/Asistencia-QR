const prisma = require('../prisma/client');

const movimientosInventarioRepository = {
    findByMesAño: (mes, año) => {
    const inicioMes = new Date(Date.UTC(año, mes - 1, 1, 0, 0, 0));
    const finMes = new Date(Date.UTC(año, mes, 1, 0, 0, 0));
    return prisma.movimientoInventario.findMany({
        where: {
            fecha: {
                gte: inicioMes,
                lt: finMes
            }
        },
        include: {
            producto: true 
        }
    });
},

    create: (data) => prisma.movimientoInventario.create({
    data
  })





};
module.exports = movimientosInventarioRepository;