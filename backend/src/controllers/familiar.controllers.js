const {prisma} = require("../config/database");
const {buscarUsuarioEmailDb, crearUsuarioDb} = require('./usuario.controllers')
const {crearPersonaDb} = require('./persona.controllers')

// registrar un familiar: crea usuario (rol 3) + persona + familiar en una transaccion
const registrarFamiliar = async (req, res, next) => {
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
            id_paciente,
            id_parentesco,
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

        // forzar rollback para probar la transaccion 
        // const TEST_ROLLBACK = true
        const TEST_ROLLBACK = false

        // transaccion: si falla alguno, se revierte todo
        const resultado = await prisma.$transaction(async (tx) => {
            const usuario = await crearUsuarioDb(tx, {
                email, pass, id_rol: 3,
            })

            const persona = await crearPersonaDb(tx, {
                id_usuario: usuario.id,
                nombre, apellido, identificacion, direccion, telefono, edad,
            })

            const familiar = await tx.familiar.create({
                data: {
                    id_usuario: usuario.id,
                    id_paciente: id_paciente,
                    id_parentesco: id_parentesco,
                }
            })

            if (TEST_ROLLBACK) {
                console.log('TEST: datos que se iban a insertar:', { usuario, persona, familiar })
                throw new Error('TEST_ROLLBACK: transaccion revertida a proposito')
            }

            return { usuario, persona, familiar }
        })

        return res.status(201).json({
            success: true,
            data: resultado,
            message: 'Familiar registrado.'
        })

    } catch (error) {
        console.log('REGISTRAR FAMILIAR ERROR: ', error);
        next(error)
    }
}

module.exports = {registrarFamiliar}
