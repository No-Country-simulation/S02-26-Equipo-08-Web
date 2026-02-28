const prisma = require("../config/database");

/**
 * Función Helper para registrar auditoría en cualquier parte del sistema
 */
const registrarLog = async ({ id_usuario, accion, tabla, detalles, req }) => {
    try {
        await prisma.log_auditoria.create({
            data: {
                id_usuario: id_usuario || 0,
                accion: accion,
                tabla_afectada: tabla,
                valor_nuevo: detalles || {},
                // Captura la IP automáticamente desde el request
                ip_direccion: req 
                    ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || "127.0.0.1") 
                    : "SISTEMA"
            }
        });
    } catch (error) {
        // Logueamos el error en consola para no romper la ejecución del controlador principal
        console.error("Error al grabar log de auditoría:", error);
    }
};

module.exports = { registrarLog };