const prisma = require('../../database')
const {pedidos_servicios} = require('./pedidos_servicios')

async function insertarPedidosServicios() {
    const pedidoDb = await prisma.pedido_servicio.findFirst()

    if(pedidoDb != null){
        return
    }

    for (const pedido of pedidos_servicios) {
        await insertarPedidoServicio(pedido)
    }
}

async function insertarPedidoServicio(pedido) {
    const {
        id_usuario,
        id_paciente,
        fecha_del_servicio,
        hora_inicio,
        cantidad_horas_solicitadas,
        id_pedido_estado,
        fecha_finalizado,
        observaciones,
    } = pedido

    const pedidoIns = await prisma.pedido_servicio.create({
        data:{
            id_usuario: id_usuario,
            id_paciente: id_paciente,
            fecha_del_servicio: fecha_del_servicio,
            hora_inicio: hora_inicio,
            cantidad_horas_solicitadas: cantidad_horas_solicitadas,
            id_pedido_estado: id_pedido_estado,
            fecha_finalizado: fecha_finalizado,
            observaciones: observaciones,
        }
    })

    console.log(`PEDIDO SERVICIO INS: ${pedidoIns}`);
}

module.exports = {insertarPedidosServicios}
