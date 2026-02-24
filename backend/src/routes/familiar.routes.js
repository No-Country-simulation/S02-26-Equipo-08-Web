const { Router } = require("express");

const {registrarFamiliar} = require('../controllers/familiar.controllers')


const router = Router();


router.post('/registrar', registrarFamiliar)

module.exports = router
