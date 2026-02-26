const { Router } = require("express");
const {
    solicitarServicio,
    listarPedidosPorUsuario,
} = require("../controllers/pedidoServicio.controllers");

const router = Router();

// POST /api/pedidos — crear solicitud de acompañamiento
router.post("/", solicitarServicio);

// GET /api/pedidos/usuario/:idUsuario — listar solicitudes de un usuario
router.get("/usuario/:idUsuario", listarPedidosPorUsuario);

module.exports = router;
