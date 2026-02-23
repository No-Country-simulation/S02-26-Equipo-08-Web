const prisma = require("../config/database");
const { registrarLog } = require('../utils/auditoria');

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
        // 1. Validación de fecha (fuera de la transacción por eficiencia)
        const fechaServicio = new Date(fecha_del_servicio);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaServicio < hoy) {
            throw new Error("INVALID_DATE_PAST");
        }

        const resultado = await prisma.$transaction(async (tx) => {
            
            // 2. Validación de Familiar Activo
            const familiar = await tx.usuario.findFirst({
                where: {
                    id: parseInt(id_usuario),
                    id_rol: 3,             
                    id_usuario_estado: 2   
                }
            });
            if (!familiar) throw new Error("USER_NOT_AUTHORIZED_OR_INACTIVE");

            // 3. Validación de Paciente Activo
            const paciente = await tx.paciente.findFirst({
                where: {
                    id: parseInt(id_paciente),
                    id_paciente_estado: 1  
                }
            });
            if (!paciente) throw new Error("PATIENT_NOT_FOUND_OR_INACTIVE");

            // 4. Validación de Vínculo
            const vinculoFamiliar = await tx.familiar.findFirst({
                where: {
                    id_usuario: parseInt(id_usuario),
                    id_paciente: parseInt(id_paciente)
                }
            });
            if (!vinculoFamiliar) throw new Error("NO_RELATIONSHIP_FOUND");

            // 4.B Validación de Superposición (Evitar duplicado mismo paciente, mismo día y hora)
            const pedidoDuplicado = await tx.pedido_servicio.findFirst({
                where: {
                    id_paciente: parseInt(id_paciente),
                    fecha_del_servicio: fechaServicio,
                    hora_inicio: new Date(`1970-01-01T${hora_inicio}Z`),
                    // Opcional: solo validar contra pedidos que no estén cancelados
                    id_pedido_estado: { not: 4 } // Suponiendo que 4 es 'Cancelado'
                }
            });    
            
            if (pedidoDuplicado) {
                throw new Error("DUPLICATE_ORDER_TIME");
            }


            // 5. Crear el registro del pedido
            const nuevoPedido = await tx.pedido_servicio.create({
                data: {
                    id_usuario: parseInt(id_usuario),
                    id_paciente: parseInt(id_paciente),
                    fecha_del_servicio: fechaServicio,
                    // Conversión a formato Time de PostgreSQL
                    hora_inicio: new Date(`1970-01-01T${hora_inicio}Z`), 
                    cantidad_horas_solicitadas: parseFloat(cantidad_horas_solicitadas),
                    id_pedido_estado: 1, 
                    observaciones: observaciones || ""
                }
            });

            // 6. AUDITORÍA (Exactamente como la pediste)
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
            "NO_RELATIONSHIP_FOUND": "No tiene un vínculo registrado con este paciente."
        };

        const mensaje = errorMap[error.message];
        if (mensaje) return res.status(403).json({ success: false, message: mensaje });

        console.error("Error en el registro de pedido:", error);
        next(error); 
    }
}

module.exports = { solicitarServicioAcompanamiento };