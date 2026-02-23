const prisma = require("../config/database");
const { registrarLog } = require('../utils/auditoria');

// --- FUNCIONES DE BASE DE DATOS ---

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

    // --------------------------------------------

    // 1. VALIDACIÓN: ¿Existe el paciente ya?
    const existePaciente = await buscarPacientePorDniDb(tx, identificacion);
    if (existePaciente) throw new Error("PACIENTE_ALREADY_EXISTS");

    // 2. VALIDACIÓN: ¿El familiar existe, está activo y autorizado?
    // Buscamos en la tabla usuario vinculando con persona
    const familiarValido = await tx.usuario.findFirst({
        where: {
            id: id_usuario_familiar,
            id_rol: 3, // Tu "Opción 3" de familiar
            id_usuario_estado: 2 // Activo
        }
    });

    if (!familiarValido) throw new Error("FAMILIAR_NOT_AUTHORIZED");

    // 3. CREAR PACIENTE
    const nuevoPaciente = await tx.paciente.create({
        data: {
            nombre, apellido, identificacion, direccion,
            telefono, edad: parseInt(edad), diagnostico,
            obra_social, nro_afiliado, id_paciente_estado: 1
        }
    });

    // 4. CREAR VÍNCULO EN TABLA FAMILIAR
    const vinculo = await tx.familiar.create({
        data: {
            id_usuario: id_usuario_familiar,
            id_paciente: nuevoPaciente.id,
            id_parentesco: parseInt(id_parentesco)
        }
    });

    // 5. AUDITORÍA
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

// --- ENDPOINT ---

const registrarPaciente = async (req, res, next) => {
    // El id_usuario_familiar usualmente viene del token de sesión (req.user.id)
    // O en este caso, supongamos que lo pasas por el body para pruebas
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

module.exports = { registrarPaciente };