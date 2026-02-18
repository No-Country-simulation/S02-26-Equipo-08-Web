// archivo central de rutas
// aqui se importan y registran todas las rutas de la aplicacion
// cuando crees un nuevo modulo (ej: pacientes, sesiones), agrega sus rutas aca

const express = require("express");
const router = express.Router();

const productoRoutes = require("./producto.routes");

const guardiaRoutes = require("./guardia.routes");

// montamos las rutas de productos bajo /productos
// esto significa que todas las rutas de producto.routes.js
// van a tener el prefijo /api/productos (el /api se agrega en server.js)
router.use("/productos", productoRoutes);

// para agregar nuevas rutas, segui este patron:
// const nuevaRuta = require("./nueva.routes");
// router.use("/nueva-ruta", nuevaRuta);

// rutas de guardias
router.use("/guardias", guardiaRoutes);

module.exports = router;
