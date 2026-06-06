const prisma = require('../prisma/client');

const productoRepository={

    findAll: () => prisma.producto.findMany({
    where:   { activo: true }
  }),
  findById: (id) => prisma.producto.findUnique({
    where: { id }
  }),
  create: (data) => prisma.producto.create({
    data
  }),  
  update: (id, data) => prisma.producto.update({
    where: { id },
    data
  }),
  softDelete: (id) => prisma.producto.update({
    where: { id },
    data:  { activo: false }
  }),
  recordExpenses: (id,cantidad)=>prisma.producto.update({
    where: { id },
    data: { cantidad }
  }),
  recordRevenue: (id,cantidad)=>prisma.producto.update({
    where: { id },
    data: { cantidad }
  })

};
module.exports = productoRepository;