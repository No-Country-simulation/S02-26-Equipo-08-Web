const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: "Credenciales inválidas" });
    }

    // 2. Verificar si está bloqueado (campo fecha_deshabilitado)
    if (user.fecha_deshabilitado) {
      return res.status(403).json({ 
        message: "Cuenta bloqueada. Demasiados intentos fallidos. Contacte a soporte." 
      });
    }

    // 3. Comparar contraseña (password enviado vs password_hash en DB)
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      // ÉXITO: Reiniciamos intentos y actualizamos fecha de login
      await prisma.usuario.update({
        where: { id: user.id },
        data: {
          intentos_login: 0,
          fecha_ultimo_login: new Date()
        }
      });

      return res.status(200).json({ 
        message: "Bienvenido",
        user: { 
            id: user.id,
            email: user.email, 
            id_rol: user.id_rol 
        } 
      });

    } else {
      // ERROR: Aumentamos el contador de intentos
      const nuevosIntentos = user.intentos_login + 1;
      const dataUpdate = { intentos_login: nuevosIntentos };
      
      // Si llega a 3 intentos fallidos, grabamos la fecha de bloqueo
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

// EXPORTACIÓN CORRECTA PARA COMMONJS
module.exports = {
    login
};