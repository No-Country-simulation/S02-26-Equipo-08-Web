const prisma = require("../config/database");
const {buscarUsuarioEmailDb, crearUsuarioDb} = require('./usuario.controllers')
const {crearPersonaDb} = require('./persona.controllers')

// registrar un cuidador: crea usuario (rol 2) + persona + cuidador en una transaccion
const registrarCuidador = async (req, res, next) => {
    try {
        const {
            email,
            pass,
            nombre,
            apellido,
            identificacion,
            direccion,
            telefono,
            edad,
            cbu,
            cvu,
            alias,
        } = req.body

        // verificar si ya existe un usuario con ese email
        const usuarioExistente = await buscarUsuarioEmailDb(email)
        if (usuarioExistente != null) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Ya existe un usuario registrado con ese email.'
            })
        }

        //  forzar rollback para probar la transaccio
        // const TEST_ROLLBACK = true
        const TEST_ROLLBACK = false

        // transaccion: si falla alguno, se revierte todo
        const resultado = await prisma.$transaction(async (tx) => {
            const usuario = await crearUsuarioDb(tx, {
                email, pass, id_rol: 2,
                id_usuario_estado: 1,
            })

            const persona = await crearPersonaDb(tx, {
                id_usuario: usuario.id,
                nombre, apellido, identificacion, direccion, telefono, edad,
            })

            const cuidador = await tx.cuidador.create({
                data: {
                    id_usuario: usuario.id,
                    cbu: cbu || null,
                    cvu: cvu || null,
                    alias: alias || null,
                    con_documentacion: 0,
                    id_autorizado_por: 0,
                    fecha_ingreso: new Date(),
                }
            })

            if (TEST_ROLLBACK) {
                console.log('TEST: datos que se iban a insertar:', { usuario, persona, cuidador })
                throw new Error('TEST_ROLLBACK: transaccion revertida a proposito')
            }

            return { usuario, persona, cuidador }
        })

        return res.status(201).json({
            success: true,
            data: resultado,
            message: 'Cuidador registrado.'
        })

    } catch (error) {
        console.log('REGISTRAR CUIDADOR ERROR: ', error);
        next(error)
    }
}

// listar cuidadores activos (para asignación — solo admin)
// Si se pasa ?id_pedido=N, incluye el campo `disponible` (booleano) por cuidador
const listarCuidadoresActivos = async (req, res, next) => {
    try {
        if (!req.user || Number(req.user.role) !== 1) {
            return res.status(403).json({ success: false, message: "Acceso denegado. Solo administradores." });
        }

        const idPedido = parseInt(req.query.id_pedido);

        let cuidadores;

        if (!isNaN(idPedido)) {
            // Con verificación de disponibilidad para el rango horario del pedido
            cuidadores = await prisma.$queryRawUnsafe(`
                SELECT
                    c.id,
                    c.id_usuario,
                    p.nombre,
                    p.apellido,
                    p.identificacion,
                    p.telefono,
                    u.email,
                    NOT EXISTS (
                        SELECT 1
                        FROM asignacion_servico a
                        JOIN pedido_servicio ps2 ON ps2.id = a.id_pedido
                        JOIN pedido_servicio ref ON ref.id = $1
                        WHERE a.id_cuidador = c.id
                          AND ps2.id != $1
                          AND COALESCE(ps2.id_pedido_estado, 0) NOT IN (5, 6)
                          AND ps2.fecha_del_servicio::date = ref.fecha_del_servicio::date
                          AND ps2.hora_inicio::time < (ref.hora_inicio::time + (ref.cantidad_horas_solicitadas * INTERVAL '1 hour'))
                          AND (ps2.hora_inicio::time + (ps2.cantidad_horas_solicitadas * INTERVAL '1 hour')) > ref.hora_inicio::time
                    ) AS disponible
                FROM cuidador c
                JOIN usuario u ON u.id = c.id_usuario
                JOIN persona p ON p.id_usuario = c.id_usuario
                WHERE u.id_rol = 2
                  AND u.id_usuario_estado = 2
                ORDER BY disponible DESC, p.apellido, p.nombre
            `, idPedido);
        } else {
            cuidadores = await prisma.$queryRawUnsafe(`
                SELECT
                    c.id,
                    c.id_usuario,
                    p.nombre,
                    p.apellido,
                    p.identificacion,
                    p.telefono,
                    u.email
                FROM cuidador c
                JOIN usuario u ON u.id = c.id_usuario
                JOIN persona p ON p.id_usuario = c.id_usuario
                WHERE u.id_rol = 2
                  AND u.id_usuario_estado = 2
                ORDER BY p.apellido, p.nombre
            `);
        }

        return res.status(200).json({ success: true, data: cuidadores, message: "OK" });
    } catch (error) {
        console.error("listarCuidadoresActivos error:", error.message);
        next(error);
    }
};

module.exports = { registrarCuidador, listarCuidadoresActivos }
