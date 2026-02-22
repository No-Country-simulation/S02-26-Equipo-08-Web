const { Router } = require("express");

const {
    buscarUsuarioEmail,
    desbloquearUsuario,
    listarUsuarios,
    obtenerUsuarioPorId
} = require('../controllers/usuario.controllers')

const router = Router();

router.get('/buscarUsuarioEmail/:email', buscarUsuarioEmail)
router.get('/listar', listarUsuarios)
/**
 * Endpoint para desbloquear usuarios
 * Se usa PATCH ya que es una actualización parcial de los datos del usuario
 */
router.patch('/desbloquear/:id', desbloquearUsuario);
router.get('/:id', obtenerUsuarioPorId)   // siempre al final (catch-all por el :id)

module.exports = router
