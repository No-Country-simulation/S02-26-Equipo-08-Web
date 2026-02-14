// controller de productos
// aqui va toda la logica de negocio relacionada con productos
// cada funcion maneja una accion especifica (crear, listar, etc.)
// si necesitas agregar mas acciones, crea nuevas funciones siguiendo el mismo patron

const prisma = require("../config/database");

// crear un nuevo producto
// recibe los datos del producto en req.body
const crearProducto = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    // validacion basica: verificamos que los campos obligatorios existan
    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        data: null,
        message:
          "faltan campos obligatorios: nombre, precio y stock son requeridos",
      });
    }

    // creamos el producto en la base de datos usando prisma
    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        precio,
        stock,
      },
    });

    // respondemos con el producto creado
    res.status(201).json({
      success: true,
      data: producto,
      message: "producto creado exitosamente",
    });
  } catch (error) {
    // si ocurre un error, lo pasamos al middleware de errores
    next(error);
  }
};

// obtener todos los productos
const obtenerProductos = async (req, res, next) => {
  try {
    // buscamos todos los productos en la base de datos
    const productos = await prisma.producto.findMany({
      orderBy: {
        createdAt: "desc", // ordenamos por fecha de creacion, los mas recientes primero
      },
    });

    // respondemos con la lista de productos
    res.status(200).json({
      success: true,
      data: productos,
      message: "productos obtenidos exitosamente",
    });
  } catch (error) {
    // si ocurre un error, lo pasamos al middleware de errores
    next(error);
  }
};

// exportamos las funciones para usarlas en las rutas
module.exports = {
  crearProducto,
  obtenerProductos,
};
