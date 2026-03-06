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
// guardia 5: asignacion 5 (Ana, paciente Bruno, escolar) - finalizada

const guardias = [
    {
        id_asignacion: 1,
        id_paciente: 1,
        id_cuidador: 1,
        id_pedido_servicio: 1,
        fecha_inicio: new Date('2026-03-01'),
        fecha_fin: new Date('2026-03-01'),
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
        fecha_inicio: new Date('2026-03-03'),
        fecha_fin: new Date('2026-03-03'),
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
        fecha_inicio: new Date('2026-03-02'),
        fecha_fin: new Date('2026-03-02'),
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
        fecha_inicio: new Date('2026-03-06'),
        fecha_fin: new Date('2026-03-06'),
        hora_inicio: new Date('1970-01-01T08:00:00'),
        hora_finalizacion: new Date('1970-01-01T12:00:00'),
        id_guardia_estado: 1,
        observaciones: 'Sesion de kinesiologia programada',
    },
    {
        id_asignacion: 5,
        id_paciente: 8,
        id_cuidador: 1,
        id_pedido_servicio: 14,
        fecha_inicio: new Date('2026-03-04'),
        fecha_fin: new Date('2026-03-04'),
        hora_inicio: new Date('1970-01-01T09:00:00'),
        hora_finalizacion: new Date('1970-01-01T14:00:00'),
        id_guardia_estado: 3,
        observaciones: 'Acompanamiento escolar para Bruno Perez completado sin novedades',
    },
]

module.exports = { guardias }
