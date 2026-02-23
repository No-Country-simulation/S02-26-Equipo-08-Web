// datos de ejemplo para popular la tabla guardia
// cada guardia representa un turno de trabajo de un cuidador
//
// id_guardia_estado: referencia a la tabla guardia_estado
//   1 = Programada, 2 = En curso, 3 = Finalizada, 4 = Cancelada
//
// las guardias se crean a partir de asignaciones de servicio
// guardia 1: asignacion 1 (Ana, paciente Lucia, escolar) - finalizada
// guardia 2: asignacion 2 (Lucas, paciente Lucia, terapia) - en curso
// guardia 3: asignacion 3 (Ana, paciente Tomas, rehabilitacion) - finalizada
// guardia 4: asignacion 4 (Lucas, paciente Tomas, domiciliario) - programada

const guardias = [
    {
        id_asignacion: 1,
        id_paciente: 1,
        id_cuidador: 1,
        id_pedido_servicio: 1,
        fecha_inicio: new Date('2026-02-20'),
        fecha_fin: new Date('2026-02-20'),
        hora_inicio: new Date('1970-01-01T08:00:00'),
        hora_finalizacion: new Date('1970-01-01T12:00:00'),
        id_guardia_estado: 3,
        observaciones: 'Guardia escolar completada sin novedades',
    },
    {
        id_asignacion: 2,
        id_paciente: 1,
        id_cuidador: 2,
        id_pedido_servicio: 2,
        fecha_inicio: new Date('2026-02-22'),
        fecha_fin: new Date('2026-02-22'),
        hora_inicio: new Date('1970-01-01T14:00:00'),
        hora_finalizacion: new Date('1970-01-01T17:00:00'),
        id_guardia_estado: 2,
        observaciones: 'Acompanamiento a terapia ocupacional en curso',
    },
    {
        id_asignacion: 3,
        id_paciente: 2,
        id_cuidador: 1,
        id_pedido_servicio: 4,
        fecha_inicio: new Date('2026-02-18'),
        fecha_fin: new Date('2026-02-18'),
        hora_inicio: new Date('1970-01-01T10:00:00'),
        hora_finalizacion: new Date('1970-01-01T16:00:00'),
        id_guardia_estado: 3,
        observaciones: 'Rehabilitacion domiciliaria completada',
    },
    {
        id_asignacion: 4,
        id_paciente: 2,
        id_cuidador: 2,
        id_pedido_servicio: 5,
        fecha_inicio: new Date('2026-02-24'),
        fecha_fin: new Date('2026-02-24'),
        hora_inicio: new Date('1970-01-01T08:00:00'),
        hora_finalizacion: new Date('1970-01-01T12:00:00'),
        id_guardia_estado: 1,
        observaciones: 'Sesion de kinesiologia programada',
    },
]

module.exports = { guardias }
