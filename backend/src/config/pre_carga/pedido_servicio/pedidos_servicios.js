// datos de ejemplo para popular la tabla pedido_servicio
// solo los familiares con estado 'A' (activos) pueden crear pedidos
//   id_usuario 8: Maria Lopez (familiar activa, madre de paciente 1)
//   id_usuario 9: Jorge Ramirez (familiar activo, padre de paciente 2)
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
    },
]

module.exports = { pedidos_servicios }
