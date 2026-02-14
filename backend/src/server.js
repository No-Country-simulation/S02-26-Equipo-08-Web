// archivo principal del servidor
// aqui se configura express y se levanta la aplicacion

// cargamos las variables de entorno desde el archivo .env
// esto debe ir al principio de todo, antes de cualquier otra importacion
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

// creamos la aplicacion de express
const app = express();

// -- middlewares globales --

// cors: permite que el frontend (que corre en otro puerto) pueda hacer peticiones al backend
app.use(cors());

// express.json: permite recibir datos en formato json en el body de las peticiones
app.use(express.json());

// -- rutas --

// montamos todas las rutas bajo el prefijo /api
// por ejemplo: /api/productos, /api/pacientes, etc.
app.use("/api", routes);

// ruta base para verificar que el servidor esta funcionando
app.get("/", (req, res) => {
  res.json({
    success: true,
    data: null,
    message: "servidor funcionando correctamente",
  });
});

// -- middleware de errores --
// debe ir despues de las rutas para capturar errores que ocurran en ellas
app.use(errorHandler);

// -- inicio del servidor --
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});
