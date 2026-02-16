const prisma = require('../../database');
const {usuarios} = require('./usuarios')
const bcrypt = require('bcrypt');

const insertarUsuarios = async () => {
    const usuarioExistente = await prisma.usuario.findFirst()

    if (usuarioExistente != null){
        return
    }

    usuarios.forEach(usuario => {
        insertarUsuario(usuario)
    });

}

const insertarUsuario = async (params) => {

    try {
        const {
            email,
            pass,
            id_rol,
            estado,
            activo
        } = params

        pass_hash = await bcrypt.hash(pass, 10)
        
        const usuario = await prisma.usuario.create({
            data:{
                email: email,
                password_hash: pass_hash,
                id_rol: id_rol,
                estado: estado,
                activo: activo
            }
        })

        console.log('USUARIO INSERTADO: ', usuario);

    } catch (error) {
        console.log('USUARIO INSERTADO ERROR: ', error);

    }

    return
}

module.exports = {insertarUsuarios}
