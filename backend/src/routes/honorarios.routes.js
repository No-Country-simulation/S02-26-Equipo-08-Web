const { Router } = require("express");
const {
    listarHonorarios,
    listarMisHonorarios,
} = require("../controllers/honorarios.controllers");

const router = Router();

// GET /api/honorarios — admin: todos los cuidadores con totales
router.get("/", listarHonorarios);

// GET /api/honorarios/usuario/:idUsuario — cuidador: sus propios honorarios
router.get("/usuario/:idUsuario", listarMisHonorarios);

module.exports = router;
