require('dotenv').config();
const nodemailer = require('nodemailer');

async function probarEnvio() {
    console.log("Iniciando prueba de envío...");
    console.log("Usando correo:", process.env.MAIL_USER);
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_APP_PASSWORD, // Tu clave de 16 letras
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: "lmoix85@gmail.com", // Te lo envías a ti mismo para probar
            subject: "Prueba de conexión Nodemailer",
            text: "¡Si lees esto, la clave de aplicación de Gmail funciona correctamente!",
            html: "<b>¡Si lees esto, la clave de aplicación de Gmail funciona correctamente!</b>",
        });

        console.log("✅ ¡Correo enviado con éxito!");
        console.log("ID del mensaje:", info.messageId);
    } catch (error) {
        console.error("❌ Error al enviar el correo:");
        console.error(error.message);
    }
}

probarEnvio();