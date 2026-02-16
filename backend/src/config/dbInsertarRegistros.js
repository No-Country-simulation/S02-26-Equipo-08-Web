const prisma = require("../config/database");
const { insertarCuidadores } = require("./pre_carga/cuidadores/insert");
const { insertarFamiliares } = require("./pre_carga/familiares/ins");
const { insertarPacientes } = require("./pre_carga/pacientes/ins");
const { insertarUsuarios } = require("./pre_carga/usuarios/insert");
const { insertarPersonas } = require("./pre_carga/persona/ins");
const { insertarPedidosServicios } = require("./pre_carga/pedido_servicio/ins");
const { insertarTareas } = require("./pre_carga/tarea/ins");
const { insertarAsignaciones } = require("./pre_carga/asignacion_servicio/ins");
const { insertarGuardias } = require("./pre_carga/guardia/ins");
const { insertarPagos } = require("./pre_carga/pagos/ins");

const preCargarRoles = async () =>{

    const rol_db = await prisma.rol.findFirst()

    if (rol_db != null){
        return
    }

    const roles = [
        {id: 1, descripcion: 'Admin'},
        {id: 2, descripcion: 'Cuidador'},
        {id: 3, descripcion: 'Familiar'}
    ]

        for await (const rol of roles) {
        const rol_ins = prisma.rol.create({
            data: {
                id: rol.id,
                descripcion: rol.descripcion
            }
        })

        console.log(`ROL INS: ${rol_ins}`);
    }

}

async function preCargarParentezcos() {
    const parentesco_db = await prisma.parentesco.findFirst()

    if (parentesco_db != null){
        return
    }
    const parentescos = [
        {id:1, descripcion: 'Madre'},
        {id:2, descripcion: 'Padre'},
        {id:3, descripcion: 'Hijo/a'},
        {id:4, descripcion: 'Hermano/a'},
        {id:5, descripcion: 'Conyugue'},
        {id:6, descripcion: 'Tutor/a'},
    ]

    for await(const parentesco of parentescos){
        const parentesco_ins = await prisma.parentesco.create({
            data:{
                id: parentesco.id,
                descripcion: parentesco.descripcion
            }
        })

        console.log(`PARENTESCO INS: ${parentesco}: ${parentesco_ins}`);
    }
}

async function preCargarEstadosPedidos() {
    const estadosDb = await prisma.pedido_estado.findFirst()

    if(estadosDb != null){
        return
    }

    const estados = [
        {id: 1, descripcion: 'Pendiente'},
        {id: 2, descripcion: 'Aprobado'},
        {id: 3, descripcion: 'Asignado'},
        {id: 4, descripcion: 'En curso'},
        {id: 5, descripcion: 'Finalizado'},
        {id: 6, descripcion: 'Cancelado'},
    ]

    for await(const estado of estados){
        const estado_ins = await prisma.pedido_estado.create({
            data:{
                id: estado.id,
                descripcion: estado.descripcion
            }
        })

        console.log(`PEDIDO ESTADO INS: ${estado_ins}`);
    }
}

async function preCargarEstadosGuardia() {
    const estadoDb = await prisma.guardia_estado.findFirst()

    if(estadoDb != null){
        return
    }

    const estados = [
        {id: 1, descripcion: 'Programada'},
        {id: 2, descripcion: 'En curso'},
        {id: 3, descripcion: 'Finalizada'},
        {id: 4, descripcion: 'Cancelada'},
    ]

    for await(const estado of estados){
        const estado_ins = await prisma.guardia_estado.create({
            data:{
                id: estado.id,
                descripcion: estado.descripcion
            }
        })

        console.log(`GUARDIA ESTADO INS: ${estado_ins}`);
    }
}

const insertarDatosPreCargados = async () => {
    preCargarRoles()
    preCargarParentezcos()
    preCargarEstadosPedidos()
    preCargarEstadosGuardia()
    insertarUsuarios()
    insertarPersonas()
    insertarCuidadores()
    insertarFamiliares()
    insertarPacientes()
    insertarTareas()
    insertarPedidosServicios()
    insertarAsignaciones()
    insertarGuardias()
    insertarPagos()
}

module.exports = {insertarDatosPreCargados}
