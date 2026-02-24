const prisma = require('../../database')
const {tareas} = require('./tareas')

async function insertarTareas() {
    const tareaDb = await prisma.tarea.findFirst()

    if(tareaDb != null){
        return
    }

    tareas.forEach(tarea => {
        insertarTarea(tarea)
    });
}

async function insertarTarea(tarea) {
    const {
        descripcion,
        valor_hora,
        moneda,
    } = tarea

    const tareaIns = await prisma.tarea.create({
        data:{
            descripcion: descripcion,
            valor_hora: valor_hora,
            moneda: moneda,
        }
    })

    console.log(`TAREA INS: ${tareaIns}`);
}

module.exports = {insertarTareas}
