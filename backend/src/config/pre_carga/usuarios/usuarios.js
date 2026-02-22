const usuarios = [
    // --- administradores (siempre activos) ---
    {
        nombre: 'Carlos',
        apellido: 'Martinez',
        dni: '30123456',
        email: 'admin@sistema.com',
        direccion: 'Av. Siempre Viva 742, CABA',
        telefono: '1155001001',
        edad: 40,
        id_rol: 1,
        pass: '123456',
        id_usuario_estado: 2, // Activo
    },
    {
        nombre: 'Valeria',
        apellido: 'Ruiz',
        dni: '29876543',
        email: 'admin2@sistema.com',
        direccion: 'Callao 1200, CABA',
        telefono: '1155001002',
        edad: 42,
        id_rol: 1,
        pass: '123456',
        id_usuario_estado: 2, // Activo
    },
    // --- cuidadores (estados variados) ---
    {
        nombre: 'Ana',
        apellido: 'Garcia',
        dni: '35678901',
        email: 'cuidador1@sistema.com',
        direccion: 'Belgrano 789, CABA',
        telefono: '1155004004',
        edad: 30,
        id_rol: 2,
        pass: '123456',
        id_usuario_estado: 2, // Activo
    },
    {
        nombre: 'Lucas',
        apellido: 'Moix',
        dni: '33456123',
        email: 'lmoix@gmail.com',
        direccion: 'Mitre 321, La Plata',
        telefono: '5422813030',
        edad: 22,
        id_rol: 2,
        pass: '123',
        id_usuario_estado: 2, // Activo
    },
    {
        nombre: 'Sofia',
        apellido: 'Fernandez',
        dni: '36789012',
        email: 'cuidador3@sistema.com',
        direccion: 'Rivadavia 1500, Mendoza',
        telefono: '1155006006',
        edad: 26,
        id_rol: 2,
        pass: '123456',
        id_usuario_estado: 1, // Pendiente de Aceptar
    },
    {
        nombre: 'Diego',
        apellido: 'Torres',
        dni: '37890123',
        email: 'cuidador4@sistema.com',
        direccion: 'Corrientes 2000, CABA',
        telefono: '1155007007',
        edad: 24,
        id_rol: 2,
        pass: '123456',
        id_usuario_estado: 3, // Rechazado
    },
    {
        nombre: 'Camila',
        apellido: 'Herrera',
        dni: '34567890',
        email: 'cuidador5@sistema.com',
        direccion: 'Lavalle 600, Tucuman',
        telefono: '1155007008',
        edad: 29,
        id_rol: 2,
        pass: '123456',
        id_usuario_estado: 4, // Desactivado
    },
    // --- familiares (estados variados) ---
    {
        nombre: 'Maria',
        apellido: 'Lopez',
        dni: '28765432',
        email: 'familiar1@gmail.com',
        direccion: 'Calle Falsa 123, Rosario',
        telefono: '1155002002',
        edad: 45,
        id_rol: 3,
        pass: '123456',
        id_usuario_estado: 2, // Activo
    },
    {
        nombre: 'Jorge',
        apellido: 'Ramirez',
        dni: '31456789',
        email: 'familiar2@gmail.com',
        direccion: 'San Martin 456, Cordoba',
        telefono: '1155003003',
        edad: 38,
        id_rol: 3,
        pass: '123456',
        id_usuario_estado: 2, // Activo
    },
    {
        nombre: 'Roberto',
        apellido: 'Sanchez',
        dni: '25123456',
        email: 'familiar3@gmail.com',
        direccion: 'Lavalle 800, CABA',
        telefono: '1155008008',
        edad: 55,
        id_rol: 3,
        pass: '123456',
        id_usuario_estado: 1, // Pendiente de Aceptar
    },
    {
        nombre: 'Laura',
        apellido: 'Gomez',
        dni: '27654321',
        email: 'familiar4@gmail.com',
        direccion: 'Tucuman 1200, Rosario',
        telefono: '1155009009',
        edad: 50,
        id_rol: 3,
        pass: '123456',
        id_usuario_estado: 1, // Pendiente de Aceptar
    },
    {
        nombre: 'Patricia',
        apellido: 'Diaz',
        dni: '26987654',
        email: 'familiar5@gmail.com',
        direccion: 'Sarmiento 500, Cordoba',
        telefono: '1155010010',
        edad: 48,
        id_rol: 3,
        pass: '123456',
        id_usuario_estado: 4, // Desactivado
    },
    {
        nombre: 'Miguel',
        apellido: 'Alvarez',
        dni: '24567890',
        email: 'familiar6@gmail.com',
        direccion: 'Independencia 300, Mendoza',
        telefono: '1155011011',
        edad: 60,
        id_rol: 3,
        pass: '123456',
        id_usuario_estado: 3, // Rechazado
    },
]

module.exports = {usuarios}
