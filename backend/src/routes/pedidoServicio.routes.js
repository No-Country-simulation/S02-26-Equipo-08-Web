const { Router } = require("express");
const {
    solicitarServicio,
    solicitarServicioAcompanamiento,
    listarPedidosPorUsuario,
} = require("../controllers/pedidoServicio.controllers");

const router = Router();

// POST /api/pedidos — crear solicitud de acompañamiento (versión simple)
router.post("/", solicitarServicio);

// POST /api/pedidos/solicitarServicio — versión transaccional con auditoría
router.post("/solicitarServicio", solicitarServicioAcompanamiento);

// GET /api/pedidos/usuario/:idUsuario — listar solicitudes de un usuario
router.get("/usuario/:idUsuario", listarPedidosPorUsuario);

module.exports = router;
