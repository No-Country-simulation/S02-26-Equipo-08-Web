// 1. Importaciones van al principio
require('dotenv').config();
const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

      const nombreRol = user.rol?.descripcion?.toUpperCase() || "Sin rol";
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

module.exports = {
    login
};