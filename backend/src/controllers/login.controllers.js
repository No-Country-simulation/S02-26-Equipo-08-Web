// 1. Importaciones van al principio
require('dotenv').config();
const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { enviarMailRecuperacion } = require('../utils/mailer');
const { registrarLog } = require('../utils/auditoria');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Credenciales inválidas" });
    }

    // 2. Verificar si está bloqueado
    if (user.fecha_deshabilitado) {
      return res.status(403).json({
        message: "Cuenta bloqueada. Demasiados intentos fallidos. Contacte a soporte."
      });
    }

    // 3. Comparar contraseña (password enviado vs password_hash en DB)
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      // Obtener persona asociada por id_usuario (sin relación Prisma)
      const persona = await prisma.persona.findUnique({
        where: { id_usuario: user.id },
      });

      const datos_persona = persona
        ? `${persona.apellido} ${persona.nombre}`
        : "Usuario";

      const rolDb = await prisma.rol.findUnique({ where: { id: user.id_rol } });
      const nombreRol = rolDb?.descripcion || "Sin rol";
      console.log("Rol encontrado:", nombreRol);
      

      // 4. Generación del token
      const token = jwt.sign(
        {
          id: user.id,
          id_rol: user.id_rol,
          nombre_usuario: datos_persona,
          rol_descripcion: nombreRol
        },
        process.env.JWT_SECRET, 
        { expiresIn: '8h' }
      );

      // 5. REGISTRO DE AUDITORÍA (Corregido: ahora usa 'user')
      try {
        await prisma.log_auditoria.create({
          data: {
            id_usuario: user.id,
            accion: 'LOGIN',
            tabla_afectada: 'usuario',
            valor_nuevo: { 
                email: user.email, 
                nombre: datos_persona,
                id_rol: user.id_rol 
            },
            ip_direccion: req.headers['x-forwarded-for'] || req.socket.remoteAddress || "127.0.0.1"
          }
        });
      } catch (auditError) {
        console.error("Error al grabar auditoría (no bloqueante):", auditError);
      }

      // 6. ÉXITO: Reiniciamos intentos y actualizamos fecha de login
      await prisma.usuario.update({
        where: { id: user.id },
        data: {
          intentos_login: 0,
          fecha_ultimo_login: new Date()
        }
      });

      return res.status(200).json({ 
        message: "Bienvenido",
        token: token,
        user: { 
            id: user.id,
            email: user.email, 
            id_rol: user.id_rol, 
            nombre_usuario: datos_persona,
            rol_descripcion: nombreRol
        } 
      });

    } else {
      // ERROR: Aumentamos el contador de intentos
      const nuevosIntentos = (user.intentos_login || 0) + 1;
      const dataUpdate = { intentos_login: nuevosIntentos };
      
      if (nuevosIntentos >= 3) {
        dataUpdate.fecha_deshabilitado = new Date();
      }

      await prisma.usuario.update({
        where: { id: user.id },
        data: dataUpdate
      });

      const mensaje = nuevosIntentos >= 3 
        ? "Cuenta bloqueada por seguridad tras 3 intentos fallidos." 
        : `Contraseña incorrecta. Intento ${nuevosIntentos} de 3.`;

      return res.status(401).json({ message: mensaje });
    }

  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

const solicitarRecuperacion = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Verificar si el usuario existe
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      // Por seguridad, a veces es mejor decir que "si el correo existe, se enviará", 
      // pero para desarrollo usaremos este mensaje claro:
      return res.status(404).json({ message: "No existe un usuario con ese correo electrónico." });
    }

    // 2. Generar un token temporal para la recuperación (vence en 1 hora)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, action: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3. Obtener el nombre para el saludo del correo
    const persona = await prisma.persona.findUnique({
      where: { id_usuario: user.id },
    });
    const nombreUsuario = persona ? persona.nombre : "Usuario";

    // 4. ENVIAR EL CORREO usando tu mailer.js
    console.log(`Intentando enviar correo a: ${email}`);
    await enviarMailRecuperacion(email, nombreUsuario, resetToken);

    // 5. Registro opcional en auditoría
    try {
      await prisma.log_auditoria.create({
        data: {
          id_usuario: user.id,
          accion: 'SOLICITUD_RECUPERACION_PASS',
          tabla_afectada: 'usuario',
          ip_direccion: req.headers['x-forwarded-for'] || req.socket.remoteAddress || "127.0.0.1"
        }
      });
    } catch (e) { console.error("Error auditoría:", e); }

    return res.status(200).json({ 
      message: "Se ha enviado un enlace de recuperación a tu correo electrónico." 
    });

  } catch (error) {
    console.error("Error en solicitarRecuperacion:", error);
    return res.status(500).json({ message: "Error al procesar la solicitud de recuperación." });
  }
};

const restablecerPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // 1. Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 2. Encriptar nueva clave
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Actualizar contraseña
    await prisma.usuario.update({
      where: { id: decoded.id },
      data: { password_hash: password_hash }
    });

    // ==========================================
    // 4. REGISTRO DE AUDITORÍA (Usando tu función)
    // ==========================================
    await registrarLog({
        tx: prisma, // O null si tu función registrarLog no requiere obligatoriamente una transacción
        id_usuario: decoded.id,
        accion: 'RESET_PASSWORD_SUCCESS',
        tabla: 'usuario',
        detalles: { 
            mensaje: "El usuario restableció su contraseña exitosamente vía token."
        },
        req: req
    });
    // ==========================================

    return res.status(200).json({ message: "Contraseña actualizada con éxito" });

  } catch (error) {
    console.error("Error en reset:", error);
    return res.status(400).json({ message: "El enlace es inválido o ha expirado" });
  }
};

module.exports = {
    login,
    solicitarRecuperacion,
    restablecerPassword
};