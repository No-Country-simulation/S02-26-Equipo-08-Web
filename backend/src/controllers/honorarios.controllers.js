const prisma = require("../config/database");

// Admin: listar honorarios de todos los cuidadores
// soporta filtros: ?id_cuidador=X, ?desde=YYYY-MM-DD, ?hasta=YYYY-MM-DD
const listarHonorarios = async (req, res, next) => {
    try {
        const { id_cuidador, desde, hasta } = req.query;

        // Rango por defecto: inicio del mes actual hasta hoy
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const fechaDesde = desde ? new Date(desde) : inicioMes;
        const fechaHasta = hasta ? new Date(hasta) : hoy;
        // Ajustar hasta al final del día
        fechaHasta.setHours(23, 59, 59, 999);

        let filtrosCuidador = "";
        const params = [fechaDesde, fechaHasta];

        if (id_cuidador) {
            filtrosCuidador = "AND g.id_cuidador = $3";
            params.push(parseInt(id_cuidador));
        }

        // Detalle por guardia finalizada (estado 3)
        const detalle = await prisma.$queryRawUnsafe(`
            SELECT
                g.id AS guardia_id,
                g.id_cuidador,
                per.nombre AS cuidador_nombre,
                per.apellido AS cuidador_apellido,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido,
                t.descripcion AS tipo_servicio,
                t.valor_hora,
                g.fecha_inicio,
                g.hora_inicio,
                g.hora_finalizacion,
                EXTRACT(EPOCH FROM (g.hora_finalizacion - g.hora_inicio)) / 3600.0 AS horas_trabajadas,
                (EXTRACT(EPOCH FROM (g.hora_finalizacion - g.hora_inicio)) / 3600.0) * t.valor_hora AS importe_base,
                COALESCE(pa.importe_abonado, 0) AS importe_pagado
            FROM guardia g
            JOIN asignacion_servico a ON a.id = g.id_asignacion
            JOIN tarea t ON t.id = a.id_tarea
            JOIN cuidador c ON c.id = g.id_cuidador
            JOIN persona per ON per.id_usuario = c.id_usuario
            LEFT JOIN paciente p ON p.id = g.id_paciente
            LEFT JOIN pagos pa ON pa.id_guardia = g.id
            WHERE g.id_guardia_estado = 3
              AND g.fecha_inicio >= $1
              AND g.fecha_inicio <= $2
              ${filtrosCuidador}
            ORDER BY g.id_cuidador, g.fecha_inicio DESC
        `, ...params);

        // Agrupar por cuidador para totales
        const porCuidador = {};
        for (const row of detalle) {
            const key = row.id_cuidador;
            if (!porCuidador[key]) {
                porCuidador[key] = {
                    id_cuidador: key,
                    cuidador_nombre: row.cuidador_nombre,
                    cuidador_apellido: row.cuidador_apellido,
                    total_horas: 0,
                    total_base: 0,
                    total_pagado: 0,
                    servicios: [],
                };
            }
            const horas = parseFloat(row.horas_trabajadas) || 0;
            const base = parseFloat(row.importe_base) || 0;
            const pagado = parseFloat(row.importe_pagado) || 0;

            porCuidador[key].total_horas += horas;
            porCuidador[key].total_base += base;
            porCuidador[key].total_pagado += pagado;
            porCuidador[key].servicios.push({
                guardia_id: row.guardia_id,
                fecha: row.fecha_inicio,
                paciente: `${row.paciente_nombre || ''} ${row.paciente_apellido || ''}`.trim(),
                tipo_servicio: row.tipo_servicio,
                horas: horas,
                valor_hora: parseFloat(row.valor_hora),
                importe_base: base,
                importe_pagado: pagado,
            });
        }

        const resumen = Object.values(porCuidador);
        const totalGeneral = resumen.reduce((acc, c) => acc + c.total_base, 0);

        return res.status(200).json({
            success: true,
            data: resumen,
            totalGeneral,
            periodo: { desde: fechaDesde, hasta: fechaHasta },
        });
    } catch (error) {
        console.error("listarHonorarios error:", error);
        next(error);
    }
};

// Cuidador: listar solo sus propios honorarios
// soporta filtros: ?desde=YYYY-MM-DD, ?hasta=YYYY-MM-DD
const listarMisHonorarios = async (req, res, next) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);
        if (isNaN(idUsuario)) {
            return res.status(400).json({ success: false, message: "ID de usuario inválido." });
        }

        const { desde, hasta } = req.query;

        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const fechaDesde = desde ? new Date(desde) : inicioMes;
        const fechaHasta = hasta ? new Date(hasta) : hoy;
        fechaHasta.setHours(23, 59, 59, 999);

        const detalle = await prisma.$queryRawUnsafe(`
            SELECT
                g.id AS guardia_id,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido,
                t.descripcion AS tipo_servicio,
                t.valor_hora,
                g.fecha_inicio,
                g.hora_inicio,
                g.hora_finalizacion,
                EXTRACT(EPOCH FROM (g.hora_finalizacion - g.hora_inicio)) / 3600.0 AS horas_trabajadas,
                (EXTRACT(EPOCH FROM (g.hora_finalizacion - g.hora_inicio)) / 3600.0) * t.valor_hora AS importe_base,
                COALESCE(pa.importe_abonado, 0) AS importe_pagado
            FROM guardia g
            JOIN asignacion_servico a ON a.id = g.id_asignacion
            JOIN tarea t ON t.id = a.id_tarea
            JOIN cuidador c ON c.id = g.id_cuidador
            LEFT JOIN paciente p ON p.id = g.id_paciente
            LEFT JOIN pagos pa ON pa.id_guardia = g.id
            WHERE g.id_guardia_estado = 3
              AND c.id_usuario = $1
              AND g.fecha_inicio >= $2
              AND g.fecha_inicio <= $3
            ORDER BY g.fecha_inicio DESC
        `, idUsuario, fechaDesde, fechaHasta);

        let totalHoras = 0;
        let totalBase = 0;
        let totalPagado = 0;

        const servicios = detalle.map((row) => {
            const horas = parseFloat(row.horas_trabajadas) || 0;
            const base = parseFloat(row.importe_base) || 0;
            const pagado = parseFloat(row.importe_pagado) || 0;
            totalHoras += horas;
            totalBase += base;
            totalPagado += pagado;

            return {
                guardia_id: row.guardia_id,
                fecha: row.fecha_inicio,
                paciente: `${row.paciente_nombre || ''} ${row.paciente_apellido || ''}`.trim(),
                tipo_servicio: row.tipo_servicio,
                horas,
                valor_hora: parseFloat(row.valor_hora),
                importe_base: base,
                importe_pagado: pagado,
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                servicios,
                total_horas: totalHoras,
                total_base: totalBase,
                total_pagado: totalPagado,
            },
            periodo: { desde: fechaDesde, hasta: fechaHasta },
        });
    } catch (error) {
        console.error("listarMisHonorarios error:", error);
        next(error);
    }
};

module.exports = {
    listarHonorarios,
    listarMisHonorarios,
};
