const prisma = require("../config/database");
const { registrarLog } = require('../utils/auditoria');

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

// --- FUNCIONES TRANSACCIONALES (con auditoría) ---

async function buscarPacientePorDniDb(tx, identificacion) {
    const client = tx || prisma;
    return await client.paciente.findFirst({ where: { identificacion: identificacion } });
}

async function altaPacienteTransaccional(tx, datos, id_usuario_familiar, req) {
    const {
        nombre, apellido, identificacion, direccion,
        telefono, edad, diagnostico, obra_social,
        nro_afiliado, id_parentesco
    } = datos;

    // ---- Validaciones campos vacios ------------
    if (!nombre || nombre.trim() === "") throw new Error("VALIDATION_NOMBRE_EMPTY");
    if (!apellido || apellido.trim() === "") throw new Error("VALIDATION_APELLIDO_EMPTY");
    if (!obra_social || obra_social.trim() === "") throw new Error("VALIDATION_OBRASOCIAL_EMPTY");
    if (!nro_afiliado || nro_afiliado.trim() === "") throw new Error("VALIDATION_AFILIADO_EMPTY");
    if (!identificacion || identificacion.trim() === "") throw new Error("VALIDATION_IDENTIFICACION_EMPTY");
    if (!direccion || direccion.trim() === "") throw new Error("VALIDATION_DIRECCION_EMPTY")
    if (!telefono || telefono.trim() === "") throw new Error("VALIDATION_TELEFONO_EMPTY");
    if (!diagnostico || diagnostico.trim() === "") throw new Error("VALIDATION_DIAGNOSTICO_EMPTY");
    if (edad === undefined || edad === null || edad === "") {
        throw new Error("VALIDATION_EDAD_EMPTY");
    }
    const edadNumerica = parseInt(edad);
    if (isNaN(edadNumerica) || edadNumerica <= 0) {
        throw new Error("VALIDATION_EDAD_INVALID");
    }

    const existePaciente = await buscarPacientePorDniDb(tx, identificacion);
    if (existePaciente) throw new Error("PACIENTE_ALREADY_EXISTS");

    const familiarValido = await tx.usuario.findFirst({
        where: {
            id: id_usuario_familiar,
            id_rol: 3,
            id_usuario_estado: 2
        }
    });
    if (!familiarValido) throw new Error("FAMILIAR_NOT_AUTHORIZED");

    const nuevoPaciente = await tx.paciente.create({
        data: {
            nombre, apellido, identificacion, direccion,
            telefono, edad: parseInt(edad), diagnostico,
            obra_social, nro_afiliado, id_paciente_estado: 1
        }
    });

    const vinculo = await tx.familiar.create({
        data: {
            id_usuario: id_usuario_familiar,
            id_paciente: nuevoPaciente.id,
            id_parentesco: parseInt(id_parentesco)
        }
    });

    await registrarLog({
        tx,
        id_usuario: id_usuario_familiar,
        accion: 'ALTA_PACIENTE_A_CARGO',
        tabla: 'paciente / familiar',
        detalles: {
            paciente_id: nuevoPaciente.id,
            paciente_dni: identificacion,
            parentesco: id_parentesco
        },
        req: req
    });

    return { nuevoPaciente, vinculo };
}

const registrarPaciente = async (req, res, next) => {
    const { id_usuario_familiar } = req.body;

    try {
        const resultado = await prisma.$transaction(async (tx) => {
            return await altaPacienteTransaccional(tx, req.body, id_usuario_familiar, req);
        });

        res.status(201).json({
            success: true,
            message: "Paciente dado de alta y vinculado con éxito",
            data: resultado
        });

    } catch (error) {
        const errorMap = {
            "PACIENTE_ALREADY_EXISTS": "El paciente ya se encuentra registrado.",
            "FAMILIAR_NOT_AUTHORIZED": "El familiar no existe o no tiene permisos para dar de alta."
        };

        const msg = errorMap[error.message];
        if (msg) return res.status(400).json({ success: false, message: msg });

        console.error("Error en alta paciente:", error);
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

        const vinculo = await prisma.familiar.findFirst({
            where: { id_usuario: idUsuario, id_paciente: id },
        });
        if (!vinculo) {
            return res.status(403).json({ success: false, message: "No tenés vínculo con este paciente." });
        }

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
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente,
    listarParentescos,
};
