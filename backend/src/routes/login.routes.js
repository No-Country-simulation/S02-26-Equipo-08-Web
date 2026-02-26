const { Router } = require("express");
// 1. Importamos AMBAS funciones del controlador
const { login, solicitarRecuperacion, restablecerPassword } = require('../controllers/login.controllers'); 

const router = Router();

// Ruta: POST /api/login (Inicio de sesión normal)
router.post('/', login);

// Ruta: POST /api/login/forgot-password (Recuperación de contraseña)
router.post("/forgot-password", solicitarRecuperacion);
router.post("/reset-password", restablecerPassword);
router.post('/', login);

module.exports = router;