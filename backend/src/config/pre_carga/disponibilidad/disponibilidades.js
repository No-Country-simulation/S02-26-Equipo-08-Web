// datos de ejemplo para popular la tabla disponibilidad_cuidador
// dia_semana: 1=Lunes, 2=Martes, 3=Miercoles, 4=Jueves, 5=Viernes, 6=Sabado, 7=Domingo
// hora_inicio / hora_fin: objetos Date con la fecha base 1970-01-01 (solo se usa el componente de tiempo)
//
// email: se usa para resolver el id_cuidador en tiempo de inserción (evita IDs hardcodeados)

const disponibilidades = [
    // cuidador1@sistema.com (Ana Garcia) — Lunes a Viernes 08:00-17:00, Sábado 08:00-14:00
    { email: 'cuidador1@sistema.com', dia_semana: 1, hora_inicio: new Date('1970-01-01T08:00:00'), hora_fin: new Date('1970-01-01T17:00:00') },
    { email: 'cuidador1@sistema.com', dia_semana: 2, hora_inicio: new Date('1970-01-01T08:00:00'), hora_fin: new Date('1970-01-01T17:00:00') },
    { email: 'cuidador1@sistema.com', dia_semana: 3, hora_inicio: new Date('1970-01-01T08:00:00'), hora_fin: new Date('1970-01-01T17:00:00') },
    { email: 'cuidador1@sistema.com', dia_semana: 4, hora_inicio: new Date('1970-01-01T08:00:00'), hora_fin: new Date('1970-01-01T17:00:00') },
    { email: 'cuidador1@sistema.com', dia_semana: 5, hora_inicio: new Date('1970-01-01T08:00:00'), hora_fin: new Date('1970-01-01T17:00:00') },
    { email: 'cuidador1@sistema.com', dia_semana: 6, hora_inicio: new Date('1970-01-01T08:00:00'), hora_fin: new Date('1970-01-01T14:00:00') },

    // lmoix@gmail.com (Lucas Moix) — Lunes a Sábado 12:00-20:00, Domingo 09:00-19:00
    { email: 'lmoix@gmail.com', dia_semana: 1, hora_inicio: new Date('1970-01-01T12:00:00'), hora_fin: new Date('1970-01-01T20:00:00') },
    { email: 'lmoix@gmail.com', dia_semana: 2, hora_inicio: new Date('1970-01-01T12:00:00'), hora_fin: new Date('1970-01-01T20:00:00') },
    { email: 'lmoix@gmail.com', dia_semana: 3, hora_inicio: new Date('1970-01-01T12:00:00'), hora_fin: new Date('1970-01-01T20:00:00') },
    { email: 'lmoix@gmail.com', dia_semana: 4, hora_inicio: new Date('1970-01-01T12:00:00'), hora_fin: new Date('1970-01-01T20:00:00') },
    { email: 'lmoix@gmail.com', dia_semana: 5, hora_inicio: new Date('1970-01-01T12:00:00'), hora_fin: new Date('1970-01-01T20:00:00') },
    { email: 'lmoix@gmail.com', dia_semana: 6, hora_inicio: new Date('1970-01-01T12:00:00'), hora_fin: new Date('1970-01-01T20:00:00') },
    { email: 'lmoix@gmail.com', dia_semana: 7, hora_inicio: new Date('1970-01-01T09:00:00'), hora_fin: new Date('1970-01-01T19:00:00') },

    // cuidador3@sistema.com — Martes, Jueves y Sábado 09:00-15:00
    { email: 'cuidador3@sistema.com', dia_semana: 2, hora_inicio: new Date('1970-01-01T09:00:00'), hora_fin: new Date('1970-01-01T15:00:00') },
    { email: 'cuidador3@sistema.com', dia_semana: 4, hora_inicio: new Date('1970-01-01T09:00:00'), hora_fin: new Date('1970-01-01T15:00:00') },
    { email: 'cuidador3@sistema.com', dia_semana: 6, hora_inicio: new Date('1970-01-01T09:00:00'), hora_fin: new Date('1970-01-01T15:00:00') },

    // cuidador4@sistema.com — Lunes a Viernes 07:00-15:00
    { email: 'cuidador4@sistema.com', dia_semana: 1, hora_inicio: new Date('1970-01-01T07:00:00'), hora_fin: new Date('1970-01-01T15:00:00') },
    { email: 'cuidador4@sistema.com', dia_semana: 2, hora_inicio: new Date('1970-01-01T07:00:00'), hora_fin: new Date('1970-01-01T15:00:00') },
    { email: 'cuidador4@sistema.com', dia_semana: 3, hora_inicio: new Date('1970-01-01T07:00:00'), hora_fin: new Date('1970-01-01T15:00:00') },
    { email: 'cuidador4@sistema.com', dia_semana: 4, hora_inicio: new Date('1970-01-01T07:00:00'), hora_fin: new Date('1970-01-01T15:00:00') },
    { email: 'cuidador4@sistema.com', dia_semana: 5, hora_inicio: new Date('1970-01-01T07:00:00'), hora_fin: new Date('1970-01-01T15:00:00') },

    // cuidador5@sistema.com — Todos los días 10:00-18:00
    { email: 'cuidador5@sistema.com', dia_semana: 1, hora_inicio: new Date('1970-01-01T10:00:00'), hora_fin: new Date('1970-01-01T18:00:00') },
    { email: 'cuidador5@sistema.com', dia_semana: 2, hora_inicio: new Date('1970-01-01T10:00:00'), hora_fin: new Date('1970-01-01T18:00:00') },
    { email: 'cuidador5@sistema.com', dia_semana: 3, hora_inicio: new Date('1970-01-01T10:00:00'), hora_fin: new Date('1970-01-01T18:00:00') },
    { email: 'cuidador5@sistema.com', dia_semana: 4, hora_inicio: new Date('1970-01-01T10:00:00'), hora_fin: new Date('1970-01-01T18:00:00') },
    { email: 'cuidador5@sistema.com', dia_semana: 5, hora_inicio: new Date('1970-01-01T10:00:00'), hora_fin: new Date('1970-01-01T18:00:00') },
    { email: 'cuidador5@sistema.com', dia_semana: 6, hora_inicio: new Date('1970-01-01T10:00:00'), hora_fin: new Date('1970-01-01T18:00:00') },
    { email: 'cuidador5@sistema.com', dia_semana: 7, hora_inicio: new Date('1970-01-01T10:00:00'), hora_fin: new Date('1970-01-01T18:00:00') },
]

module.exports = { disponibilidades }
