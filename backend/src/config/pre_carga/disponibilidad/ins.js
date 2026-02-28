const prisma = require('../../database');
const { disponibilidades } = require('./disponibilidades');

const insertarDisponibilidades = async () => {
    const existente = await prisma.disponibilidad_cuidador.findFirst();
    if (existente != null) return;

    for (const disp of disponibilidades) {
        const usuario = await prisma.usuario.findUnique({ where: { email: disp.email } });
        if (!usuario) {
            console.warn(`DISPONIBILIDAD INS: usuario ${disp.email} no encontrado, se omite.`);
            continue;
        }

        const cuidador = await prisma.cuidador.findFirst({ where: { id_usuario: usuario.id } });
        if (!cuidador) {
            console.warn(`DISPONIBILIDAD INS: cuidador para ${disp.email} no encontrado, se omite.`);
            continue;
        }

        await prisma.disponibilidad_cuidador.upsert({
            where: { id_cuidador_dia_semana: { id_cuidador: cuidador.id, dia_semana: disp.dia_semana } },
            update: { hora_inicio: disp.hora_inicio, hora_fin: disp.hora_fin },
            create: {
                id_cuidador: cuidador.id,
                dia_semana: disp.dia_semana,
                hora_inicio: disp.hora_inicio,
                hora_fin: disp.hora_fin,
            },
        });

        console.log(`DISPONIBILIDAD INS: cuidador ${cuidador.id} (${disp.email}) dia=${disp.dia_semana}`);
    }
};

module.exports = { insertarDisponibilidades };
