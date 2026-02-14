// middleware centralizado para manejo de errores
// este middleware captura cualquier error que ocurra en los controllers
// y responde con un formato json consistente
// importante: debe tener 4 parametros (err, req, res, next) para que express lo reconozca como middleware de errores

const errorHandler = (err, req, res, next) => {
  // mostramos el error en la consola para poder debuggear
  console.error("error:", err.message);

  // definimos el codigo de estado http (500 si no se especifico otro)
  const statusCode = err.statusCode || 500;

  // respondemos con el formato json consistente
  res.status(statusCode).json({
    success: false,
    data: null,
    message: err.message || "error interno del servidor",
  });
};

module.exports = errorHandler;
