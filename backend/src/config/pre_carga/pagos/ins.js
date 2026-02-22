const prisma = require('../../database')
const {pagos} = require('./pagos')

async function insertarPagos() {
    const pagoDb = await prisma.pagos.findFirst()

    if(pagoDb != null){
        return
    }

    pagos.forEach(pago => {
        insertarPago(pago)
    });
}

async function insertarPago(pago) {
    const {
        id_cuidador,
        id_guardia,
        fecha_pago,
        id_pago_autorizo,
        cantidad_horas,
        importe_abonado,
    } = pago

    const pagoIns = await prisma.pagos.create({
        data:{
            id_cuidador: id_cuidador,
            id_guardia: id_guardia,
            fecha_pago: fecha_pago,
            id_pago_autorizo: id_pago_autorizo,
            cantidad_horas: cantidad_horas,
            importe_abonado: importe_abonado,
        }
    })

    console.log(`PAGO INS: ${pagoIns}`);
}

module.exports = {insertarPagos}
