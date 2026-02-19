// src/routes/auditoria.routes.js
const { Router } = require("express");
const { crearLog } = require("../controllers/auditoria.controllers");

const router = Router();

router.post("/", crearLog);

module.exports = router;