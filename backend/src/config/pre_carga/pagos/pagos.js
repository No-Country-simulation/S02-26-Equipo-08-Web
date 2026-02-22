// datos de ejemplo para popular la tabla pagos
// solo se generan pagos para guardias finalizadas (id_guardia_estado = 3)
//
// guardia 1: Ana Garcia, 4 horas escolar (5000/h) = 20000
// guardia 3: Ana Garcia, 6 horas rehabilitacion (6500/h) = 39000
//
// id_pago_autorizo: id del usuario admin que autorizo el pago (1 = Carlos, 2 = Valeria)
// cantidad_horas: se usa formato Time para representar horas trabajadas

const pagos = [
    {
        id_cuidador: 1,
        id_guardia: 1,
        fecha_pago: new Date('2026-02-21T10:00:00'),
        id_pago_autorizo: 1,
        cantidad_horas: new Date('1970-01-01T04:00:00'),
        importe_abonado: 20000.00,
    },
    {
        id_cuidador: 1,
        id_guardia: 3,
        fecha_pago: new Date('2026-02-19T14:00:00'),
        id_pago_autorizo: 2,
        cantidad_horas: new Date('1970-01-01T06:00:00'),
        importe_abonado: 39000.00,
    },
]

module.exports = { pagos }
