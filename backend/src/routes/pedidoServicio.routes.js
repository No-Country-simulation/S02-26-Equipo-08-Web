const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoServicio.controllers');

// POST /api/pedidos/solicitar
router.post('/solicitarServicio', pedidoController.solicitarServicioAcompanamiento);

module.exports = router;