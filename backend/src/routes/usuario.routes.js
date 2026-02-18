const { Router } = require("express");

const { buscarUsuarioEmail, listarUsuarios, obtenerUsuarioPorId } = require('../controllers/usuario.controllers')

const router = Router();

router.get('/buscarUsuarioEmail/:email', buscarUsuarioEmail)
router.get('/listar', listarUsuarios)
router.get('/:id', obtenerUsuarioPorId)

module.exports = router
