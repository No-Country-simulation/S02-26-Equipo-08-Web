const { Router } = require("express");
const {
    listarPacientesPorFamiliar,
    obtenerPaciente,
    crearPaciente,
    actualizarPaciente,
    listarParentescos,
} = require("../controllers/paciente.controllers");

const router = Router();

// GET /api/pacientes/parentescos — lista de parentescos disponibles
router.get("/parentescos", listarParentescos);

// GET /api/pacientes/familiar/:idUsuario — pacientes vinculados a un familiar
router.get("/familiar/:idUsuario", listarPacientesPorFamiliar);

// GET /api/pacientes/:id — detalle de un paciente
router.get("/:id", obtenerPaciente);

// POST /api/pacientes — crear paciente y vincular a familiar
router.post("/", crearPaciente);

// PUT /api/pacientes/:id — actualizar datos de un paciente
router.put("/:id", actualizarPaciente);

module.exports = router;
