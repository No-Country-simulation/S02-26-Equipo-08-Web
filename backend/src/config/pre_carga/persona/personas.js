// datos de ejemplo para popular la tabla persona
// cada persona esta vinculada a un usuario por id_usuario
// los datos (nombre, apellido, dni, etc.) coinciden con los de usuarios.js
//
// usuarios 1-2: administradores
// usuarios 3-7: cuidadores
// usuarios 8-13: familiares

const personas = [
    // --- administradores ---
    {
        id_usuario: 1,
        apellido: 'Martinez',
        nombre: 'Carlos',
        identificacion: '30123456',
        direccion: 'Av. Siempre Viva 742, CABA',
        telefono: '1155001001',
        edad: 40,
    },
    {
        id_usuario: 2,
        apellido: 'Ruiz',
        nombre: 'Valeria',
        identificacion: '29876543',
        direccion: 'Callao 1200, CABA',
        telefono: '1155001002',
        edad: 42,
    },
    // --- cuidadores ---
    {
        id_usuario: 3,
        apellido: 'Garcia',
        nombre: 'Ana',
        identificacion: '35678901',
        direccion: 'Belgrano 789, CABA',
        telefono: '1155004004',
        edad: 30,
    },
    {
        id_usuario: 4,
        apellido: 'Moix',
        nombre: 'Lucas',
        identificacion: '33456123',
        direccion: 'Mitre 321, La Plata',
        telefono: '5422813030',
        edad: 22,
    },
    {
        id_usuario: 5,
        apellido: 'Fernandez',
        nombre: 'Sofia',
        identificacion: '36789012',
        direccion: 'Rivadavia 1500, Mendoza',
        telefono: '1155006006',
        edad: 26,
    },
    {
        id_usuario: 6,
        apellido: 'Torres',
        nombre: 'Diego',
        identificacion: '37890123',
        direccion: 'Corrientes 2000, CABA',
        telefono: '1155007007',
        edad: 24,
    },
    {
        id_usuario: 7,
        apellido: 'Herrera',
        nombre: 'Camila',
        identificacion: '34567890',
        direccion: 'Lavalle 600, Tucuman',
        telefono: '1155007008',
        edad: 29,
    },
    // --- familiares ---
    {
        id_usuario: 8,
        apellido: 'Lopez',
        nombre: 'Maria',
        identificacion: '28765432',
        direccion: 'Calle Falsa 123, Rosario',
        telefono: '1155002002',
        edad: 45,
    },
    {
        id_usuario: 9,
        apellido: 'Ramirez',
        nombre: 'Jorge',
        identificacion: '31456789',
        direccion: 'San Martin 456, Cordoba',
        telefono: '1155003003',
        edad: 38,
    },
    {
        id_usuario: 10,
        apellido: 'Sanchez',
        nombre: 'Roberto',
        identificacion: '25123456',
        direccion: 'Lavalle 800, CABA',
        telefono: '1155008008',
        edad: 55,
    },
    {
        id_usuario: 11,
        apellido: 'Gomez',
        nombre: 'Laura',
        identificacion: '27654321',
        direccion: 'Tucuman 1200, Rosario',
        telefono: '1155009009',
        edad: 50,
    },
    {
        id_usuario: 12,
        apellido: 'Diaz',
        nombre: 'Patricia',
        identificacion: '26987654',
        direccion: 'Sarmiento 500, Cordoba',
        telefono: '1155010010',
        edad: 48,
    },
    {
        id_usuario: 13,
        apellido: 'Alvarez',
        nombre: 'Miguel',
        identificacion: '24567890',
        direccion: 'Independencia 300, Mendoza',
        telefono: '1155011011',
        edad: 60,
    },
    // --- familiares activos extra (para testing de asignaciones) ---
    {
        id_usuario: 14,
        apellido: 'Vega',
        nombre: 'Carolina',
        identificacion: '38901234',
        direccion: 'Av. Corrientes 3400, CABA',
        telefono: '1155012012',
        edad: 35,
    },
    {
        id_usuario: 15,
        apellido: 'Molina',
        nombre: 'Andres',
        identificacion: '32109876',
        direccion: 'Mitre 780, Mar del Plata',
        telefono: '1155013013',
        edad: 41,
    },
    {
        id_usuario: 16,
        apellido: 'Castro',
        nombre: 'Daniela',
        identificacion: '39012345',
        direccion: 'Belgrano 500, San Juan',
        telefono: '1155014014',
        edad: 29,
    },
]

module.exports = { personas }
