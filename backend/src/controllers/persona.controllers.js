const prisma = require("../config/database");

// crea una persona dentro de una transaccion (tx)
// tx es el cliente transaccional de prisma, lo recibe desde el controller que lo llame
async function crearPersonaDb(tx, datos) {
    const {
        id_usuario,
        apellido,
        nombre,
        identificacion,
        direccion,
        telefono,
        edad,
    } = datos

    const persona = await tx.persona.create({
        data:{
            id_usuario: id_usuario,
            apellido: apellido,
            nombre: nombre,
            identificacion: identificacion,
            direccion: direccion,
            telefono: telefono,
            edad: edad,
        }
    })

    return persona
}

/**
 * Busca una persona por su identificación (DNI).
 * Soporta transacciones opcionales.
 */
async function buscarPersonaIdentificacionDb(tx, identificacion) {
    const client = tx || prisma;
    return await client.persona.findUnique({ where: { identificacion } });
}

/**
 * Busca una persona por su número de teléfono.
 */
async function buscarPersonaTelefonoDb(tx, telefono) {
    const client = tx || prisma;
    return await client.persona.findUnique({ where: { telefono } });
}




module.exports = {crearPersonaDb,
     buscarPersonaIdentificacionDb, 
    buscarPersonaTelefonoDb 
}
