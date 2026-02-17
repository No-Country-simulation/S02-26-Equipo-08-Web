const prisma = require("../config/database");
const bcrypt = require('bcrypt');

// busca un usuario por email en la base de datos
async function buscarUsuarioEmailDb(email) {
    return await prisma.usuario.findUnique({where: {email: email}})
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
const buscarUsuarioEmail = async (req, res, next) =>{
    const {email} = req.params

    try {
        const usuario = await buscarUsuarioEmailDb(email)

        if(usuario == null){
            return res.status(400).json({
            success: false,
            data: null,
            message: 'Usuario no encontrado.'
        })}

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

module.exports = {buscarUsuarioEmailDb, crearUsuarioDb, buscarUsuarioEmail}
