const { Router } = require("express");
const router = Router();
// Importación directa de la función
const { getDashboardSummary } = require('../controllers/dashboard.controller');
const { verificarToken } = require('../middlewares/auth.middleware'); 

// Si getDashboardSummary es undefined aquí, Express lanzará el error que viste
router.get('/summary', verificarToken, getDashboardSummary);

module.exports = router;