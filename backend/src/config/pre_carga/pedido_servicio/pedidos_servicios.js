// datos de ejemplo para popular la tabla pedido_servicio
// solo los familiares con estado 'A' (activos) pueden crear pedidos
//   id_usuario 8:  Maria Lopez    (familiar activa, madre de paciente 1)
//   id_usuario 9:  Jorge Ramirez  (familiar activo, padre de paciente 2)
//   id_usuario 14: Carolina Vega  (familiar activa, madre de paciente 5)
//   id_usuario 15: Andres Molina  (familiar activo, padre de paciente 6)
//   id_usuario 16: Daniela Castro (familiar activa, tutora de paciente 7)
//
// id_pedido_estado: referencia a la tabla pedido_estado (debe estar precargada)
//   1 = Pendiente, 2 = Aprobado, 3 = Asignado, 4 = En curso, 5 = Finalizado, 6 = Cancelado
//
// nota: fecha_del_servicio y hora_inicio usan objetos Date
// cantidad_horas_solicitadas: cantidad de horas que dura el servicio

const pedidos_servicios = [
    {
        id_usuario: 8,
        id_paciente: 1,
        fecha_del_servicio: new Date('2026-02-20T08:00:00'),
        hora_inicio: new Date('1970-01-01T08:00:00'),
        cantidad_horas_solicitadas: 4,
        id_pedido_estado: 5,
        fecha_finalizado: new Date('2026-02-20'),
        observaciones: 'Acompanamiento escolar turno manana',
    },
    {
        id_usuario: 8,
        id_paciente: 1,
        fecha_del_servicio: new Date('2026-02-22T14:00:00'),
        hora_inicio: new Date('1970-01-01T14:00:00'),
        cantidad_horas_solicitadas: 3,
        id_pedido_estado: 4,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento a sesion de terapia ocupacional',
    },
    {
        id_usuario: 8,
        id_paciente: 1,
        fecha_del_servicio: new Date('2026-02-25T09:00:00'),
        hora_inicio: new Date('1970-01-01T09:00:00'),
        cantidad_horas_solicitadas: 5,
        id_pedido_estado: 2,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento escolar dia completo turno manana',
    },
    {
        id_usuario: 9,
        id_paciente: 2,
        fecha_del_servicio: new Date('2026-02-18T10:00:00'),
        hora_inicio: new Date('1970-01-01T10:00:00'),
        cantidad_horas_solicitadas: 6,
        id_pedido_estado: 5,
        fecha_finalizado: new Date('2026-02-18'),
        observaciones: 'Acompanamiento domiciliario con ejercicios de rehabilitacion',
    },
    {
        id_usuario: 9,
        id_paciente: 2,
        fecha_del_servicio: new Date('2026-02-24T08:00:00'),
        hora_inicio: new Date('1970-01-01T08:00:00'),
        cantidad_horas_solicitadas: 4,
        id_pedido_estado: 3,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento a sesion de kinesiologia',
    },
    {
        id_usuario: 9,
        id_paciente: 2,
        fecha_del_servicio: new Date('2026-03-01T15:00:00'),
        hora_inicio: new Date('1970-01-01T15:00:00'),
        cantidad_horas_solicitadas: 3,
        id_pedido_estado: 1,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento recreativo por la tarde',
    },
    {
        id_usuario: 8,
        id_paciente: 1,
        fecha_del_servicio: new Date('2026-03-03T08:00:00'),
        hora_inicio: new Date('1970-01-01T08:00:00'),
        cantidad_horas_solicitadas: 4,
        id_pedido_estado: 6,
        fecha_finalizado: null,
        observaciones: 'Cancelado por turno medico del paciente',
        motivo_cancelacion: 'El paciente tuvo un turno médico urgente que coincidió con el horario del acompañamiento. Se reprogramará para la semana siguiente.',
    },
    // --- pedidos pendientes extra (para testing de asignaciones) ---
    // Disponibilidad de cuidadores activos:
    //   Ana Garcia  (cuidador 1): Lun-Vie 08:00-17:00 | Sab 08:00-14:00
    //   Lucas Moix  (cuidador 2): Lun-Sab 12:00-20:00 | Dom 09:00-19:00
    //
    // Pedido 8 — Lunes 2026-03-02 09:00, 3h → SOLO ANA (Lucas empieza a las 12:00)
    {
        id_usuario: 14,
        id_paciente: 5,
        fecha_del_servicio: new Date('2026-03-02T09:00:00'),
        hora_inicio: new Date('1970-01-01T09:00:00'),
        cantidad_horas_solicitadas: 3,
        id_pedido_estado: 1,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento escolar turno manana',
    },
    // Pedido 9 — Martes 2026-03-03 13:00, 3h → AMBOS DISPONIBLES
    {
        id_usuario: 15,
        id_paciente: 6,
        fecha_del_servicio: new Date('2026-03-03T13:00:00'),
        hora_inicio: new Date('1970-01-01T13:00:00'),
        cantidad_horas_solicitadas: 3,
        id_pedido_estado: 1,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento a sesion de rehabilitacion',
    },
    // Pedido 10 — Miercoles 2026-03-04 15:00, 3h → SOLO LUCAS (Ana cierra a las 17:00, 15+3=18 > 17)
    {
        id_usuario: 16,
        id_paciente: 7,
        fecha_del_servicio: new Date('2026-03-04T15:00:00'),
        hora_inicio: new Date('1970-01-01T15:00:00'),
        cantidad_horas_solicitadas: 3,
        id_pedido_estado: 1,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento terapeutico por la tarde',
    },
    // Pedido 11 — Sabado 2026-03-07 09:00, 3h → SOLO ANA (Lucas empieza a las 12:00)
    {
        id_usuario: 14,
        id_paciente: 5,
        fecha_del_servicio: new Date('2026-03-07T09:00:00'),
        hora_inicio: new Date('1970-01-01T09:00:00'),
        cantidad_horas_solicitadas: 3,
        id_pedido_estado: 1,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento recreativo sabado manana',
    },
    // Pedido 12 — Domingo 2026-03-08 11:00, 4h → SOLO LUCAS (Ana no tiene disponibilidad los domingos)
    {
        id_usuario: 15,
        id_paciente: 6,
        fecha_del_servicio: new Date('2026-03-08T11:00:00'),
        hora_inicio: new Date('1970-01-01T11:00:00'),
        cantidad_horas_solicitadas: 4,
        id_pedido_estado: 1,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento domiciliario domingo',
    },
    // Pedido 13 — Lunes 2026-03-09 06:00, 2h → NINGUN CUIDADOR DISPONIBLE (fuera de horario de todos)
    {
        id_usuario: 16,
        id_paciente: 7,
        fecha_del_servicio: new Date('2026-03-09T06:00:00'),
        hora_inicio: new Date('1970-01-01T06:00:00'),
        cantidad_horas_solicitadas: 2,
        id_pedido_estado: 1,
        fecha_finalizado: null,
        observaciones: 'Acompanamiento madrugada - fuera del horario de todos los cuidadores',
    },
]

module.exports = { pedidos_servicios }
