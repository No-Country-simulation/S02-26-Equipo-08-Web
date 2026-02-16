const prisma = require('../../database')
const {pacientes} = require('./pacientes')

async function insertarPacientes() {
    const pacienteDb = await prisma.paciente.findFirst()

    if(pacienteDb != null){
        return
    }

    pacientes.forEach(paciente => {
        insertarPaciente(paciente)
    });
}

async function insertarPaciente(paciente) {
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
        fecha_ingreso,
        activo,
    } = paciente

    const pacienteIns = await prisma.paciente.create({
        data:{
            nombre: nombre,
            apellido: apellido,
            identificacion: identificacion,
            direccion: direccion,
            telefono: telefono,
            edad: edad,
            diagnostico: diagnostico,
            obra_social: obra_social,
            nro_afiliado: nro_afiliado,
            fecha_ingreso: fecha_ingreso,
            activo: activo,
        }
    })

    console.log(`PACIENTES INS: ${pacienteIns}`);
}

module.exports = {insertarPacientes}