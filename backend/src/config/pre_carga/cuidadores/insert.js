const prisma = require('../../database');
const {cuidadores} = require('./cuidadores')


const insertarCuidadores = async () => {
    const cuidadorExistente = await prisma.cuidador.findFirst()

    if (cuidadorExistente != null){
        return
    }

    cuidadores.forEach(cuidador => {
        insertarCuidador(cuidador)
    });
}

async function insertarCuidador(cuidador) {
    const {
        id_usuario,
        cbu,
        cvu,
        alias,
        con_documentacion,
        id_cuidador_estado,
        id_autorizado_por,
        fecha_autorizado,
        fecha_ingreso,
    } = cuidador

    const cuidador_ins = await prisma.cuidador.create({
        data:{
            id_usuario: id_usuario,
            cbu: cbu,
            cvu: cvu,
            alias: alias,
            con_documentacion: con_documentacion,
            id_cuidador_estado: id_cuidador_estado,
            id_autorizado_por: id_autorizado_por,
            fecha_autorizado: fecha_autorizado,
            fecha_ingreso: fecha_ingreso,
        }
    })

    console.log(`CUIDADOR INS: ${cuidador_ins}`);
    
}

module.exports = {insertarCuidadores}