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

// listar todas las solicitudes (solo admin — rol=1)
const listarSolicitudesAdmin = async (req, res, next) => {
    try {
        // --- 1. Auth ---
        console.log("[solicitudesAdmin] req.user:", req.user);
        if (!req.user || Number(req.user.role) !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado. Solo administradores." });
        }

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const offset = (page - 1) * limit;
        const { estado, busqueda, fechaInicio, fechaFin } = req.query;

        // --- 2. COUNT simple (sin JOINs extras) ---
        const countResult = await prisma.$queryRawUnsafe(
            `SELECT COUNT(*)::int AS total FROM pedido_servicio`
        );
        const total = Number(countResult[0]?.total ?? 0);
        console.log("[solicitudesAdmin] total pedidos:", total);

        // --- 3. Construir WHERE para data query ---
        const whereClauses = [];
        const params = [];
        let idx = 1;

        if (busqueda && busqueda.trim()) {
            const term = `%${busqueda.toLowerCase()}%`;
            whereClauses.push(`(LOWER(pac.nombre || ' ' || pac.apellido) LIKE $${idx} OR LOWER(pf.nombre || ' ' || pf.apellido) LIKE $${idx})`);
            params.push(term);
            idx++;
        }
        if (estado) {
            whereClauses.push(`ps.id_pedido_estado = $${idx}`);
            params.push(parseInt(estado));
            idx++;
        }
        if (fechaInicio) {
            whereClauses.push(`ps.fecha_del_servicio::date >= $${idx}::date`);
            params.push(fechaInicio);
            idx++;
        }
        if (fechaFin) {
            whereClauses.push(`ps.fecha_del_servicio::date <= $${idx}::date`);
            params.push(fechaFin);
            idx++;
        }
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

        // --- 4. Data query ---
        const dataQuery = `
            SELECT
                ps.id,
                ps.fecha_del_servicio,
                ps.hora_inicio,
                ps.cantidad_horas_solicitadas,
                ps.observaciones,
                ps.id_pedido_estado,
                pe.descripcion                AS estado,
                pac.nombre                    AS paciente_nombre,
                pac.apellido                  AS paciente_apellido,
                pf.nombre                     AS familiar_nombre,
                pf.apellido                   AS familiar_apellido,
                u.email                       AS familiar_email,
                pc.nombre                     AS cuidador_nombre,
                pc.apellido                   AS cuidador_apellido
            FROM pedido_servicio ps
            LEFT JOIN pedido_estado      pe  ON pe.id          = ps.id_pedido_estado
            LEFT JOIN paciente           pac ON pac.id         = ps.id_paciente
            LEFT JOIN usuario            u   ON u.id           = ps.id_usuario
            LEFT JOIN persona            pf  ON pf.id_usuario  = ps.id_usuario
            LEFT JOIN asignacion_servico a   ON a.id           = (
                SELECT MAX(a2.id) FROM asignacion_servico a2 WHERE a2.id_pedido = ps.id
            )
            LEFT JOIN cuidador           c   ON c.id           = a.id_cuidador
            LEFT JOIN persona            pc  ON pc.id_usuario  = c.id_usuario
            ${whereStr}
            ORDER BY ps.id DESC
            LIMIT $${idx} OFFSET $${idx + 1}
        `;

        console.log("[solicitudesAdmin] whereStr:", whereStr || "(sin filtros)");

        const solicitudes = await prisma.$queryRawUnsafe(dataQuery, ...params, limit, offset);
        console.log("[solicitudesAdmin] filas devueltas:", solicitudes.length);

        // Para el count con filtros aplicamos el mismo WHERE en una query separada
        let totalFiltrado = total;
        if (whereClauses.length > 0) {
            const countFiltradoResult = await prisma.$queryRawUnsafe(
                `SELECT COUNT(*)::int AS total
                 FROM pedido_servicio ps
                 LEFT JOIN paciente pac ON pac.id = ps.id_paciente
                 LEFT JOIN persona   pf ON pf.id_usuario = ps.id_usuario
                 ${whereStr}`,
                ...params
            );
            totalFiltrado = Number(countFiltradoResult[0]?.total ?? 0);
        }

        const totalPages = Math.ceil(totalFiltrado / limit);

        return res.status(200).json({
            success: true,
            data: { solicitudes, total: totalFiltrado, totalPages },
            message: "OK",
        });
    } catch (error) {
        console.error("[solicitudesAdmin] ERROR:", error.message, error.stack?.split('\n')[1]);
        next(error);
    }
};

// obtener detalle de una solicitud por ID
const obtenerSolicitudPorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID de solicitud inválido." });
        }

        const role = Number(req.user?.role);
        const userId = req.user?.id;

        // Familiar: solo puede ver sus propias solicitudes
        if (role === 3) {
            const check = await prisma.$queryRawUnsafe(
                `SELECT 1 AS ok FROM pedido_servicio WHERE id = $1 AND id_usuario = $2 LIMIT 1`,
                id, userId
            );
            if (!check.length) {
                return res.status(403).json({ success: false, message: "Acceso denegado." });
            }
        }
        // Cuidador: solo puede ver solicitudes que le fueron asignadas
        else if (role === 2) {
            const check = await prisma.$queryRawUnsafe(
                `SELECT 1 AS ok FROM asignacion_servico a
                 JOIN cuidador c ON c.id = a.id_cuidador
                 WHERE a.id_pedido = $1 AND c.id_usuario = $2 LIMIT 1`,
                id, userId
            );
            if (!check.length) {
                return res.status(403).json({ success: false, message: "Acceso denegado." });
            }
        }
        // Otros roles no admin: acceso denegado
        else if (role !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado." });
        }

        const result = await prisma.$queryRawUnsafe(`
            SELECT
                ps.id,
                ps.fecha_del_servicio,
                ps.hora_inicio,
                ps.cantidad_horas_solicitadas,
                ps.observaciones,
                ps.id_pedido_estado,
                pe.descripcion                  AS estado,
                pac.nombre                      AS paciente_nombre,
                pac.apellido                    AS paciente_apellido,
                pac.diagnostico                 AS paciente_diagnostico,
                pac.obra_social                 AS paciente_obra_social,
                pac.nro_afiliado                AS paciente_nro_afiliado,
                pf.nombre                       AS familiar_nombre,
                pf.apellido                     AS familiar_apellido,
                pf.identificacion               AS familiar_identificacion,
                pf.telefono                     AS familiar_telefono,
                u.email                         AS familiar_email,
                par.descripcion                 AS parentesco,
                a.id                            AS asignacion_id,
                a.fecha_asignacion,
                pcuid.nombre                    AS cuidador_nombre,
                pcuid.apellido                  AS cuidador_apellido,
                ucuid.email                     AS cuidador_email,
                t.descripcion                   AS tarea_descripcion,
                t.valor_hora,
                t.moneda,
                ua.email                        AS asignado_por_email,
                ps.motivo_cancelacion,
                a.informe_cuidado
            FROM pedido_servicio ps
            LEFT JOIN pedido_estado      pe    ON pe.id           = ps.id_pedido_estado
            LEFT JOIN paciente           pac   ON pac.id          = ps.id_paciente
            LEFT JOIN usuario            u     ON u.id            = ps.id_usuario
            LEFT JOIN persona            pf    ON pf.id_usuario   = ps.id_usuario
            LEFT JOIN familiar           f     ON f.id_usuario    = ps.id_usuario
                                              AND f.id_paciente   = ps.id_paciente
            LEFT JOIN parentesco         par   ON par.id          = f.id_parentesco
            LEFT JOIN asignacion_servico a     ON a.id            = (
                SELECT MAX(a2.id) FROM asignacion_servico a2 WHERE a2.id_pedido = ps.id
            )
            LEFT JOIN cuidador           c     ON c.id            = a.id_cuidador
            LEFT JOIN persona            pcuid ON pcuid.id_usuario = c.id_usuario
            LEFT JOIN usuario            ucuid ON ucuid.id         = c.id_usuario
            LEFT JOIN tarea              t     ON t.id             = a.id_tarea
            LEFT JOIN usuario            ua    ON ua.id            = a.id_asignado_por
            WHERE ps.id = $1
        `, id);

        if (!result.length) {
            return res.status(404).json({ success: false, message: "Solicitud no encontrada." });
        }

        return res.status(200).json({ success: true, data: result[0], message: "OK" });
    } catch (error) {
        console.error("obtenerSolicitudPorId error:", error.message);
        next(error);
    }
};

// listar solicitudes asignadas al cuidador autenticado
const listarAsignacionesCuidador = async (req, res, next) => {
    try {
        if (!req.user || Number(req.user.role) !== 2) {
            return res.status(403).json({ success: false, message: "Acceso denegado. Solo cuidadores." });
        }

        const solicitudes = await prisma.$queryRawUnsafe(`
            SELECT
                ps.id,
                ps.fecha_del_servicio,
                ps.hora_inicio,
                ps.cantidad_horas_solicitadas,
                ps.observaciones,
                ps.id_pedido_estado,
                pe.descripcion  AS estado,
                pac.nombre      AS paciente_nombre,
                pac.apellido    AS paciente_apellido,
                pac.diagnostico AS paciente_diagnostico,
                t.descripcion   AS tarea_descripcion,
                a.fecha_asignacion
            FROM asignacion_servico a
            JOIN cuidador           c   ON c.id   = a.id_cuidador
            JOIN pedido_servicio    ps  ON ps.id  = a.id_pedido
            LEFT JOIN pedido_estado pe  ON pe.id  = ps.id_pedido_estado
            LEFT JOIN paciente      pac ON pac.id = ps.id_paciente
            LEFT JOIN tarea         t   ON t.id   = a.id_tarea
            WHERE c.id_usuario = $1
            ORDER BY ps.id DESC
        `, req.user.id);

        return res.status(200).json({ success: true, data: solicitudes, message: "OK" });
    } catch (error) {
        console.error("listarAsignacionesCuidador error:", error.message);
        next(error);
    }
};

// listar tareas disponibles (solo admin)
const listarTareas = async (req, res, next) => {
    try {
        if (!req.user || Number(req.user.role) !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado. Solo administradores." });
        }
        const tareas = await prisma.tarea.findMany({ orderBy: { id: 'asc' } });
        return res.status(200).json({ success: true, data: tareas, message: "OK" });
    } catch (error) {
        console.error("listarTareas error:", error.message);
        next(error);
    }
};

// asignar cuidador a una solicitud pendiente (solo admin)
const asignarCuidador = async (req, res, next) => {
    try {
        if (!req.user || Number(req.user.role) !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado. Solo administradores." });
        }

        const idPedido = parseInt(req.params.id);
        const { id_cuidador, id_tarea } = req.body;

        if (isNaN(idPedido) || !id_cuidador || !id_tarea) {
            return res.status(400).json({ success: false, message: "Faltan datos requeridos (id_cuidador, id_tarea)." });
        }

        const resultado = await prisma.$transaction(async (tx) => {
            const pedido = await tx.pedido_servicio.findUnique({ where: { id: idPedido } });
            if (!pedido) throw new Error("PEDIDO_NO_ENCONTRADO");
            if (Number(pedido.id_pedido_estado) !== 1) throw new Error("PEDIDO_NO_PENDIENTE");

            const cuidador = await tx.cuidador.findUnique({ where: { id: parseInt(id_cuidador) } });
            if (!cuidador) throw new Error("CUIDADOR_NO_ENCONTRADO");

            const tarea = await tx.tarea.findUnique({ where: { id: parseInt(id_tarea) } });
            if (!tarea) throw new Error("TAREA_NO_ENCONTRADA");

            // Verificar que el cuidador tenga disponibilidad declarada para ese día y rango horario
            const disponibilidad = await tx.$queryRawUnsafe(`
                SELECT COUNT(*)::int AS total
                FROM disponibilidad_cuidador dc
                WHERE dc.id_cuidador = $1
                  AND dc.dia_semana = EXTRACT(ISODOW FROM $2::date)::int
                  AND dc.hora_inicio::time <= $3::time
                  AND dc.hora_fin::time >= ($3::time + ($4 * INTERVAL '1 hour'))
            `, parseInt(id_cuidador), pedido.fecha_del_servicio, pedido.hora_inicio, pedido.cantidad_horas_solicitadas);
            if (Number(disponibilidad[0]?.total) === 0) throw new Error("CUIDADOR_SIN_DISPONIBILIDAD_DECLARADA");

            // Verificar que el cuidador no tenga asignaciones superpuestas en el mismo rango horario
            const conflictos = await tx.$queryRawUnsafe(`
                SELECT COUNT(*)::int AS total
                FROM asignacion_servico a
                JOIN pedido_servicio ps ON ps.id = a.id_pedido
                WHERE a.id_cuidador = $1
                  AND ps.id != $2
                  AND COALESCE(ps.id_pedido_estado, 0) NOT IN (5, 6)
                  AND ps.fecha_del_servicio::date = $3::date
                  AND ps.hora_inicio::time < ($4::time + ($5 * INTERVAL '1 hour'))
                  AND (ps.hora_inicio::time + (ps.cantidad_horas_solicitadas * INTERVAL '1 hour')) > $4::time
            `, parseInt(id_cuidador), idPedido, pedido.fecha_del_servicio, pedido.hora_inicio, pedido.cantidad_horas_solicitadas);
            if (Number(conflictos[0]?.total) > 0) throw new Error("CUIDADOR_NO_DISPONIBLE");

            const asignacion = await tx.asignacion_servico.create({
                data: {
                    id_cuidador: parseInt(id_cuidador),
                    id_paciente: pedido.id_paciente,
                    id_tarea: parseInt(id_tarea),
                    id_pedido: idPedido,
                    id_asignado_por: req.user.id,
                    fecha_asignacion: new Date(),
                },
            });

            await tx.pedido_servicio.update({
                where: { id: idPedido },
                data: { id_pedido_estado: 3 },
            });

            return asignacion;
        });

        await registrarLog({
            id_usuario: req.user.id,
            accion: 'ASIGNACION_CUIDADOR',
            tabla: 'asignacion_servico',
            detalles: { pedido_id: idPedido, cuidador_id: id_cuidador, tarea_id: id_tarea },
            req,
        });

        return res.status(200).json({ success: true, data: resultado, message: "Cuidador asignado exitosamente." });
    } catch (error) {
        const errorMap = {
            "PEDIDO_NO_ENCONTRADO": "Solicitud no encontrada.",
            "PEDIDO_NO_PENDIENTE": "La solicitud no está en estado Pendiente y no puede ser asignada.",
            "CUIDADOR_NO_ENCONTRADO": "Cuidador no encontrado.",
            "TAREA_NO_ENCONTRADA": "Tarea no encontrada.",
            "CUIDADOR_SIN_DISPONIBILIDAD_DECLARADA": "El acompañante no tiene disponibilidad declarada para ese día y horario.",
            "CUIDADOR_NO_DISPONIBLE": "El acompañante ya tiene una asignación en ese rango horario.",
        };
        const mensaje = errorMap[error.message];
        if (mensaje) return res.status(400).json({ success: false, message: mensaje });

        console.error("asignarCuidador error:", error.message);
        next(error);
    }
};

// desasignar cuidador de una solicitud (solo admin)
const desasignarCuidador = async (req, res, next) => {
    try {
        if (!req.user || Number(req.user.role) !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado. Solo administradores." });
        }

        const idPedido = parseInt(req.params.id);
        if (isNaN(idPedido)) {
            return res.status(400).json({ success: false, message: "ID de pedido inválido." });
        }

        await prisma.$transaction(async (tx) => {
            const pedido = await tx.pedido_servicio.findUnique({ where: { id: idPedido } });
            if (!pedido) throw new Error("PEDIDO_NO_ENCONTRADO");
            if (Number(pedido.id_pedido_estado) !== 3) throw new Error("PEDIDO_NO_ASIGNADO");

            await tx.asignacion_servico.deleteMany({ where: { id_pedido: idPedido } });

            await tx.pedido_servicio.update({
                where: { id: idPedido },
                data: { id_pedido_estado: 1 },
            });
        });

        await registrarLog({
            id_usuario: req.user.id,
            accion: 'DESASIGNACION_CUIDADOR',
            tabla: 'asignacion_servico',
            detalles: { pedido_id: idPedido },
            req,
        });

        return res.status(200).json({ success: true, data: null, message: "Acompañante desasignado. El pedido volvió a estado Pendiente." });
    } catch (error) {
        const errorMap = {
            "PEDIDO_NO_ENCONTRADO": "Solicitud no encontrada.",
            "PEDIDO_NO_ASIGNADO": "La solicitud no tiene un acompañante asignado.",
        };
        const mensaje = errorMap[error.message];
        if (mensaje) return res.status(400).json({ success: false, message: mensaje });

        console.error("desasignarCuidador error:", error.message);
        next(error);
    }
};

// iniciar servicio — PATCH /:id/iniciar (cuidador o admin)
const iniciarServicio = async (req, res, next) => {
    try {
        const idPedido = parseInt(req.params.id);
        const role = Number(req.user?.role);
        const userId = req.user?.id;

        if (isNaN(idPedido)) {
            return res.status(400).json({ success: false, message: "ID de pedido inválido." });
        }

        const pedido = await prisma.pedido_servicio.findUnique({ where: { id: idPedido } });
        if (!pedido) {
            return res.status(404).json({ success: false, message: "Solicitud no encontrada.", errorCode: "PEDIDO_NO_ENCONTRADO" });
        }
        if (Number(pedido.id_pedido_estado) !== 3) {
            return res.status(400).json({ success: false, message: "La solicitud no está en estado Asignado.", errorCode: "PEDIDO_NO_ASIGNADO" });
        }

        // Si es cuidador, verificar que la asignación le pertenece
        if (role === 2) {
            const asignacion = await prisma.$queryRawUnsafe(
                `SELECT 1 AS ok FROM asignacion_servico a
                 JOIN cuidador c ON c.id = a.id_cuidador
                 WHERE a.id_pedido = $1 AND c.id_usuario = $2 LIMIT 1`,
                idPedido, userId
            );
            if (!asignacion.length) {
                return res.status(403).json({ success: false, message: "Esta asignación no te pertenece.", errorCode: "NO_ES_TU_ASIGNACION" });
            }
        } else if (role !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado." });
        }

        await prisma.pedido_servicio.update({
            where: { id: idPedido },
            data: { id_pedido_estado: 4 },
        });

        await registrarLog({
            id_usuario: userId,
            accion: 'INICIAR_SERVICIO',
            tabla: 'pedido_servicio',
            detalles: { pedido_id: idPedido, estado_anterior: 3, estado_nuevo: 4 },
            req,
        });

        return res.status(200).json({ success: true, data: null, message: "Servicio iniciado. El pedido está En curso." });
    } catch (error) {
        console.error("iniciarServicio error:", error.message);
        next(error);
    }
};

// finalizar servicio — PATCH /:id/finalizar (cuidador o admin)
const finalizarServicio = async (req, res, next) => {
    try {
        const idPedido = parseInt(req.params.id);
        const role = Number(req.user?.role);
        const userId = req.user?.id;
        const { informe_cuidado } = req.body;

        if (isNaN(idPedido)) {
            return res.status(400).json({ success: false, message: "ID de pedido inválido." });
        }
        if (!informe_cuidado || !informe_cuidado.trim()) {
            return res.status(400).json({ success: false, message: "El informe del cuidado es obligatorio." });
        }

        const pedido = await prisma.pedido_servicio.findUnique({ where: { id: idPedido } });
        if (!pedido) {
            return res.status(404).json({ success: false, message: "Solicitud no encontrada.", errorCode: "PEDIDO_NO_ENCONTRADO" });
        }
        if (Number(pedido.id_pedido_estado) !== 4) {
            return res.status(400).json({ success: false, message: "La solicitud no está En curso.", errorCode: "PEDIDO_NO_EN_CURSO" });
        }

        // Obtener la asignación del pedido
        const asignacion = await prisma.asignacion_servico.findFirst({
            where: { id_pedido: idPedido },
            orderBy: { id: 'desc' },
        });
        if (!asignacion) {
            return res.status(400).json({ success: false, message: "No hay asignación para este pedido.", errorCode: "SIN_ASIGNACION" });
        }

        // Si es cuidador, verificar propiedad
        if (role === 2) {
            const check = await prisma.$queryRawUnsafe(
                `SELECT 1 AS ok FROM cuidador WHERE id = $1 AND id_usuario = $2 LIMIT 1`,
                asignacion.id_cuidador, userId
            );
            if (!check.length) {
                return res.status(403).json({ success: false, message: "Esta asignación no te pertenece.", errorCode: "NO_ES_TU_ASIGNACION" });
            }
        } else if (role !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado." });
        }

        await prisma.$transaction(async (tx) => {
            await tx.asignacion_servico.update({
                where: { id: asignacion.id },
                data: { informe_cuidado: informe_cuidado.trim() },
            });
            await tx.pedido_servicio.update({
                where: { id: idPedido },
                data: { id_pedido_estado: 5, fecha_finalizado: new Date() },
            });
        });

        await registrarLog({
            id_usuario: userId,
            accion: 'FINALIZAR_SERVICIO',
            tabla: 'pedido_servicio',
            detalles: { pedido_id: idPedido, estado_anterior: 4, estado_nuevo: 5 },
            req,
        });

        return res.status(200).json({ success: true, data: null, message: "Servicio finalizado correctamente." });
    } catch (error) {
        console.error("finalizarServicio error:", error.message);
        next(error);
    }
};

// cancelar servicio — PATCH /:id/cancelar (cuidador, familiar o admin)
const cancelarServicio = async (req, res, next) => {
    try {
        const idPedido = parseInt(req.params.id);
        const role = Number(req.user?.role);
        const userId = req.user?.id;
        const { motivo_cancelacion } = req.body;

        if (isNaN(idPedido)) {
            return res.status(400).json({ success: false, message: "ID de pedido inválido." });
        }

        const pedido = await prisma.pedido_servicio.findUnique({ where: { id: idPedido } });
        if (!pedido) {
            return res.status(404).json({ success: false, message: "Solicitud no encontrada.", errorCode: "PEDIDO_NO_ENCONTRADO" });
        }
        const estadoActual = Number(pedido.id_pedido_estado);
        if (estadoActual !== 3 && estadoActual !== 4) {
            return res.status(400).json({ success: false, message: "Solo se puede cancelar una solicitud Asignada o En curso.", errorCode: "ESTADO_NO_CANCELABLE" });
        }

        if (role === 3) {
            // Familiar: solo puede cancelar sus propios pedidos
            if (pedido.id_usuario !== userId) {
                return res.status(403).json({ success: false, message: "No podés cancelar este pedido.", errorCode: "NO_ES_TU_PEDIDO" });
            }
        } else if (role === 2) {
            // Cuidador: verificar que la asignación le pertenece
            const asignacion = await prisma.$queryRawUnsafe(
                `SELECT 1 AS ok FROM asignacion_servico a
                 JOIN cuidador c ON c.id = a.id_cuidador
                 WHERE a.id_pedido = $1 AND c.id_usuario = $2 LIMIT 1`,
                idPedido, userId
            );
            if (!asignacion.length) {
                return res.status(403).json({ success: false, message: "Esta asignación no te pertenece.", errorCode: "NO_ES_TU_ASIGNACION" });
            }
        } else if (role !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado." });
        }

        await prisma.pedido_servicio.update({
            where: { id: idPedido },
            data: {
                id_pedido_estado: 6,
                motivo_cancelacion: motivo_cancelacion?.trim() || null,
            },
        });

        await registrarLog({
            id_usuario: userId,
            accion: 'CANCELAR_SERVICIO',
            tabla: 'pedido_servicio',
            detalles: { pedido_id: idPedido, estado_anterior: estadoActual, estado_nuevo: 6, motivo: motivo_cancelacion || null },
            req,
        });

        return res.status(200).json({ success: true, data: null, message: "Solicitud cancelada." });
    } catch (error) {
        console.error("cancelarServicio error:", error.message);
        next(error);
    }
};

module.exports = {
    solicitarServicio,
    solicitarServicioAcompanamiento,
    listarPedidosPorUsuario,
    listarSolicitudesAdmin,
    obtenerSolicitudPorId,
    listarAsignacionesCuidador,
    listarTareas,
    asignarCuidador,
    desasignarCuidador,
    iniciarServicio,
    finalizarServicio,
    cancelarServicio,
};
