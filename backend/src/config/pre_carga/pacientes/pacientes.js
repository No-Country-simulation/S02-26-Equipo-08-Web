// datos de ejemplo para popular la tabla paciente
// estos pacientes son referenciados desde familiares.js
//   paciente 1: Lucia Sanchez Lopez - familiar: Maria Lopez (madre, user 8) y Roberto Sanchez (padre, user 10)
//   paciente 2: Tomas Ramirez Diaz - familiar: Jorge Ramirez (padre, user 9) y Patricia Diaz (madre, user 12)
//   paciente 3: Valentina Gomez - familiar: Laura Gomez (madre, user 11)
//   paciente 4: Carmen Alvarez - familiar: Miguel Alvarez (conyugue, user 13)

const pacientes = [
    {
        nombre: 'Lucia',
        apellido: 'Sanchez Lopez',
        identificacion: '45678901',
        direccion: 'Lavalle 800, CABA',
        telefono: '1155008008',
        edad: 8,
        diagnostico: 'Trastorno del espectro autista (TEA)',
        obra_social: 'OSDE',
        nro_afiliado: 'OSDE-00451234',
        fecha_ingreso: new Date('2025-06-01'),
        activo: 1,
    },
    {
        nombre: 'Tomas',
        apellido: 'Ramirez Diaz',
        identificacion: '50123456',
        direccion: 'San Martin 456, Cordoba',
        telefono: '1155003003',
        edad: 12,
        diagnostico: 'Paralisis cerebral',
        obra_social: 'Swiss Medical',
        nro_afiliado: 'SM-00789456',
        fecha_ingreso: new Date('2025-07-15'),
        activo: 1,
    },
    {
        nombre: 'Valentina',
        apellido: 'Gomez',
        identificacion: '48765432',
        direccion: 'Tucuman 1200, Rosario',
        telefono: '1155009009',
        edad: 5,
        diagnostico: 'Sindrome de Down',
        obra_social: 'Galeno',
        nro_afiliado: 'GAL-00234567',
        fecha_ingreso: new Date('2025-09-01'),
        activo: 1,
    },
    {
        nombre: 'Carmen',
        apellido: 'Alvarez',
        identificacion: '20345678',
        direccion: 'Independencia 300, Mendoza',
        telefono: '1155011011',
        edad: 78,
        diagnostico: 'Alzheimer estadio moderado',
        obra_social: 'PAMI',
        nro_afiliado: 'PAMI-10567890',
        fecha_ingreso: new Date('2026-01-10'),
        activo: 1,
    },
]

module.exports = { pacientes }
