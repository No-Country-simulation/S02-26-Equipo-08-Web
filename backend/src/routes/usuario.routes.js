const { Router } = require("express");

const {buscarUsuarioEmail} = require('../controllers/usuario.controllers')


const router = Router();


router.get('/buscarUsuarioEmail/:email', buscarUsuarioEmail)

module.exports = router
