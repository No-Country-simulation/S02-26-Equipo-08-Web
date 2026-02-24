// datos de ejemplo para popular la tabla cuidador
// los id_usuario corresponden a los cuidadores creados en dbInsertarRegistros.js
// id_usuario 3: Ana Garcia (estado A - activa)
// id_usuario 4: Lucas Moix (estado A - activo)
// id_usuario 5: Sofia Fernandez (estado PA - pendiente aceptar)
// id_usuario 6: Diego Torres (estado R - rechazado)
// id_usuario 7: Camila Herrera (estado D - desactivada)
//
// estados posibles del usuario: 'PA' pendiente aceptar, 'A' aceptado, 'R' rechazado, 'D' desactivado
// activo = 1 unicamente cuando estado = 'A'
//
// id_autorizado_por: id del usuario admin que autorizo al cuidador (1 = Carlos Martinez, 2 = Valeria Ruiz)

const cuidadores = [
    {
        id_usuario: 3,
        cbu: '0110599940000012345678',
        cvu: null,
        alias: 'ana.garcia.mp',
        con_documentacion: 1,
        id_autorizado_por: 1,
        fecha_autorizado: new Date('2025-06-15'),
        fecha_ingreso: new Date('2025-06-01'),
    },
    {
        id_usuario: 4,
        cbu: null,
        cvu: '0000003100092748532901',
        alias: 'lucas.moix.mp',
        con_documentacion: 1,
        id_autorizado_por: 1,
        fecha_autorizado: new Date('2025-07-20'),
        fecha_ingreso: new Date('2025-07-10'),
    },
    {
        id_usuario: 5,
        cbu: null,
        cvu: null,
        alias: null,
        con_documentacion: 0,
        id_autorizado_por: 2,
        fecha_autorizado: null,
        fecha_ingreso: new Date('2026-01-15'),
    },
    {
        id_usuario: 6,
        cbu: '0140312301600430217890',
        cvu: null,
        alias: 'diego.torres.bna',
        con_documentacion: 1,
        id_autorizado_por: 1,
        fecha_autorizado: null,
        fecha_ingreso: new Date('2026-02-01'),
    },
    {
        id_usuario: 7,
        cbu: '0720054720000087654321',
        cvu: null,
        alias: 'camila.herrera.sant',
        con_documentacion: 1,
        id_autorizado_por: 2,
        fecha_autorizado: new Date('2025-09-10'),
        fecha_ingreso: new Date('2025-08-20'),
    },
]

module.exports = { cuidadores }
