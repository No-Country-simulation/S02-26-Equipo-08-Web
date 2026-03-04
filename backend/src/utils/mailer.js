const nodemailer = require('nodemailer');
// Corregimos la ruta: subimos un nivel (../) para entrar a data
const { emailTemplates } = require('../../../api-mails/data/emails');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASSWORD,
    },
});

const enviarMailRecuperacion = async (email, nombre, token) => {
  // Asegurate que FRONTEND_URL esté en tu .env (ej: http://localhost:5173)
  const urlRecuperacion = `${process.env.FRONTEND_URL}/identity/account/reset-password?token=${token}`;

  try {
    const htmlContent = emailTemplates.recuperacion_clave({
      nombre: nombre,
      url_recuperacion: urlRecuperacion
    });

    const mailOptions = {
      from: `"PYMECare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Restablece tu contraseña - PYMECare",
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de recuperación");
  }
};

module.exports = { enviarMailRecuperacion };