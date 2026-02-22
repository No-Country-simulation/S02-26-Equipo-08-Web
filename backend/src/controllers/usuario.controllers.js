const prisma = require("../config/database");
const bcrypt = require('bcrypt');

// --- FUNCIONES DB ---

async function buscarUsuarioEmailDb(email) {
    return await prisma.usuario.findUnique({ where: { email: email } })
}

async function desbloquearUsuarioDb(id) {
    return await prisma.usuario.update({
        where: { id: parseInt(id) },
        data: {
            intentos_login: 0,
            fecha_deshabilitado: null
        }
    });
}

async function crearUsuarioDb(tx, datos) {
    const {
        email,
        pass,
        id_rol,
        id_usuario_estado,
    } = datos

    const pass_hash = await bcrypt.hash(pass, 10)

    const usuario = await tx.usuario.create({
        data: {
            email: email,
            password_hash: pass_hash,
            id_rol: id_rol,
            id_usuario_estado: id_usuario_estado ?? 1,
        }
    })

    return usuario
}

// --- ENDPOINTS ---

// endpoint: buscar usuario por email
const buscarUsuarioEmail = async (req, res, next) => {
    const { email } = req.params

    try {
        const usuario = await buscarUsuarioEmailDb(email)

        if (usuario == null) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Usuario no encontrado.'
            })
        }

        return res.status(200).json({
            success: true,
            data: usuario,
            message: 'Usuario encontrado.'
        })
    } catch (error) {
        console.error(`buscarUsuarioEmail error: ${error}`);
        next(error)
    }
}

const desbloquearUsuario = async (req, res, next) => {
    const { id } = req.params;
    const { id_admin } = req.body;

    try {
        const usuarioActualizado = await desbloquearUsuarioDb(id);

        try {
            await prisma.log_auditoria.create({
                data: {
                    id_usuario: parseInt(id_admin) || 0,
                    accion: 'DESBLOQUEO_MANUAL',
                    tabla_afectada: 'usuario',
                    valor_nuevo: {
                        usuario_desbloqueado: usuarioActualizado.email,
                        id_objetivo: id
                    },
                    ip_direccion: req.headers['x-forwarded-for'] || req.socket.remoteAddress || "127.0.0.1"
                }
            });
        } catch (auditError) {
            console.error("Error grabando auditoría de desbloqueo:", auditError);
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario desbloqueado correctamente.',
            data: {
                id: usuarioActualizado.id,
                email: usuarioActualizado.email
            }
        });
    } catch (error) {
        console.error(`desbloquearUsuario error: ${error}`);
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        next(error);
    }
};

// endpoint: listar usuarios con paginacion y filtros
// query params: page (default 1), limit (default 10), rol, estado (id numerico), busqueda, fechaInicio, fechaFin
const listarUsuarios = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit
        const { rol, estado, busqueda, fechaInicio, fechaFin } = req.query

        // construimos las condiciones WHERE dinamicamente
        const condiciones = []
        const params = []
        let paramIndex = 1

        if (rol) {
            condiciones.push(`u.id_rol = $${paramIndex}`)
            params.push(parseInt(rol))
            paramIndex++
        }

        if (estado) {
            condiciones.push(`u.id_usuario_estado = $${paramIndex}`)
            params.push(parseInt(estado))
            paramIndex++
        } else {
            // por defecto excluimos usuarios rechazados (id_usuario_estado = 3)
            condiciones.push(`u.id_usuario_estado != 3`)
        }

        if (fechaInicio) {
            condiciones.push(`u.fecha_alta >= $${paramIndex}::timestamp`)
            params.push(fechaInicio)
            paramIndex++
        }

        if (fechaFin) {
            // Ajustamos fechaFin para incluir todo el dia (hasta las 23:59:59)
            condiciones.push(`u.fecha_alta <= $${paramIndex}::timestamp + interval '1 day'`)
            params.push(fechaFin)
            paramIndex++
        }

        if (busqueda) {
            condiciones.push(`(
                p.nombre ILIKE $${paramIndex} OR
                p.apellido ILIKE $${paramIndex} OR
                u.email ILIKE $${paramIndex} OR
                p.identificacion ILIKE $${paramIndex}
            )`)
            params.push(`%${busqueda}%`)
            paramIndex++
        }

        const whereClause = condiciones.length > 0
            ? 'WHERE ' + condiciones.join(' AND ')
            : ''

        // query principal: join entre usuario, persona, rol y usuario_estado
        const usuarios = await prisma.$queryRawUnsafe(`
            SELECT
                u.id,
                u.email,
                u.id_rol,
                r.descripcion AS rol,
                ue.descripcion AS estado,
                u.fecha_alta,
                u.fecha_ultimo_login,
                p.nombre,
                p.apellido,
                p.identificacion,
                p.telefono
            FROM usuario u
            LEFT JOIN persona p ON p.id_usuario = u.id
            LEFT JOIN rol r ON r.id = u.id_rol
            LEFT JOIN usuario_estado ue ON ue.id = u.id_usuario_estado
            ${whereClause}
            ORDER BY u.id DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `, ...params, limit, offset)

        // query para contar el total (para la paginacion)
        const countResult = await prisma.$queryRawUnsafe(`
            SELECT COUNT(*)::int AS total
            FROM usuario u
            LEFT JOIN persona p ON p.id_usuario = u.id
            LEFT JOIN rol r ON r.id = u.id_rol
            LEFT JOIN usuario_estado ue ON ue.id = u.id_usuario_estado
            ${whereClause}
        `, ...params)

        const total = countResult[0]?.total || 0
        const totalPages = Math.ceil(total / limit)

        return res.status(200).json({
            success: true,
            data: {
                usuarios,
                total,
                page,
                totalPages,
                limit
            },
            message: 'Usuarios encontrados.'
        })

    } catch (error) {
        console.error(`listarUsuarios error: ${error}`)
        next(error)
    }
}

// endpoint: obtener detalle completo de un usuario por id
// incluye datos de persona, rol, estado y datos especificos segun el rol (cuidador o familiar)
const obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'ID de usuario inválido.'
            })
        }

        // datos base del usuario: usuario + persona + rol + estado
        const usuarioResult = await prisma.$queryRawUnsafe(`
            SELECT
                u.id,
                u.email,
                u.id_rol,
                r.descripcion AS rol,
                ue.descripcion AS estado,
                u.fecha_alta,
                u.fecha_ultimo_login,
                u.intentos_login,
                u.fecha_deshabilitado,
                p.nombre,
                p.apellido,
                p.identificacion,
                p.direccion,
                p.telefono,
                p.edad
            FROM usuario u
            LEFT JOIN persona p ON p.id_usuario = u.id
            LEFT JOIN rol r ON r.id = u.id_rol
            LEFT JOIN usuario_estado ue ON ue.id = u.id_usuario_estado
            WHERE u.id = $1
        `, id)

        if (!usuarioResult || usuarioResult.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Usuario no encontrado.'
            })
        }

        const usuario = usuarioResult[0]
        let datosRol = null

        // si es cuidador (rol 2), traemos datos de la tabla cuidador
        if (usuario.id_rol === 2) {
            const cuidadorResult = await prisma.$queryRawUnsafe(`
                SELECT
                    c.id AS id_cuidador,
                    c.cbu,
                    c.cvu,
                    c.alias,
                    c.con_documentacion,
                    c.fecha_ingreso,
                    c.fecha_autorizado
                FROM cuidador c
                WHERE c.id_usuario = $1
            `, id)

            datosRol = cuidadorResult.length > 0 ? cuidadorResult[0] : null
        }

        // si es familiar (rol 3), traemos datos de familiar + pacientes vinculados
        if (usuario.id_rol === 3) {
            const familiarResult = await prisma.$queryRawUnsafe(`
                SELECT
                    f.id AS id_familiar,
                    f.id_parentesco,
                    par.descripcion AS parentesco,
                    pac.id AS id_paciente,
                    pac.nombre AS nombre_paciente,
                    pac.apellido AS apellido_paciente,
                    pac.identificacion AS dni_paciente,
                    pac.diagnostico,
                    pac.obra_social
                FROM familiar f
                LEFT JOIN parentesco par ON par.id = f.id_parentesco
                LEFT JOIN paciente pac ON pac.id = f.id_paciente
                WHERE f.id_usuario = $1
            `, id)

            datosRol = familiarResult.length > 0 ? familiarResult : null
        }

        return res.status(200).json({
            success: true,
            data: {
                ...usuario,
                datosRol
            },
            message: 'Detalle del usuario obtenido.'
        })

    } catch (error) {
        console.error(`obtenerUsuarioPorId error: ${error}`)
        next(error)
    }
}

module.exports = {
    buscarUsuarioEmailDb,
    crearUsuarioDb,
    buscarUsuarioEmail,
    desbloquearUsuario,
    listarUsuarios,
    obtenerUsuarioPorId
};
