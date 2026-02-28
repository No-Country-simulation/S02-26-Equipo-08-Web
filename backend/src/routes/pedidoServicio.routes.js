const { Router } = require("express");
const {
    solicitarServicio,
    solicitarServicioAcompanamiento,
    listarPedidosPorUsuario,
    listarSolicitudesAdmin,
    obtenerSolicitudPorId,
    listarAsignacionesCuidador,
    listarTareas,
    asignarCuidador,
    desasignarCuidador,
    iniciarServicio,
    finalizarServicio,
    cancelarServicio,
} = require("../controllers/pedidoServicio.controllers");
const { verificarToken } = require("../middlewares/auth.middleware");

const router = Router();

// GET /api/pedidos — listado completo para admin (requiere token rol=1)
router.get("/", verificarToken, listarSolicitudesAdmin);

// GET /api/pedidos/tareas — tareas disponibles para asignación (solo admin)
router.get("/tareas", verificarToken, listarTareas);

// POST /api/pedidos — crear solicitud de acompañamiento (versión simple)
router.post("/", solicitarServicio);

// POST /api/pedidos/solicitarServicio — versión transaccional con auditoría
router.post("/solicitarServicio", solicitarServicioAcompanamiento);

// GET /api/pedidos/usuario/:idUsuario — listar solicitudes de un usuario
router.get("/usuario/:idUsuario", listarPedidosPorUsuario);

// GET /api/pedidos/mis-asignaciones — solicitudes asignadas al cuidador autenticado
router.get("/mis-asignaciones", verificarToken, listarAsignacionesCuidador);

// POST /api/pedidos/:id/asignar — asignar cuidador a solicitud pendiente (solo admin)
router.post("/:id/asignar", verificarToken, asignarCuidador);

// DELETE /api/pedidos/:id/asignar — desasignar cuidador y volver el pedido a Pendiente (solo admin)
router.delete("/:id/asignar", verificarToken, desasignarCuidador);

// PATCH /api/pedidos/:id/iniciar — iniciar servicio (cuidador o admin)
router.patch("/:id/iniciar", verificarToken, iniciarServicio);

// PATCH /api/pedidos/:id/finalizar — finalizar servicio con informe (cuidador o admin)
router.patch("/:id/finalizar", verificarToken, finalizarServicio);

// PATCH /api/pedidos/:id/cancelar — cancelar servicio (cuidador, familiar o admin)
router.patch("/:id/cancelar", verificarToken, cancelarServicio);

// GET /api/pedidos/:id — detalle de una solicitud (debe ir al final para no capturar rutas estáticas)
router.get("/:id", verificarToken, obtenerSolicitudPorId);

module.exports = router;
