const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.rol.createMany({
    data: [
      { descripcion: 'Admin' },
      { descripcion: 'Cuidador' },
      { descripcion: 'Familiar' },
    ],
    skipDuplicates: true, // Evita errores si ya existen
  });
  console.log("Roles insertados correctamente");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());