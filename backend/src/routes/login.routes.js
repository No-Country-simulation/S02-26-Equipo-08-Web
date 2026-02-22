const { Router } = require("express");
// Importamos el controlador que creamos antes
const { login } = require('../controllers/login.controllers'); 
const router = Router();

// Ruta: POST /api/auth/login
router.post('/', login);

module.exports = router;