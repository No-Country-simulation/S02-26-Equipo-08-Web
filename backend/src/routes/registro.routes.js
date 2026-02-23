// rutas de registro publico
// estos endpoints no requieren autenticacion

const { Router } = require("express");
const { registrarCuidador, registrarFamiliar } = require("../controllers/registro.controller");

const router = Router();

// POST /api/registro/cuidador
router.post("/cuidador", registrarCuidador);

// POST /api/registro/familiar
router.post("/familiar", registrarFamiliar);

module.exports = router;

