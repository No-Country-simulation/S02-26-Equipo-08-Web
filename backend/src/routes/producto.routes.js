// rutas de productos
// aqui se definen las rutas (endpoints) relacionadas con productos
// cada ruta apunta a una funcion del controller
// para agregar nuevas rutas, segui el mismo patron: router.metodo("/ruta", controller.funcion)

const { Router } = require("express");
const productoController = require("../controllers/producto.controller");

const router = Router();

// POST / -> crear un nuevo producto
// ejemplo de uso: POST http://localhost:3000/api/productos
// body: { "nombre": "laptop", "precio": 999.99, "stock": 10 }
router.post("/", productoController.crearProducto);

// GET / -> obtener todos los productos
// ejemplo de uso: GET http://localhost:3000/api/productos
router.get("/", productoController.obtenerProductos);

module.exports = router;
