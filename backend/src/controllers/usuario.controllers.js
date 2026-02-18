const prisma = require("../config/database");
const bcrypt = require('bcrypt');

// busca un usuario por email en la base de datos
async function buscarUsuarioEmailDb(email) {
    return await prisma.usuario.findUnique({ where: { email: email } })
}

// crea un usuario dentro de una transaccion (tx)
// tx es el cliente transaccional de prisma, lo recibe desde el controller que lo llame
async function crearUsuarioDb(tx, datos) {
    const {
        email,
        pass,
        id_rol,
        estado,
        activo,
    } = datos

    const pass_hash = await bcrypt.hash(pass, 10)

    const usuario = await tx.usuario.create({
        data: {
            email: email,
            password_hash: pass_hash,
            id_rol: id_rol,
            estado: estado || 'PA',
            activo: activo || 0,
        }
    })

    return usuario
}

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

// endpoint: listar usuarios con paginacion y filtros
// query params: page (default 1), limit (default 10), rol, estado, busqueda
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
            condiciones.push(`u.estado = $${paramIndex}`)
            params.push(estado)
            paramIndex++
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

        // query principal: join entre usuario, persona y rol
        const usuarios = await prisma.$queryRawUnsafe(`
            SELECT
                u.id,
                u.email,
                u.id_rol,
                r.descripcion AS rol,
                u.estado,
                u.activo,
                u.fecha_alta,
                u.fecha_ultimo_login,
                p.nombre,
                p.apellido,
                p.identificacion,
                p.telefono
            FROM usuario u
            LEFT JOIN persona p ON p.id_usuario = u.id
            LEFT JOIN rol r ON r.id = u.id_rol
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

module.exports = { buscarUsuarioEmailDb, crearUsuarioDb, buscarUsuarioEmail, listarUsuarios }
