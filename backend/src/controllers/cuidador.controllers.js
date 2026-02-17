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
                estado: 'PA', activo: 0,
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

module.exports = {registrarCuidador}
