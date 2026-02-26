const prisma = require("../config/database");
const { registrarLog } = require('../utils/auditoria');

// crear solicitud de acompañamiento (versión simple)
const solicitarServicio = async (req, res, next) => {
    try {
        const {
            id_usuario,
            id_paciente,
            fecha_del_servicio,
            hora_inicio,
            cantidad_horas_solicitadas,
            observaciones,
        } = req.body;

        if (!id_usuario || !id_paciente || !fecha_del_servicio || !hora_inicio || !cantidad_horas_solicitadas) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos obligatorios deben completarse.",
            });
        }

        const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(id_usuario) } });
        if (!usuario || usuario.id_rol !== 3 || usuario.id_usuario_estado !== 2) {
            return res.status(403).json({
                success: false,
                message: "Usuario no autorizado o inactivo.",
                errorCode: "USER_NOT_AUTHORIZED_OR_INACTIVE",
            });
        }

        const paciente = await prisma.paciente.findUnique({ where: { id: parseInt(id_paciente) } });
        if (!paciente || paciente.id_paciente_estado !== 1) {
            return res.status(404).json({
                success: false,
                message: "Paciente no encontrado o inactivo.",
                errorCode: "PATIENT_NOT_FOUND_OR_INACTIVE",
            });
        }

        const vinculo = await prisma.familiar.findFirst({
            where: { id_usuario: parseInt(id_usuario), id_paciente: parseInt(id_paciente) },
        });
        if (!vinculo) {
            return res.status(403).json({
                success: false,
                message: "No existe vínculo familiar con este paciente.",
                errorCode: "NO_RELATIONSHIP_FOUND",
            });
        }

        const fechaServicio = new Date(fecha_del_servicio);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaServicio < hoy) {
            return res.status(400).json({
                success: false,
                message: "La fecha del servicio no puede ser anterior a hoy.",
                errorCode: "INVALID_DATE_PAST",
            });
        }

        const nuevoPedido = await prisma.pedido_servicio.create({
            data: {
                id_usuario: parseInt(id_usuario),
                id_paciente: parseInt(id_paciente),
                fecha_del_servicio: fechaServicio,
                hora_inicio: new Date(`1970-01-01T${hora_inicio}`),
                cantidad_horas_solicitadas: parseFloat(cantidad_horas_solicitadas),
                id_pedido_estado: 1,
                observaciones: observaciones || null,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Solicitud de acompañamiento creada exitosamente.",
            data: nuevoPedido,
        });
    } catch (error) {
        console.error("solicitarServicio error:", error);
        next(error);
    }
};

// crear solicitud de acompañamiento (versión transaccional con auditoría)
async function solicitarServicioAcompanamiento(req, res, next) {
    const {
        id_usuario,
        id_paciente,
        fecha_del_servicio,
        hora_inicio,
        cantidad_horas_solicitadas,
        observaciones
    } = req.body;

    try {
        const fechaServicio = new Date(fecha_del_servicio);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaServicio < hoy) {
            throw new Error("INVALID_DATE_PAST");
        }

        const resultado = await prisma.$transaction(async (tx) => {
            const familiar = await tx.usuario.findFirst({
                where: {
                    id: parseInt(id_usuario),
                    id_rol: 3,
                    id_usuario_estado: 2
                }
            });
            if (!familiar) throw new Error("USER_NOT_AUTHORIZED_OR_INACTIVE");

            const paciente = await tx.paciente.findFirst({
                where: {
                    id: parseInt(id_paciente),
                    id_paciente_estado: 1
                }
            });
            if (!paciente) throw new Error("PATIENT_NOT_FOUND_OR_INACTIVE");

            const vinculoFamiliar = await tx.familiar.findFirst({
                where: {
                    id_usuario: parseInt(id_usuario),
                    id_paciente: parseInt(id_paciente)
                }
            });
            if (!vinculoFamiliar) throw new Error("NO_RELATIONSHIP_FOUND");

            const pedidoDuplicado = await tx.pedido_servicio.findFirst({
                where: {
                    id_paciente: parseInt(id_paciente),
                    fecha_del_servicio: fechaServicio,
                    hora_inicio: new Date(`1970-01-01T${hora_inicio}Z`),
                    id_pedido_estado: { not: 4 }
                }
            });
            if (pedidoDuplicado) {
                throw new Error("DUPLICATE_ORDER_TIME");
            }

            const nuevoPedido = await tx.pedido_servicio.create({
                data: {
                    id_usuario: parseInt(id_usuario),
                    id_paciente: parseInt(id_paciente),
                    fecha_del_servicio: fechaServicio,
                    hora_inicio: new Date(`1970-01-01T${hora_inicio}Z`),
                    cantidad_horas_solicitadas: parseFloat(cantidad_horas_solicitadas),
                    id_pedido_estado: 1,
                    observaciones: observaciones || ""
                }
            });

            await registrarLog({
                tx,
                id_usuario: id_usuario,
                accion: 'SOLICITUD_SERVICIO',
                tabla: 'pedido_servicio',
                detalles: {
                    pedido_id: nuevoPedido.id,
                    paciente: `${paciente.nombre} ${paciente.apellido}`
                },
                req: req
            });

            return nuevoPedido;
        });

        return res.status(201).json({
            success: true,
            message: "Solicitud registrada y auditada correctamente.",
            data: resultado
        });

    } catch (error) {
        const errorMap = {
            "INVALID_DATE_PAST": "La fecha del servicio no puede ser anterior a hoy.",
            "USER_NOT_AUTHORIZED_OR_INACTIVE": "Usuario no autorizado o inactivo.",
            "PATIENT_NOT_FOUND_OR_INACTIVE": "El paciente no existe o no está activo.",
            "NO_RELATIONSHIP_FOUND": "No tiene un vínculo registrado con este paciente.",
            "DUPLICATE_ORDER_TIME": "Ya existe un pedido para ese paciente en la misma fecha y hora."
        };

        const mensaje = errorMap[error.message];
        if (mensaje) return res.status(403).json({ success: false, message: mensaje });

        console.error("Error en el registro de pedido:", error);
        next(error);
    }
}

// listar solicitudes de un usuario
const listarPedidosPorUsuario = async (req, res, next) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);
        if (isNaN(idUsuario)) {
            return res.status(400).json({ success: false, message: "ID de usuario inválido." });
        }

        const pedidos = await prisma.$queryRawUnsafe(`
            SELECT
                ps.id,
                ps.fecha_del_servicio,
                ps.hora_inicio,
                ps.cantidad_horas_solicitadas,
                ps.observaciones,
                ps.id_pedido_estado,
                pe.descripcion AS estado,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido
            FROM pedido_servicio ps
            LEFT JOIN pedido_estado pe ON pe.id = ps.id_pedido_estado
            JOIN paciente p ON p.id = ps.id_paciente
            WHERE ps.id_usuario = $1
            ORDER BY ps.id DESC
        `, idUsuario);

        return res.status(200).json({
            success: true,
            data: pedidos,
            total: pedidos.length,
        });
    } catch (error) {
        console.error("listarPedidosPorUsuario error:", error);
        next(error);
    }
};

module.exports = {
    solicitarServicio,
    solicitarServicioAcompanamiento,
    listarPedidosPorUsuario,
};
