const prisma = require("../config/database");

const obtenerGuardias = async (req, res, next) => {
  try {
    const {
      pacienteId,
      cuidadorId,
      fecha,
      horaInicio,
      horaFin
    } = req.query;

    const filtros = {};

    // filtro por paciente
    if (pacienteId) {
      filtros.paciente_id = parseInt(pacienteId);
    }

    // filtro por cuidador
    if (cuidadorId) {
      filtros.cuidador_id = parseInt(cuidadorId);
    }

    // filtro por fecha (solo ese día)
    if (fecha) {
      const fechaInicio = new Date(fecha);
      const fechaFin = new Date(fecha);
      fechaFin.setDate(fechaFin.getDate() + 1);

      filtros.fecha_inicio = {
        gte: fechaInicio,
        lt: fechaFin
      };
    }

    // filtro por hora inicio
    if (horaInicio) {
      filtros.hora_inicio = {
        gte: new Date(`1970-01-01T${horaInicio}`)
      };
    }

    // filtro por hora fin
    if (horaFin) {
      filtros.hora_finalizacion = {
        lte: new Date(`1970-01-01T${horaFin}`)
      };
    }

    const guardias = await prisma.guardia.findMany({
      where: filtros,
      include: {
        asignacion_servico: {
          include: {
            tarea: true,
          },
        },
        guardia_estado: true
      },
      orderBy: {
        fecha_inicio: "desc"
      }
    });

    res.json({
      success: true,
      data: guardias,
      message: "guardias obtenidas exitosamente"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerGuardias
};
