// datos de ejemplo para popular la tabla familiar
// los id_usuario corresponden a los familiares creados en usuarios.js
// id_usuario 8: Maria Lopez (estado A - activa)
// id_usuario 9: Jorge Ramirez (estado A - activo)
// id_usuario 10: Roberto Sanchez (estado PA - pendiente aceptar)
// id_usuario 11: Laura Gomez (estado PA - pendiente aceptar)
// id_usuario 12: Patricia Diaz (estado D - desactivada)
// id_usuario 13: Miguel Alvarez (estado R - rechazado)
//
// id_paciente: referencia a la tabla paciente (deben existir pacientes 1 a 4)
// id_parentesco: referencia a la tabla parentesco
//   1 = Madre, 2 = Padre, 3 = Hijo/a, 4 = Hermano/a, 5 = Conyugue, 6 = Tutor/a
//
// nota: algunos familiares comparten el mismo paciente
//   paciente 1: Maria Lopez (madre) y Roberto Sanchez (padre)
//   paciente 2: Jorge Ramirez (padre) y Patricia Diaz (madre)
//   paciente 3: Laura Gomez (madre)
//   paciente 4: Miguel Alvarez (conyugue)

const familiares = [
    {
        id_usuario: 8,
        id_paciente: 1,
        id_parentesco: 1,
    },
    {
        id_usuario: 9,
        id_paciente: 2,
        id_parentesco: 2,
    },
    {
        id_usuario: 10,
        id_paciente: 1,
        id_parentesco: 2,
    },
    {
        id_usuario: 11,
        id_paciente: 3,
        id_parentesco: 1,
    },
    {
        id_usuario: 12,
        id_paciente: 2,
        id_parentesco: 1,
    },
    {
        id_usuario: 13,
        id_paciente: 4,
        id_parentesco: 5,
    },
    // --- familiares activos extra (para testing de asignaciones) ---
    // id_usuario 14: Carolina Vega (madre de paciente 5 - Mateo Vega)
    // id_usuario 15: Andres Molina (padre de paciente 6 - Elena Molina)
    // id_usuario 16: Daniela Castro (tutora de paciente 7 - Franco Castro)
    {
        id_usuario: 14,
        id_paciente: 5,
        id_parentesco: 1,
    },
    {
        id_usuario: 15,
        id_paciente: 6,
        id_parentesco: 2,
    },
    {
        id_usuario: 16,
        id_paciente: 7,
        id_parentesco: 6,
    },
]

module.exports = { familiares }
