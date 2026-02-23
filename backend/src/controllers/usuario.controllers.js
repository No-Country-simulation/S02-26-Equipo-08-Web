const prisma = require("../config/database");
const bcrypt = require('bcrypt');
const { registrarLog } = require('../utils/auditoria');
const { 
    crearPersonaDb, 
    buscarPersonaIdentificacionDb, 
    buscarPersonaTelefonoDb 
} = require('./persona.controllers');

// --- FUNCIONES DB ---

/*
async function buscarUsuarioEmailDb(email) {
    return await prisma.usuario.findUnique({ where: { email: email.toLowerCase() } })
}
*/

async function buscarUsuarioEmailDb(tx, email) {
    // Si solo viene un argumento, asumimos que es el email y usamos prisma global
    const client = email ? tx : prisma;
    const emailAUsar = email || tx;

    if (!emailAUsar || typeof emailAUsar !== 'string') return null;

    return await client.usuario.findUnique({ 
        where: { email: emailAUsar.toLowerCase().trim() } 
    });
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

// --- LÓGICA CORE: REGISTRO TRANSACCIONAL ---

async function ejecutarRegistroTransaccional(tx, datos, req) {
    const { 
        email, password, nombre, apellido, 
        identificacion, direccion, telefono, 
        edad, id_rol, id_usuario_estado 
    } = datos;

    // 1. VALIDACIONES: Si alguna falla, lanza error y detiene la transacción
    const existeEmail = await buscarUsuarioEmailDb(tx, email);
    if (existeEmail) throw new Error("EMAIL_ALREADY_EXISTS");

    const existeDni = await buscarPersonaIdentificacionDb(tx, identificacion);
    if (existeDni) throw new Error("DNI_ALREADY_EXISTS");

    const existeTel = await buscarPersonaTelefonoDb(tx, telefono);
    if (existeTel) throw new Error("TELEFONO_ALREADY_EXISTS");

    // 2. PROCESAMIENTO: Hashear contraseña
        const passwordHash = await bcrypt.hash(password, 10);

    // 3. PASO A: Crear Usuario
            const nuevoUsuario = await tx.usuario.create({
                data: {
                    email: String(email).toLowerCase(),
                    password_hash: passwordHash,
                    id_rol: parseInt(id_rol),
                    id_usuario_estado: parseInt(id_usuario_estado) || 1
                }
            });

    // 4. PASO B: Crear Persona vinculada al Usuario
    const nuevaPersona = await crearPersonaDb(tx, {
        id_usuario: nuevoUsuario.id,
        nombre, apellido, identificacion, direccion, telefono, edad
    });

    // 5. PASO C: Log de Auditoría (Solo se ejecuta si A y B fueron exitosos)
        await registrarLog({
        tx, // Se guarda como parte de la misma transacción
        id_usuario: nuevoUsuario.id,
            accion: 'REGISTRO_NUEVO_USUARIO',
            tabla: 'usuario / persona',
            detalles: { 
            email: nuevoUsuario.email, 
                        nombre_completo: `${nombre} ${apellido}`,
            identificacion
        },
        req: req
    });

    return { usuario: nuevoUsuario, persona: nuevaPersona };
}




// --- ENDPOINTS ---

const registrarUsuario = async (req, res, next) => {
    try {
        // prisma.$transaction garantiza que todo sea "todo o nada"
        const resultado = await prisma.$transaction(async (tx) => {
            return await ejecutarRegistroTransaccional(tx, req.body, req);
        });

        return res.status(201).json({ 
            success: true, 
            message: "Usuario registrado y auditado con éxito.", 
            data: resultado 
        });

    } catch (error) {
        // Mapeo de errores para respuestas claras al cliente
        const errorMessages = {
            "EMAIL_ALREADY_EXISTS": "El correo electrónico ya está registrado.",
            "DNI_ALREADY_EXISTS": "El DNI/Identificación ya está en uso.",
            "TELEFONO_ALREADY_EXISTS": "El número de teléfono ya está registrado."
        };

        const mensajeCliente = errorMessages[error.message];

        if (mensajeCliente) {
            return res.status(400).json({ success: false, message: mensajeCliente });
        }

        console.error("Fallo crítico en el proceso de registro:", error);
        next(error); 
    }
};



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
    obtenerUsuarioPorId,
    registrarUsuario
};
