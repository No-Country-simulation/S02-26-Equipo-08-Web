const prisma = require("../config/database");

// listar pacientes vinculados a un familiar (por id_usuario del familiar)
const listarPacientesPorFamiliar = async (req, res, next) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);

        if (isNaN(idUsuario)) {
            return res.status(400).json({ success: false, message: "ID de usuario inválido." });
        }

        const pacientes = await prisma.$queryRawUnsafe(`
            SELECT
                p.id,
                p.nombre,
                p.apellido,
                p.identificacion,
                p.direccion,
                p.telefono,
                p.edad,
                p.diagnostico,
                p.obra_social,
                p.nro_afiliado,
                p.fecha_ingreso,
                pe.descripcion AS estado,
                f.id_parentesco,
                par.descripcion AS parentesco
            FROM familiar f
            JOIN paciente p ON p.id = f.id_paciente
            LEFT JOIN paciente_estado pe ON pe.id = p.id_paciente_estado
            LEFT JOIN parentesco par ON par.id = f.id_parentesco
            WHERE f.id_usuario = $1
            ORDER BY p.id DESC
        `, idUsuario);

        return res.status(200).json({
            success: true,
            data: pacientes,
            total: pacientes.length,
            message: "Pacientes encontrados.",
        });
    } catch (error) {
        console.error("listarPacientesPorFamiliar error:", error);
        next(error);
    }
};

// obtener detalle de un paciente por id
const obtenerPaciente = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID inválido." });
        }

        const resultado = await prisma.$queryRawUnsafe(`
            SELECT
                p.id,
                p.nombre,
                p.apellido,
                p.identificacion,
                p.direccion,
                p.telefono,
                p.edad,
                p.diagnostico,
                p.obra_social,
                p.nro_afiliado,
                p.fecha_ingreso,
                pe.descripcion AS estado
            FROM paciente p
            LEFT JOIN paciente_estado pe ON pe.id = p.id_paciente_estado
            WHERE p.id = $1
        `, id);

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({ success: false, message: "Paciente no encontrado." });
        }

        return res.status(200).json({
            success: true,
            data: resultado[0],
            message: "Paciente encontrado.",
        });
    } catch (error) {
        console.error("obtenerPaciente error:", error);
        next(error);
    }
};

// crear paciente y vincularlo a un familiar
const crearPaciente = async (req, res, next) => {
    try {
        const {
            nombre,
            apellido,
            identificacion,
            direccion,
            telefono,
            edad,
            diagnostico,
            obra_social,
            nro_afiliado,
            id_usuario_familiar,
            id_parentesco,
        } = req.body;

        if (!nombre || !apellido || !identificacion || !id_usuario_familiar) {
            return res.status(400).json({
                success: false,
                message: "Nombre, apellido, identificación e id_usuario_familiar son obligatorios.",
            });
        }

        // verificar que el usuario familiar existe
        const familiarExiste = await prisma.usuario.findUnique({
            where: { id: parseInt(id_usuario_familiar) },
        });
        if (!familiarExiste || familiarExiste.id_rol !== 3) {
            return res.status(400).json({
                success: false,
                message: "El usuario familiar no existe o no tiene rol de familiar.",
            });
        }

        // verificar DNI único para este familiar
        const dniDuplicado = await prisma.$queryRawUnsafe(`
            SELECT p.id FROM familiar f
            JOIN paciente p ON p.id = f.id_paciente
            WHERE f.id_usuario = $1 AND p.identificacion = $2
        `, parseInt(id_usuario_familiar), identificacion);
        if (dniDuplicado && dniDuplicado.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Ya tenés un paciente registrado con ese DNI.",
            });
        }

        // transaccion: crear paciente + vincular familiar
        const resultado = await prisma.$transaction(async (tx) => {
            const paciente = await tx.paciente.create({
                data: {
                    nombre,
                    apellido,
                    identificacion,
                    direccion: direccion || null,
                    telefono: telefono || null,
                    edad: edad ? parseInt(edad) : null,
                    diagnostico: diagnostico || null,
                    obra_social: obra_social || null,
                    nro_afiliado: nro_afiliado || null,
                    id_paciente_estado: 1,
                },
            });

            const familiar = await tx.familiar.create({
                data: {
                    id_usuario: parseInt(id_usuario_familiar),
                    id_paciente: paciente.id,
                    id_parentesco: id_parentesco ? parseInt(id_parentesco) : 1,
                },
            });

            return { paciente, familiar };
        });

        return res.status(201).json({
            success: true,
            data: resultado,
            message: "Paciente creado y vinculado.",
        });
    } catch (error) {
        console.error("crearPaciente error:", error);
        next(error);
    }
};

// actualizar datos de un paciente
const actualizarPaciente = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID inválido." });
        }

        const {
            nombre,
            apellido,
            identificacion,
            direccion,
            telefono,
            edad,
            diagnostico,
            obra_social,
            nro_afiliado,
        } = req.body;

        const pacienteActualizado = await prisma.paciente.update({
            where: { id },
            data: {
                ...(nombre && { nombre }),
                ...(apellido && { apellido }),
                ...(identificacion && { identificacion }),
                ...(direccion !== undefined && { direccion }),
                ...(telefono !== undefined && { telefono }),
                ...(edad !== undefined && { edad: edad ? parseInt(edad) : null }),
                ...(diagnostico !== undefined && { diagnostico }),
                ...(obra_social !== undefined && { obra_social }),
                ...(nro_afiliado !== undefined && { nro_afiliado }),
            },
        });

        return res.status(200).json({
            success: true,
            data: pacienteActualizado,
            message: "Paciente actualizado.",
        });
    } catch (error) {
        console.error("actualizarPaciente error:", error);
        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "Paciente no encontrado." });
        }
        next(error);
    }
};

// eliminar paciente (solo si no tiene solicitudes activas)
const eliminarPaciente = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const idUsuario = parseInt(req.params.idUsuario);
        if (isNaN(id) || isNaN(idUsuario)) {
            return res.status(400).json({ success: false, message: "IDs inválidos." });
        }

        // verificar vínculo familiar-paciente
        const vinculo = await prisma.familiar.findFirst({
            where: { id_usuario: idUsuario, id_paciente: id },
        });
        if (!vinculo) {
            return res.status(403).json({ success: false, message: "No tenés vínculo con este paciente." });
        }

        // verificar solicitudes activas (estado != 4 = Cancelado)
        const solicitudesActivas = await prisma.pedido_servicio.findMany({
            where: {
                id_paciente: id,
                NOT: { id_pedido_estado: 4 },
            },
        });
        if (solicitudesActivas.length > 0) {
            return res.status(400).json({
                success: false,
                message: "No se puede eliminar: el paciente tiene solicitudes activas.",
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.familiar.deleteMany({ where: { id_paciente: id } });
            await tx.paciente.delete({ where: { id } });
        });

        return res.status(200).json({ success: true, message: "Paciente eliminado." });
    } catch (error) {
        console.error("eliminarPaciente error:", error);
        next(error);
    }
};

// listar parentescos disponibles
const listarParentescos = async (req, res, next) => {
    try {
        const parentescos = await prisma.parentesco.findMany({
            orderBy: { id: "asc" },
        });

        return res.status(200).json({
            success: true,
            data: parentescos,
            message: "Parentescos encontrados.",
        });
    } catch (error) {
        console.error("listarParentescos error:", error);
        next(error);
    }
};

module.exports = {
    listarPacientesPorFamiliar,
    obtenerPaciente,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    listarParentescos,
};
