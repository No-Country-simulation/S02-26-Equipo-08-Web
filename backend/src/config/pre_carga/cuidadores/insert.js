const prisma = require('../../database');
const { cuidadores } = require('./cuidadores');

const insertarCuidadores = async () => {
    const cuidadorExistente = await prisma.cuidador.findFirst();
    if (cuidadorExistente != null) return;

    for (const cuidador of cuidadores) {
        await insertarCuidador(cuidador);
    }
};

async function insertarCuidador(cuidador) {
    const {
        email,
        cbu,
        cvu,
        alias,
        con_documentacion,
        id_autorizado_por,
        fecha_autorizado,
        fecha_ingreso,
    } = cuidador;

    // Buscar el id_usuario real por email para no depender de IDs hardcodeados
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
        console.warn(`CUIDADOR INS: usuario con email ${email} no encontrado, se omite.`);
        return;
    }

    const cuidador_ins = await prisma.cuidador.create({
        data: {
            id_usuario: usuario.id,
            cbu,
            cvu,
            alias,
            con_documentacion,
            id_autorizado_por,
            fecha_autorizado,
            fecha_ingreso,
        },
    });

    console.log(`CUIDADOR INS: ${cuidador_ins.id} → ${email} (id_usuario=${usuario.id})`);
}

module.exports = { insertarCuidadores };
