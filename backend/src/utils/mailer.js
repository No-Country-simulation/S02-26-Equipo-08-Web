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

const deshabilitacion_cuenta = async (email, nombre, motivo) => {
  
  //const urlRecuperacion = `${process.env.FRONTEND_URL}/identity/account/reset-password?token=${token}`;

  try {
    const htmlContent = emailTemplates.deshabilitacion_cuenta({
      email: email,
      nombre: nombre,
      motivo: motivo
    });

    const mailOptions = {
      from: `"PYMECare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Cuenta deshabilitada - PYMECare",
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de deshabilitacion de cuenta");
  }
};

const bienvenida = async (nombre, email) => {
  
  
  try {
    const htmlContent = emailTemplates.bienvenida({
      email: email,
      nombre: nombre
      
    });

    const mailOptions = {
      from: `"PYMECare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Bienvenido - PYMECare",
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de deshabilitacion de cuenta");
  }
};


const aceptacion_cuenta = async (nombre, email) => {
  
  
  try {
    const htmlContent = emailTemplates.aceptacion_cuenta({
      email: email,
      nombre: nombre
      
    });

    const mailOptions = {
      from: `"PYMECare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Bienvenido - PYMECare",
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de aceptacion de cuenta");
  }
};

const rechazo_cuenta = async (email, nombre, motivo) => {
  
  
  try {
    const htmlContent = emailTemplates.rechazo_cuenta({
      email: email,
      nombre: nombre,
      motivo: motivo
    });

    const mailOptions = {
      from: `"PYMECare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Cuenta rechazada - PYMECare",
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de rechazo de cuenta");
  }
};


const asignacion_servicio = async (email, cuidadorNombre, pacienteNombre, pacienteApellido, pacienteDireccion, pedidoServicioFecha, pedidoServicioHoraInicio, pedidoServicioCantidadHoras, tareaDescripcion) => {
  
  
  try {
    const htmlContent = emailTemplates.asignacion_servicio({
      nombre: cuidadorNombre,
      paciente_nombre: pacienteNombre, 
      paciente_apellido: pacienteApellido,
      paciente_direccion: pacienteDireccion,
      fecha_del_servicio: pedidoServicioFecha,
      hora_inicio: pedidoServicioHoraInicio,
      cantidad_horas: pedidoServicioCantidadHoras,
      tarea_descripcion: tareaDescripcion
    });

    const mailOptions = {
      from: `"PYMECare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Asignación de serivico - PYMECare",
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de asignación de servicio");
  }
};

const cancelacion_acompanamiento = async (email, cuidadorNombre, pacienteNombre, pacienteApellido, pedidoServicioFecha, motivoCancelacion) => {
  
  
  try {
    const htmlContent = emailTemplates.cancelacion_acompanamiento({
      nombre: cuidadorNombre,
      paciente_nombre: pacienteNombre, 
      paciente_apellido: pacienteApellido,
      fecha: pedidoServicioFecha,
      motivo: motivoCancelacion
    });

    const mailOptions = {
      from: `"PYMECare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Cancelación de serivico - PYMECare",
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente a:", email);
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de cancelación de servicio");
  }
};



module.exports = { enviarMailRecuperacion, deshabilitacion_cuenta, bienvenida, aceptacion_cuenta, rechazo_cuenta, asignacion_servicio, cancelacion_acompanamiento };