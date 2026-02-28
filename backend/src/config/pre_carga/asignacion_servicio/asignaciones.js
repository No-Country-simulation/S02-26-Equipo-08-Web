// datos de ejemplo para popular la tabla asignacion_servico
// vincula un cuidador con un pedido de servicio
//
// solo se asignan pedidos que estan en estado 3 (asignado), 4 (en curso) o 5 (finalizado)
// pedido 1: finalizado - cuidador 1 (Ana Garcia), tarea 1 (acompanamiento escolar)
// pedido 2: en curso - cuidador 2 (Lucas Moix), tarea 2 (acompanamiento terapeutico)
// pedido 3: aprobado - no tiene asignacion todavia
// pedido 4: finalizado - cuidador 1 (Ana Garcia), tarea 4 (rehabilitacion fisica)
// pedido 5: asignado - cuidador 2 (Lucas Moix), tarea 3 (cuidado domiciliario)
// pedido 6: pendiente - no tiene asignacion todavia
// pedido 7: cancelado - no tiene asignacion
//
// id_asignado_por: id del usuario admin que realizo la asignacion (1 = Carlos, 2 = Valeria)

const asignaciones = [
    {
        id_cuidador: 1,
        id_paciente: 1,
        id_tarea: 1,
        id_pedido: 1,
        id_asignado_por: 1,
        fecha_asignacion: new Date('2026-02-19T10:00:00'),
        informe_cuidado: 'El paciente asistió correctamente al turno escolar. Se mostró tranquilo y colaborativo durante toda la jornada. No se registraron incidentes. Se recomienda continuar con el acompañamiento los próximos martes y jueves.',
    },
    {
        id_cuidador: 2,
        id_paciente: 1,
        id_tarea: 2,
        id_pedido: 2,
        id_asignado_por: 1,
        fecha_asignacion: new Date('2026-02-21T09:00:00'),
    },
    {
        id_cuidador: 1,
        id_paciente: 2,
        id_tarea: 4,
        id_pedido: 4,
        id_asignado_por: 2,
        fecha_asignacion: new Date('2026-02-17T11:00:00'),
        informe_cuidado: 'Se realizaron los ejercicios de rehabilitación física indicados por el kinesiólogo. El paciente completó la rutina con leve dificultad en los ejercicios de movilidad de cadera. Se sugiere incrementar gradualmente la intensidad en las próximas sesiones.',
    },
    {
        id_cuidador: 2,
        id_paciente: 2,
        id_tarea: 3,
        id_pedido: 5,
        id_asignado_por: 1,
        fecha_asignacion: new Date('2026-02-23T08:00:00'),
    },
]

module.exports = { asignaciones }
