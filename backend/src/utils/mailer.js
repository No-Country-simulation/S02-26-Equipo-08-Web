const nodemailer = require('nodemailer');

// El 'transporter' usa las variables del archivo .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASSWORD,
    },
});


/*
const enviarMailRecuperacion = async (email, nombre, token) => {
    // URL que apunta a tu página de Reset Password en el Frontend (puerto 3000)
    const urlRecuperacion = `http://localhost:3000/identity/account/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Soporte Sistema" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Recuperación de Contraseña",
        html: `
            <div style="font-family: sans-serif;">
                <h2>Hola ${nombre},</h2>
                <p>Haz clic en el botón para cambiar tu clave:</p>
                <a href="${urlRecuperacion}" style="background: #007bff; color: white; padding: 10px; text-decoration: none;">
                    Restablecer Contraseña
                </a>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};
*/

const enviarMailRecuperacion = async (email, nombre, token) => {
  const urlRecuperacion = `${process.env.FRONTEND_URL}/identity/account/reset-password?token=${token}`;

  const mailOptions = {
    from: `"PYMECare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Restablece tu contraseña - PYMECare",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #011627; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">PYMECare</h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="color: #333333; margin-top: 0;">Hola, ${nombre}</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.5;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. No te preocupes, puedes hacerlo fácilmente haciendo clic en el botón de abajo:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${urlRecuperacion}" 
               style="background-color: #3b82f6; color: #ffffff; padding: 14px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #666666; font-size: 14px; line-height: 1.5;">
            Este enlace **expirará en 1 hora** por razones de seguridad.
          </p>
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
          <p style="color: #999999; font-size: 12px;">
            Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña actual seguirá funcionando.
          </p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; color: #aaaaaa; font-size: 12px;">
          &copy; 2026 PYMECare. Todos los derechos reservados.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de recuperación");
  }
};

module.exports = { enviarMailRecuperacion };