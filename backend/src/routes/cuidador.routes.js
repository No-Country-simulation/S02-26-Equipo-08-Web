const { Router } = require("express");
const { registrarCuidador, listarCuidadoresActivos } = require('../controllers/cuidador.controllers');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = Router();

// GET /api/cuidadores/activos — lista de cuidadores activos (solo admin)
router.get('/activos', verificarToken, listarCuidadoresActivos);

router.post('/registrar', registrarCuidador);

module.exports = router;
