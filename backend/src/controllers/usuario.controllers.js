const prisma = require("../config/database");
const bcrypt = require('bcrypt');

// --- FUNCIONES DB ---

async function buscarUsuarioEmailDb(email) {
    return await prisma.usuario.findUnique({where: {email: email}})
}

// ESTA ES LA FUNCIÓN QUE TE FALTABA
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

// --- ENDPOINTS ---

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

const desbloquearUsuario = async (req, res, next) => {
    const { id } = req.params;
    const { id_admin } = req.body; 

    try {
        // Ahora sí, esta función ya existe arriba
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

module.exports = { 
    buscarUsuarioEmailDb, 
    crearUsuarioDb, 
    buscarUsuarioEmail, 
    desbloquearUsuario 
};