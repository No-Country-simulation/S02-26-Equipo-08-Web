const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardSummary = async (req, res) => {
  const { id, role } = req.user;
  
  // Parámetros de paginación
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    let data = {
      kpis: [],
      listado: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0
      }
    };

    ;
    console.log (role);

    // --- 1. LÓGICA PARA ADMINISTRADOR ---
    if (role === 1) {
      const [countUsuarios, countPacientes] = await Promise.all([
        prisma.usuario.count(),
        prisma.paciente.count()
      ]);

      data.kpis = [
        { label: 'Total Usuarios', value: countUsuarios },
        { label: 'Pacientes Activos', value: countPacientes }
      ];

      const [{ total }] = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS total FROM usuario`);
      
      data.listado = await prisma.$queryRawUnsafe(`
        SELECT u.id, u.email, r.descripcion AS rol, p.nombre, p.apellido
        FROM usuario u
        LEFT JOIN persona p ON p.id_usuario = u.id
        LEFT JOIN rol r ON r.id = u.id_rol
        ORDER BY u.id DESC
        LIMIT $1 OFFSET $2
      `, limit, offset);

      data.pagination.total = total;
      data.pagination.totalPages = Math.ceil(total / limit);

    // --- 2. LÓGICA PARA CUIDADOR ---
   } else if (role === 2) { // --- CUIDADOR ---
    // 1. Buscamos el ID de cuidador asociado a este usuario
    const cuidadorData = await prisma.cuidador.findFirst({ 
        where: { id_usuario: Number(id) } 
    });

    console.log ("aca");
    console.log(id);
    console.log(cuidadorData.id);

    if (!cuidadorData) {
        data.kpis = [{ label: 'Mis Guardias', value: 0 }];
        return res.json(data);
    }

    console.log("acaII");

    // 2. Contamos las asignaciones reales
    const totalAsignaciones = await prisma.asignacion_servico.count({ 
        where: { id_cuidador: id } 
    });

    // 3. Conversión de parámetros para la Raw Query
    // PostgreSQL es estricto: $1, $2 y $3 deben ser números
    const idParaQuery = Number(id);
    const limitParaQuery = Number(limit);
    const offsetParaQuery = Number(offset);

    console.log("Valores para la quer");
    console.log(idParaQuery);

    console.log("Valores para la query:", { idParaQuery, limitParaQuery, offsetParaQuery });

    // 4. Ejecución de la consulta convertida
    const misGuardias = await prisma.$queryRawUnsafe(`
        SELECT 
        ps.id, 
        ps.fecha_del_servicio, 
        ps.hora_inicio, 
        pac.nombre AS nombre_paciente, 
        pac.apellido AS apellido_paciente
        FROM asignacion_servico asig
        LEFT JOIN pedido_servicio ps ON asig.id_pedido = ps.id
        LEFT JOIN paciente pac ON asig.id_paciente = pac.id
        WHERE asig.id_cuidador = $1
        ORDER BY ps.fecha_del_servicio DESC
        LIMIT $2 OFFSET $3
    `, idParaQuery, limitParaQuery, offsetParaQuery);

    // 5. Mapeo de resultados
    data.kpis = [{ label: 'Mis Guardias', value: totalAsignaciones }];
    
    data.listado = misGuardias.map(g => ({
    id: g.id,
    detalle: `${g.nombre_paciente} ${g.apellido_paciente || ''}`, // Unimos nombre y apellido
    informacion_adicional: "Cuidado Domiciliario",
    fecha: g.fecha_del_servicio,
    estado: "ACTIVO",
    // Mantenemos el objeto paciente por si el Front lo usa así
    paciente: { 
        nombre: g.nombre_paciente, 
        apellido: g.apellido_paciente 
    }
  }));
  console.log("Primer registro del listado:", data.listado[0]);

  // 6. Paginación (Usando totalAsignaciones, no totalServicios)
  data.pagination.total = totalAsignaciones;
  data.pagination.totalPages = Math.ceil(totalAsignaciones / limitParaQuery) || 0;
    // --- 3. LÓGICA PARA FAMILIAR ---
   } else if (role === 3) {
      const totalPedidos = await prisma.pedido_servicio.count({ where: { id_usuario: id } });

      // SELECT optimizado para el Familiar (Estados y fechas de finalización)
      const misPedidos = await prisma.$queryRawUnsafe(`
        SELECT 
          ps.id, ps.fecha_del_servicio, ps.id_pedido_estado, 
          ps.fecha_finalizado,
          pac.nombre AS nombre_paciente, pac.apellido AS apellido_paciente
        FROM pedido_servicio ps
        INNER JOIN paciente pac ON ps.id_paciente = pac.id
        WHERE ps.id_usuario = $1
        ORDER BY ps.id DESC
        LIMIT $2 OFFSET $3
      `, id, limit, offset);

      data.kpis = [{ label: 'Servicios Pedidos', value: totalPedidos }];

      data.listado = misPedidos.map(p => ({
        ...p,
        paciente: { nombre: p.nombre_paciente, apellido: p.apellido_paciente }
      }));

      data.pagination.total = totalPedidos;
      data.pagination.totalPages = Math.ceil(totalPedidos / limit);
    }

    // Respuesta única para todos los roles
    res.json(data);

  } catch (error) {
    console.error("ERROR EN DASHBOARD:", error);
    res.status(500).json({ error: "Error al obtener datos", detalle: error.message });
  }
};

module.exports = { getDashboardSummary };