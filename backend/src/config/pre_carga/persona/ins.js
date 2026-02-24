const prisma = require('../../database')
const {personas} = require('./personas')

async function insertarPersonas() {
    const personaDb = await prisma.persona.findFirst()

    if(personaDb != null){
        return
    }

    personas.forEach(persona => {
        insertarPersona(persona)
    });
}

async function insertarPersona(persona) {
    const {
        id_usuario,
        apellido,
        nombre,
        identificacion,
        direccion,
        telefono,
        edad,
    } = persona

    const personaIns = await prisma.persona.create({
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

    console.log(`PERSONA INS: ${personaIns}`);
}

module.exports = {insertarPersonas}
