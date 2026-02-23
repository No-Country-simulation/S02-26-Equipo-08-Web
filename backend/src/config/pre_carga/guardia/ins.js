const prisma = require('../../database')
const {guardias} = require('./guardias')

async function insertarGuardias() {
    const guardiaDb = await prisma.guardia.findFirst()

    if(guardiaDb != null){
        return
    }

    guardias.forEach(guardia => {
        insertarGuardia(guardia)
    });
}

async function insertarGuardia(guardia) {
    const {
        id_asignacion,
        id_paciente,
        id_cuidador,
        id_pedido_servicio,
        fecha_inicio,
        fecha_fin,
        hora_inicio,
        hora_finalizacion,
        id_guardia_estado,
        observaciones,
    } = guardia

    const guardiaIns = await prisma.guardia.create({
        data:{
            id_asignacion: id_asignacion,
            id_paciente: id_paciente,
            id_cuidador: id_cuidador,
            id_pedido_servicio: id_pedido_servicio,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            hora_inicio: hora_inicio,
            hora_finalizacion: hora_finalizacion,
            id_guardia_estado: id_guardia_estado,
            observaciones: observaciones,
        }
    })

    console.log(`GUARDIA INS: ${guardiaIns}`);
}

module.exports = {insertarGuardias}
