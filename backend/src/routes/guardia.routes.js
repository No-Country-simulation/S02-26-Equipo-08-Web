const { Router } = require("express");
const guardiaController = require("../controllers/guardia.controller");

const router = Router();

router.get("/", guardiaController.obtenerGuardias);

module.exports = router;
