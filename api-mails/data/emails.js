// estilos base reutilizados en todos los templates
const baseStyles = {
  wrapper: 'font-family: Arial, sans-serif; background-color: #fbfef9; padding: 20px;',
  card: 'max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;',
  header: 'background-color: #011627; padding: 24px; text-align: center;',
  headerTitle: 'color: #ffffff; margin: 0; font-size: 22px;',
  body: 'padding: 24px;',
  text: 'color: #555; font-size: 15px; line-height: 1.6;',
  footer: 'padding: 16px 24px; border-top: 1px solid #e5e7eb; text-align: center;',
  footerText: 'color: #9ca3af; font-size: 12px; margin: 0;',
};

// genera un bloque informativo con borde lateral de color
const infoBlock = (color, content) => `
  <div style="border-left: 4px solid ${color}; padding: 12px 16px; background-color: #f9fafb; border-radius: 0 6px 6px 0; margin: 16px 0;">
    ${content}
  </div>
`;

// genera la estructura base del email (wrapper + header + body + footer)
const layout = (title, bodyHtml) => `
  <div style="${baseStyles.wrapper}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.header}">
        <h1 style="${baseStyles.headerTitle}">${title}</h1>
      </div>
      <div style="${baseStyles.body}">
        ${bodyHtml}
      </div>
      <div style="${baseStyles.footer}">
        <p style="${baseStyles.footerText}">No respondas este email.</p>
      </div>
    </div>
  </div>
`;

export const emailTemplates = {
  // template de bienvenida - se envia al crear una cuenta nueva
  bienvenida: (params) => layout('Bienvenido/a', `
    <p style="${baseStyles.text}">Hola <strong>${params.nombre}</strong>,</p>
    <p style="${baseStyles.text}">Tu cuenta ha sido creada exitosamente. Nuestro equipo revisara tu solicitud y te notificaremos cuando sea aprobada.</p>
    ${infoBlock('#207bff', `
      <p style="margin: 0; color: #333;"><strong>Email registrado:</strong> ${params.email}</p>
    `)}
    <p style="${baseStyles.text}">Gracias por registrarte en nuestra plataforma.</p>
  `),

  // template de aceptacion de cuenta - se envia cuando un admin aprueba la cuenta (estado PA -> A)
  aceptacion_cuenta: (params) => layout('Cuenta Aprobada', `
    <p style="${baseStyles.text}">Hola <strong>${params.nombre}</strong>,</p>
    <p style="${baseStyles.text}">Tu cuenta ha sido <strong style="color: #10b981;">aprobada</strong> por nuestro equipo administrativo.</p>
    ${infoBlock('#207bff', `
      <p style="margin: 0; color: #333;"><strong>Email:</strong> ${params.email}</p>
      <p style="margin: 4px 0 0; color: #333;">Ya podes iniciar sesion en la plataforma.</p>
    `)}
    <p style="${baseStyles.text}">Si tenes alguna consulta, comunicate con el equipo de soporte.</p>
  `),

  // template de rechazo de cuenta - se envia cuando un admin rechaza la cuenta (estado -> R)
  rechazo_cuenta: (params) => layout('Cuenta Rechazada', `
    <p style="${baseStyles.text}">Hola <strong>${params.nombre}</strong>,</p>
    <p style="${baseStyles.text}">Lamentamos informarte que tu solicitud de cuenta ha sido <strong style="color: #ef4444;">rechazada</strong>.</p>
    ${infoBlock('#ef4444', `
      <p style="margin: 0; color: #333;"><strong>Motivo:</strong> ${params.motivo}</p>
    `)}
    <p style="${baseStyles.text}">Si crees que se trata de un error, podes comunicarte con el equipo administrativo para mas informacion.</p>
  `),

  // template de habilitacion de documentacion - se envia cuando la documentacion del cuidador es aprobada
  habilitacion_documentacion: (params) => layout('Documentacion Aprobada', `
    <p style="${baseStyles.text}">Hola <strong>${params.nombre}</strong>,</p>
    <p style="${baseStyles.text}">Tu documentacion ha sido <strong style="color: #10b981;">aprobada</strong> exitosamente.</p>
    ${infoBlock('#207bff', `
      <p style="margin: 0; color: #333;">Estas habilitado/a para recibir asignaciones de servicio.</p>
      <p style="margin: 4px 0 0; color: #333;">Te notificaremos cuando se te asigne un nuevo servicio.</p>
    `)}
    <p style="${baseStyles.text}">Gracias por completar tu documentacion.</p>
  `),

  // template de asignacion de servicio - se envia cuando se asigna un cuidador a una solicitud
  asignacion_servicio: (params) => layout('Nueva Asignacion de Servicio', `
    <p style="${baseStyles.text}">Hola <strong>${params.nombre}</strong>,</p>
    <p style="${baseStyles.text}">Se te ha asignado un nuevo servicio de acompanamiento. A continuacion encontraras los detalles:</p>
    ${infoBlock('#207bff', `
      <p style="margin: 0; color: #333;"><strong>Paciente:</strong> ${params.paciente_nombre} ${params.paciente_apellido}</p>
      <p style="margin: 4px 0 0; color: #333;"><strong>Direccion:</strong> ${params.paciente_direccion}</p>
      <p style="margin: 4px 0 0; color: #333;"><strong>Fecha:</strong> ${params.fecha_del_servicio}</p>
      <p style="margin: 4px 0 0; color: #333;"><strong>Hora de inicio:</strong> ${params.hora_inicio}</p>
      <p style="margin: 4px 0 0; color: #333;"><strong>Cantidad de horas:</strong> ${params.cantidad_horas}</p>
      <p style="margin: 4px 0 0; color: #333;"><strong>Tarea:</strong> ${params.tarea_descripcion}</p>
    `)}
    <p style="${baseStyles.text}">Asegurate de confirmar tu asistencia. Ante cualquier inconveniente, contacta al equipo administrativo.</p>
  `),

  // template de cancelacion de acompanamiento - se envia cuando se cancela una guardia
  cancelacion_acompanamiento: (params) => layout('Acompanamiento Cancelado', `
    <p style="${baseStyles.text}">Hola <strong>${params.nombre}</strong>,</p>
    <p style="${baseStyles.text}">Te informamos que el siguiente acompanamiento ha sido <strong style="color: #f59e0b;">cancelado</strong>.</p>
    ${infoBlock('#f59e0b', `
      <p style="margin: 0; color: #333;"><strong>Paciente:</strong> ${params.paciente_nombre} ${params.paciente_apellido}</p>
      <p style="margin: 4px 0 0; color: #333;"><strong>Fecha:</strong> ${params.fecha}</p>
      <p style="margin: 4px 0 0; color: #333;"><strong>Motivo:</strong> ${params.motivo}</p>
    `)}
    <p style="${baseStyles.text}">Si tenes consultas sobre esta cancelacion, comunicate con el equipo administrativo.</p>
  `),

  // template de deshabilitacion de cuenta - se envia cuando se deshabilita una cuenta (activo = 0)
  deshabilitacion_cuenta: (params) => layout('Cuenta Deshabilitada', `
    <p style="${baseStyles.text}">Hola <strong>${params.nombre}</strong>,</p>
    <p style="${baseStyles.text}">Tu cuenta ha sido <strong style="color: #ef4444;">deshabilitada</strong> por el equipo administrativo.</p>
    ${infoBlock('#ef4444', `
      <p style="margin: 0; color: #333;"><strong>Email:</strong> ${params.email}</p>
      <p style="margin: 4px 0 0; color: #333;"><strong>Motivo:</strong> ${params.motivo}</p>
    `)}
    <p style="${baseStyles.text}">Si crees que se trata de un error, comunicate con el equipo de soporte para resolver la situacion.</p>
  `),
};
