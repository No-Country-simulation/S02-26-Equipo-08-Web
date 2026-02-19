const { Router } = require("express");

const {buscarUsuarioEmail,
       desbloquearUsuario
} = require('../controllers/usuario.controllers')


const router = Router();


router.get('/buscarUsuarioEmail/:email', buscarUsuarioEmail)
/**
 * Endpoint para desbloquear usuarios
 * Se usa PATCH ya que es una actualización parcial de los datos del usuario
 */
router.patch('/desbloquear/:id', desbloquearUsuario);

module.exports = router
