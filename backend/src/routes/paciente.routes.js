const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente.controllers');

// Ruta para dar de alta un paciente
// La URL completa será: /api/pacientes/registrar
router.post('/registrar', pacienteController.registrarPaciente);

// Aquí podrías agregar más rutas en el futuro, como:
// router.get('/:id', pacienteController.obtenerPaciente);

module.exports = router;