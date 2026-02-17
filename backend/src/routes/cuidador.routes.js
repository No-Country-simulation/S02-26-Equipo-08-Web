const { Router } = require("express");

const {registrarCuidador} = require('../controllers/cuidador.controllers')


const router = Router();


router.post('/registrar', registrarCuidador)

module.exports = router
