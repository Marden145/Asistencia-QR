const prisma = require('../prisma/client');
const personJuntaDirectivaRepository = {
    findAll: () => prisma.personaJuntaDirectiva.findMany({
    where:   { activo: true }
    }),
    // Busca una persona por su id
  findById: (id) => prisma.personaJuntaDirectiva.findUnique({
    where: { id }
  }),
  // Crea una persona nueva
  create: (data) => prisma.personaJuntaDirectiva.create({
    data
  }),

  // Actualiza campos de una persona
  update: (id, data) => prisma.personaJuntaDirectiva.update({
    where: { id },
    data
  }),

  // Borrado suave — no elimina el registro, solo lo desactiva
  softDelete: (id) => prisma.personaJuntaDirectiva.update({
    where: { id },
    data:  { activo: false }
  }),




};
module.exports = personJuntaDirectivaRepository;