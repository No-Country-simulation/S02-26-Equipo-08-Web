/**
 * Formatea una fecha de forma legible para el usuario
 * @param {Date|string} date - La fecha a formatear
 * @param {string} mode - 'short' para 09/03/2026 o 'long' para formato completo
 * @returns {string} Fecha formateada
 */
const formatDate = (date, mode = 'short') => {
  if (!date) return "";
  const fechaOriginal = new Date(date);
  if (isNaN(fechaOriginal.getTime())) return "Fecha inválida";

  const options = mode === 'long' 
    ? { dateStyle: 'full' } 
    : { day: '2-digit', month: '2-digit', year: 'numeric' };

  return new Intl.DateTimeFormat('es-AR', options).format(fechaOriginal);
};

// Exportar al estilo Node.js tradicional
module.exports = { formatDate };