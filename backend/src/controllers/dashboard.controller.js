const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardSummary = async (req, res) => {
  const { id, role } = req.user;
  const busqueda = req.query.search || ""; 
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    let data = {
      kpis: [],
      listado: [],
      pagination: { total: 0, page, limit, totalPages: 0 }
    };

    // Convertimos la búsqueda a minúsculas para comparar correctamente
    const searchFilter = `%${busqueda.toLowerCase()}%`;

    // --- 1. ADMINISTRADOR ---
    if (role === 1) {
      const [countU, countP] = await Promise.all([
        prisma.usuario.count(), 
        prisma.paciente.count()
      ]);
      
      data.kpis = [
        { label: 'Total Usuarios', value: countU },
        { label: 'Pacientes Activos', value: countP }
      ];

      // Usamos LOWER() en las columnas para que ignore mayúsculas
      const usuarios = await prisma.$queryRawUnsafe(`
        SELECT u.id, u.email, r.descripcion AS rol, p.nombre, p.apellido, u.fecha_alta, ue.descripcion AS usuario_estado_descripcion
        FROM usuario u
        LEFT JOIN persona p ON p.id_usuario = u.id
        LEFT JOIN rol r ON r.id = u.id_rol
        LEFT JOIN usuario_estado ue ON ue.id = u.id_usuario_estado
        WHERE (LOWER(p.nombre) LIKE $3 OR LOWER(p.apellido) LIKE $3 OR LOWER(u.email) LIKE $3)
        ORDER BY u.id DESC LIMIT $1 OFFSET $2
      `, limit, offset, searchFilter);

      data.listado = usuarios.map(u => ({
        id: u.id,
        nombre: u.nombre || "Sin nombre",
        apellido: u.apellido || "",
        rol: u.rol,
        fecha: u.fecha_alta,
        estado: u.usuario_estado_descripcion
      }));

      const countResult = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as total FROM usuario u 
        LEFT JOIN persona p ON p.id_usuario = u.id
        WHERE (LOWER(p.nombre) LIKE $1 OR LOWER(p.apellido) LIKE $1 OR LOWER(u.email) LIKE $1)
      `, searchFilter);
      
      const count = Number(countResult[0].total);
      data.pagination.total = count;
      data.pagination.totalPages = Math.ceil(count / limit);

    // --- 2. CUIDADOR ---
    } else if (role === 2) {
      const idUsuarioLogueado = Number(id); 

      const misGuardias = await prisma.$queryRawUnsafe(`
        SELECT ps.id, ps.fecha_del_servicio, ps.hora_inicio,
               pac.nombre AS p_nom, pac.apellido AS p_ape,
               t.descripcion AS tarea_nombre, pe.descripcion AS pedido_estado_nombre
        FROM asignacion_servico asig
        LEFT JOIN pedido_servicio ps ON asig.id_pedido = ps.id
        LEFT JOIN paciente pac ON asig.id_paciente = pac.id
        LEFT JOIN tarea t ON asig.id_tarea = t.id
        LEFT JOIN pedido_estado pe ON pe.id = ps.id_pedido_estado
        WHERE asig.id_cuidador = $1 
          AND (LOWER(pac.nombre) LIKE $4 OR LOWER(pac.apellido) LIKE $4)
        ORDER BY ps.fecha_del_servicio DESC LIMIT $2 OFFSET $3
      `, idUsuarioLogueado, limit, offset, searchFilter);

      data.kpis = [{ label: 'Mis Guardias', value: misGuardias.length }];
      
      data.listado = misGuardias.map(g => ({
        id: g.id,
        nombre: g.p_nom,
        apellido: g.p_ape,
        informacion_adicional: g.tarea_nombre || "Cuidado Domiciliario",
        fecha: g.fecha_del_servicio,
        estado: g.pedido_estado_nombre,
        paciente: { nombre: g.p_nom, apellido: g.p_ape }
      }));

      const countResult = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as total FROM asignacion_servico asig
        LEFT JOIN paciente pac ON asig.id_paciente = pac.id
        WHERE asig.id_cuidador = $1 AND (LOWER(pac.nombre) LIKE $2 OR LOWER(pac.apellido) LIKE $2)
      `, idUsuarioLogueado, searchFilter);

      const total = Number(countResult[0].total);
      data.pagination.total = total;
      data.pagination.totalPages = Math.ceil(total / limit);

    // --- 3. FAMILIAR ---
    } else if (role === 3) {
      const pedidos = await prisma.$queryRawUnsafe(`
        SELECT ps.id AS numero_servicio, ps.fecha_del_servicio, 
               pac.nombre AS p_nom, pac.apellido AS p_ape,
               pe.descripcion AS pedido_estado_descripcion, ps.observaciones
        FROM pedido_servicio ps
        INNER JOIN paciente pac ON ps.id_paciente = pac.id
        INNER JOIN pedido_estado pe ON pe.id = ps.id_pedido_estado
        WHERE ps.id_usuario = $1 AND (LOWER(pac.nombre) LIKE $4 OR LOWER(pac.apellido) LIKE $4)
        ORDER BY ps.id DESC LIMIT $2 OFFSET $3
      `, id, limit, offset, searchFilter);

      data.listado = pedidos.map(p => ({
        id: p.numero_servicio,
        nombre: p.p_nom,
        apellido: p.p_ape,
        fecha: p.fecha_del_servicio,
        estado: p.pedido_estado_descripcion,
        informacion_adicional: p.observaciones || ""
      }));

      data.pagination.total = pedidos.length;
      data.pagination.totalPages = Math.ceil(pedidos.length / limit);
    }

    res.json(data);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = { getDashboardSummary };