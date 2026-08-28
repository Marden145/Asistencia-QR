//limpiar los test
afterAll(async () => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  await prisma.$disconnect();
});
