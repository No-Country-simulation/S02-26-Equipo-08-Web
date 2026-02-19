const { prisma } = require("../config/database");

const crearLog = async (req, res) => {
  try {
    const { id_usuario, accion, tabla_afectada, valor_anterior, valor_nuevo } = req.body;
    
    // Captura de IP segura
    const ip_direccion = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "127.0.0.1";

    const nuevoLog = await prisma.log_auditoria.create({
      data: {
        id_usuario: parseInt(id_usuario),
        accion,
        tabla_afectada,
        valor_anterior: valor_anterior || null,
        valor_nuevo: valor_nuevo || null,
        ip_direccion: ip_direccion.toString()
      }
    });

    res.status(201).json(nuevoLog);
  } catch (error) {
    console.error("Error en el controlador de auditoría:", error);
    res.status(500).json({ message: "Error al registrar log" });
  }
};

// Exportamos como objeto para que sea compatible con { crearLog }
module.exports = { crearLog };