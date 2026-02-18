const { Router } = require("express");

const { buscarUsuarioEmail, listarUsuarios } = require('../controllers/usuario.controllers')


const router = Router();


router.get('/buscarUsuarioEmail/:email', buscarUsuarioEmail)
router.get('/listar', listarUsuarios)

module.exports = router
