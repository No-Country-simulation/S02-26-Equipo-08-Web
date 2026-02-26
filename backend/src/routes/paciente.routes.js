const { Router } = require("express");
const {
    listarPacientesPorFamiliar,
    obtenerPaciente,
    crearPaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente,
    listarParentescos,
} = require("../controllers/paciente.controllers");

const router = Router();

// GET /api/pacientes/parentescos — lista de parentescos disponibles
router.get("/parentescos", listarParentescos);

// GET /api/pacientes/familiar/:idUsuario — pacientes vinculados a un familiar
router.get("/familiar/:idUsuario", listarPacientesPorFamiliar);

// POST /api/pacientes/registrar — dar de alta paciente (transaccional con auditoría)
router.post("/registrar", registrarPaciente);

// POST /api/pacientes — crear paciente y vincular a familiar
router.post("/", crearPaciente);

// PUT /api/pacientes/:id — actualizar datos de un paciente
router.put("/:id", actualizarPaciente);

// DELETE /api/pacientes/:id/familiar/:idUsuario — eliminar paciente
router.delete("/:id/familiar/:idUsuario", eliminarPaciente);

// GET /api/pacientes/:id — detalle de un paciente (siempre al final)
router.get("/:id", obtenerPaciente);

module.exports = router;
