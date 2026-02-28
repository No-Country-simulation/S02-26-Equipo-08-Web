// datos de ejemplo para popular la tabla cuidador
// email: se usa para buscar el id_usuario real en tiempo de inserción
// (evita IDs hardcodeados que se desalinean por inserts en paralelo)
//
// id_autorizado_por: id del usuario admin que autorizo al cuidador (1 = Carlos Martinez, 2 = Valeria Ruiz)

const cuidadores = [
    {
        email: 'cuidador1@sistema.com',
        cbu: '0110599940000012345678',
        cvu: null,
        alias: 'ana.garcia.mp',
        con_documentacion: 1,
        id_autorizado_por: 1,
        fecha_autorizado: new Date('2025-06-15'),
        fecha_ingreso: new Date('2025-06-01'),
    },
    {
        email: 'lmoix@gmail.com',
        cbu: null,
        cvu: '0000003100092748532901',
        alias: 'lucas.moix.mp',
        con_documentacion: 1,
        id_autorizado_por: 1,
        fecha_autorizado: new Date('2025-07-20'),
        fecha_ingreso: new Date('2025-07-10'),
    },
    {
        email: 'cuidador3@sistema.com',
        cbu: null,
        cvu: null,
        alias: null,
        con_documentacion: 0,
        id_autorizado_por: 2,
        fecha_autorizado: null,
        fecha_ingreso: new Date('2026-01-15'),
    },
    {
        email: 'cuidador4@sistema.com',
        cbu: '0140312301600430217890',
        cvu: null,
        alias: 'diego.torres.bna',
        con_documentacion: 1,
        id_autorizado_por: 1,
        fecha_autorizado: null,
        fecha_ingreso: new Date('2026-02-01'),
    },
    {
        email: 'cuidador5@sistema.com',
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
