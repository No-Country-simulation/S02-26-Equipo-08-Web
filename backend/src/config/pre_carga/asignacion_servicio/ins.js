const prisma = require('../../database')
const {asignaciones} = require('./asignaciones')

async function insertarAsignaciones() {
    const asignacionDb = await prisma.asignacion_servico.findFirst()

    if(asignacionDb != null){
        return
    }

    for (const asignacion of asignaciones) {
        await insertarAsignacion(asignacion)
    }
}

async function insertarAsignacion(asignacion) {
    const {
        id_cuidador,
        id_paciente,
        id_tarea,
        id_pedido,
        id_asignado_por,
        fecha_asignacion,
        informe_cuidado,
    } = asignacion

    const asignacionIns = await prisma.asignacion_servico.create({
        data:{
            id_cuidador: id_cuidador,
            id_paciente: id_paciente,
            id_tarea: id_tarea,
            id_pedido: id_pedido,
            id_asignado_por: id_asignado_por,
            fecha_asignacion: fecha_asignacion,
            informe_cuidado: informe_cuidado || null,
        }
    })

    console.log(`ASIGNACION INS: ${asignacionIns}`);
}

module.exports = {insertarAsignaciones}
