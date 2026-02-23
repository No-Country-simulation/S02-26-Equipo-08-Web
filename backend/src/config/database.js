// configuracion de la conexion a la base de datos usando prisma
// este archivo crea una unica instancia de prisma client (patron singleton)
// y la exporta para que todos los controllers la usen

const { PrismaClient } = require("@prisma/client");
// creamos una sola instancia de prisma client para toda la aplicacion
// esto evita crear multiples conexiones a la base de datos
const prisma = new PrismaClient();

// exportamos la instancia para usarla en los controllers
module.exports = prisma;
