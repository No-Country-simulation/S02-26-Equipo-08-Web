// controller de registro publico
// maneja el registro de cuidadores y familiares
// ambos endpoints son publicos (no requieren autenticacion)
//
// NOTA IMPORTANTE: el schema.prisma del proyecto NO coincide con la BD real.
// Por eso usamos $queryRawUnsafe en lugar de los metodos de Prisma,
// para trabajar directo con las columnas reales de la BD.
//
// BD real:
// - usuario: id (autoincrement), email (unique), password_hash, id_rol, estado ('PA'), activo (1)
// - persona: id (autoincrement), id_usuario, nombre, apellido, identificacion (unique), direccion, telefono (unique), edad
// - cuidador: id (autoincrement), id_usuario, cbu, cvu, alias, con_documentacion, id_autorizado_por, fecha_autorizado, fecha_ingreso

const prisma = require("../config/database");
const bcrypt = require("bcrypt");

// POST /api/registro/cuidador
// crea usuario (rol 2, estado PA, activo 0) + persona + cuidador en una transaccion
const registrarCuidador = async (req, res, next) => {
  try {
    const {
      email,
      password,
      nombre,
      apellido,
      identificacion,
      telefono,
      direccion,
      edad,
      cbu,
      cvu,
      alias,
    } = req.body;

    // validacion de campos obligatorios
    if (!email || !password || !nombre || !apellido || !identificacion || !telefono || !direccion || !edad) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Faltan campos obligatorios.",
      });
    }

    // verificar si ya existe un usuario con ese email
    const [usuarioExistente] = await prisma.$queryRawUnsafe(
      `SELECT id FROM usuario WHERE email = $1 LIMIT 1`,
      email
    );

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Ya existe un usuario registrado con ese email.",
      });
    }

    // verificar si ya existe una persona con ese DNI
    const [personaExistente] = await prisma.$queryRawUnsafe(
      `SELECT id FROM persona WHERE identificacion = $1 LIMIT 1`,
      identificacion
    );

    if (personaExistente) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Ya existe un usuario registrado con ese DNI.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // transaccion con queries raw para trabajar con la BD real
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. crear usuario
      const [usuario] = await tx.$queryRawUnsafe(
        `INSERT INTO usuario (email, password_hash, id_rol, estado, activo)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email`,
        email,
        passwordHash,
        2,    // rol cuidador
        'PA', // estado pendiente
        0     // no activo hasta que admin apruebe
      );

      // 2. crear persona
      await tx.$queryRawUnsafe(
        `INSERT INTO persona (id_usuario, nombre, apellido, identificacion, direccion, telefono, edad)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        usuario.id,
        nombre,
        apellido,
        identificacion,
        direccion,
        telefono,
        parseInt(edad)
      );

      // 3. crear cuidador
      await tx.$queryRawUnsafe(
        `INSERT INTO cuidador (id_usuario, cbu, cvu, alias, con_documentacion, id_autorizado_por, fecha_ingreso)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        usuario.id,
        cbu || null,
        cvu || null,
        alias || null,
        0,
        0,
        new Date()
      );

      return usuario;
    });

    return res.status(201).json({
      success: true,
      data: { id: resultado.id, email: resultado.email },
      message: "Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador.",
    });
  } catch (error) {
    console.error("REGISTRAR CUIDADOR ERROR:", error);

    // manejar errores de constraint unique de la BD
    if (error.code === 'P2010' || error.message?.includes('unique')) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Ya existe un registro con esos datos (email, DNI o teléfono duplicado).",
      });
    }

    next(error);
  }
};

// POST /api/registro/familiar
// crea usuario (rol 3, estado PA, activo 1) + persona en una transaccion
// el vinculo con paciente (tabla familiar) se hace despues por el admin
const registrarFamiliar = async (req, res, next) => {
  try {
    const {
      email,
      password,
      nombre,
      apellido,
      identificacion,
      telefono,
      direccion,
      edad,
    } = req.body;

    // validacion de campos obligatorios
    if (!email || !password || !nombre || !apellido || !identificacion || !telefono || !direccion || !edad) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Faltan campos obligatorios.",
      });
    }

    // verificar si ya existe un usuario con ese email
    const [usuarioExistente] = await prisma.$queryRawUnsafe(
      `SELECT id FROM usuario WHERE email = $1 LIMIT 1`,
      email
    );

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Ya existe un usuario registrado con ese email.",
      });
    }

    // verificar si ya existe una persona con ese DNI
    const [personaExistente] = await prisma.$queryRawUnsafe(
      `SELECT id FROM persona WHERE identificacion = $1 LIMIT 1`,
      identificacion
    );

    if (personaExistente) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Ya existe un usuario registrado con ese DNI.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // transaccion con queries raw
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. crear usuario
      const [usuario] = await tx.$queryRawUnsafe(
        `INSERT INTO usuario (email, password_hash, id_rol, estado, activo)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email`,
        email,
        passwordHash,
        3,    // rol familiar
        'PA', // estado pendiente
        1     // activo desde el registro
      );

      // 2. crear persona
      await tx.$queryRawUnsafe(
        `INSERT INTO persona (id_usuario, nombre, apellido, identificacion, direccion, telefono, edad)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        usuario.id,
        nombre,
        apellido,
        identificacion,
        direccion,
        telefono,
        parseInt(edad)
      );

      return usuario;
    });

    return res.status(201).json({
      success: true,
      data: { id: resultado.id, email: resultado.email },
      message: "Registro exitoso. Ya podés iniciar sesión.",
    });
  } catch (error) {
    console.error("REGISTRAR FAMILIAR ERROR:", error);

    if (error.code === 'P2010' || error.message?.includes('unique')) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Ya existe un registro con esos datos (email, DNI o teléfono duplicado).",
      });
    }

    next(error);
  }
};

module.exports = { registrarCuidador, registrarFamiliar };
