// archivo central de rutas
// aqui se importan y registran todas las rutas de la aplicacion
// cuando crees un nuevo modulo (ej: pacientes, sesiones), agrega sus rutas aca

const { Router } = require("express");
const productoRoutes = require("./producto.routes");
const usuarioRoutes = require('./usuario.routes')
const familiarRoutes = require('./familiar.routes')
const loginRoutes = require('./login.routes')
const cuidadorRoutes = require('./cuidador.routes')
const auditoriaRoutes = require('./auditoria.routes')
const registroRoutes = require('./registro.routes')
const documentoRoutes = require('./documento.routes')
const pacienteRoutes = require('./paciente.routes')

const router = Router();

// montamos las rutas de productos bajo /productos
// esto significa que todas las rutas de producto.routes.js
// van a tener el prefijo /api/productos (el /api se agrega en server.js)
router.use("/productos", productoRoutes);
router.use('/usuarios', usuarioRoutes)
router.use('/familiares', familiarRoutes)
router.use('/cuidadores', cuidadorRoutes)
router.use('/login', loginRoutes)
router.use('/auditoria', auditoriaRoutes)
router.use('/registro', registroRoutes)
router.use('/documentos', documentoRoutes)
router.use('/pacientes', pacienteRoutes)

// para agregar nuevas rutas, segui este patron:
// const nuevaRuta = require("./nueva.routes");
// router.use("/nueva-ruta", nuevaRuta);

module.exports = router;
