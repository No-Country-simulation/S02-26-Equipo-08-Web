// datos de ejemplo para popular la tabla tarea
// cada tarea representa un tipo de servicio que puede realizar un cuidador
// valor_hora: importe por hora en pesos argentinos
// moneda: tipo de moneda (ARS por defecto)

const tareas = [
    {
        descripcion: 'Acompanamiento escolar',
        valor_hora: 5000.00,
        moneda: 'ARS',
    },
    {
        descripcion: 'Acompanamiento terapeutico',
        valor_hora: 6000.00,
        moneda: 'ARS',
    },
    {
        descripcion: 'Cuidado domiciliario',
        valor_hora: 4500.00,
        moneda: 'ARS',
    },
    {
        descripcion: 'Rehabilitacion fisica',
        valor_hora: 6500.00,
        moneda: 'ARS',
    },
    {
        descripcion: 'Acompanamiento recreativo',
        valor_hora: 4000.00,
        moneda: 'ARS',
    },
    {
        descripcion: 'Acompanamiento nocturno',
        valor_hora: 7000.00,
        moneda: 'ARS',
    },
]

module.exports = { tareas }
