const prisma = require('../../database')
const {familiares} = require('./familiares')


async function insertarFamiliares() {
    const familiaresDb = await prisma.familiar.findFirst()

    if(familiaresDb != null){
        return
    }

    for (const familiar of familiares) {
        await insertarFamiliar(familiar)
    }
}

async function insertarFamiliar(familiar) {
    const {
        id_usuario,
        id_paciente,
        id_parentesco,
    } = familiar

    const familiarIns = await prisma.familiar.create({
        data: {
            id_usuario: id_usuario,
            id_paciente: id_paciente,
            id_parentesco: id_parentesco
        }
    })

    console.log(`FAMILIAR INS: ${familiarIns}`);
    
}

module.exports = {insertarFamiliares}