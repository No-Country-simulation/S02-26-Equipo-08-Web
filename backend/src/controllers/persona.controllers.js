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

module.exports = {crearPersonaDb}
