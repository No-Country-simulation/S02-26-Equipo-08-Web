const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');

const subirDocumento = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, data: null, message: 'No se recibió ningún archivo' });
    }

    const { id_tipo_documento, id_usuario, id_paciente, subido_por } = req.body;

    if (!id_tipo_documento || !subido_por) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, data: null, message: 'id_tipo_documento y subido_por son obligatorios' });
    }

    const tieneUsuario = id_usuario != null && id_usuario !== '';
    const tienePaciente = id_paciente != null && id_paciente !== '';

    if (tieneUsuario && tienePaciente) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, data: null, message: 'Debe indicar id_usuario o id_paciente, no ambos' });
    }

    if (!tieneUsuario && !tienePaciente) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, data: null, message: 'Debe indicar id_usuario o id_paciente' });
    }

    const tipoDoc = await prisma.tipo_documento.findUnique({
      where: { id: parseInt(id_tipo_documento) }
    });

    if (!tipoDoc) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ success: false, data: null, message: 'Tipo de documento no encontrado' });
    }

    // Buscar si ya existe un doc del mismo tipo para ese usuario/paciente
    const whereExistente = { id_tipo_documento: parseInt(id_tipo_documento) };
    if (tieneUsuario) whereExistente.id_usuario = parseInt(id_usuario);
    else whereExistente.id_paciente = parseInt(id_paciente);

    const docExistente = await prisma.documento.findFirst({ where: whereExistente });

    if (docExistente) {
      // Eliminar archivo viejo del disco
      const rutaVieja = path.join(__dirname, '..', '..', docExistente.ruta_archivo);
      fs.unlink(rutaVieja, () => {});
      await prisma.documento.delete({ where: { id: docExistente.id } });
    }

    const rutaRelativa = `uploads/documentos/${req.file.filename}`;

    const nuevoDoc = await prisma.documento.create({
      data: {
        id_tipo_documento: parseInt(id_tipo_documento),
        id_usuario: tieneUsuario ? parseInt(id_usuario) : null,
        id_paciente: tienePaciente ? parseInt(id_paciente) : null,
        subido_por: parseInt(subido_por),
        nombre_archivo: req.file.originalname,
        nombre_guardado: req.file.filename,
        ruta_archivo: rutaRelativa,
        mime_type: req.file.mimetype,
        tamanio_bytes: req.file.size,
      }
    });

    // Si el doc es de cuidador, actualizar con_documentacion
    if (tieneUsuario && tipoDoc.aplica_a === 'cuidador') {
      await recalcularDocumentacionCuidador(parseInt(id_usuario));
    }

    return res.status(201).json({ success: true, data: nuevoDoc, message: 'Documento subido correctamente' });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(error);
  }
};

const listarDocumentosUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    const documentos = await prisma.documento.findMany({
      where: { id_usuario: parseInt(id) },
      orderBy: { fecha_subida: 'desc' }
    });

    const ids = documentos.map(d => d.id_tipo_documento);
    const tipos = await prisma.tipo_documento.findMany({ where: { id: { in: ids } } });
    const tiposMap = Object.fromEntries(tipos.map(t => [t.id, t]));

    const resultado = documentos.map(d => ({
      ...d,
      tipo_documento: tiposMap[d.id_tipo_documento] || null
    }));

    return res.json({ success: true, data: resultado, message: 'OK' });
  } catch (error) {
    next(error);
  }
};

const listarDocumentosPaciente = async (req, res, next) => {
  try {
    const { id } = req.params;

    const documentos = await prisma.documento.findMany({
      where: { id_paciente: parseInt(id) },
      orderBy: { fecha_subida: 'desc' }
    });

    const ids = documentos.map(d => d.id_tipo_documento);
    const tipos = await prisma.tipo_documento.findMany({ where: { id: { in: ids } } });
    const tiposMap = Object.fromEntries(tipos.map(t => [t.id, t]));

    const resultado = documentos.map(d => ({
      ...d,
      tipo_documento: tiposMap[d.id_tipo_documento] || null
    }));

    return res.json({ success: true, data: resultado, message: 'OK' });
  } catch (error) {
    next(error);
  }
};

const eliminarDocumento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await prisma.documento.findUnique({ where: { id: parseInt(id) } });

    if (!doc) {
      return res.status(404).json({ success: false, data: null, message: 'Documento no encontrado' });
    }

    const tipoDoc = await prisma.tipo_documento.findUnique({ where: { id: doc.id_tipo_documento } });

    const rutaArchivo = path.join(__dirname, '..', '..', doc.ruta_archivo);
    fs.unlink(rutaArchivo, () => {});

    await prisma.documento.delete({ where: { id: parseInt(id) } });

    // Si era doc de cuidador, recalcular con_documentacion
    if (doc.id_usuario && tipoDoc?.aplica_a === 'cuidador') {
      await recalcularDocumentacionCuidador(doc.id_usuario);
    }

    return res.json({ success: true, data: null, message: 'Documento eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

const listarTiposDocumento = async (req, res, next) => {
  try {
    const { aplica_a } = req.query;
    const where = aplica_a ? { aplica_a } : {};
    const tipos = await prisma.tipo_documento.findMany({ where });
    return res.json({ success: true, data: tipos, message: 'OK' });
  } catch (error) {
    next(error);
  }
};

// Recalcula el flag con_documentacion del cuidador según sus docs obligatorios
async function recalcularDocumentacionCuidador(id_usuario) {
  const tiposObligatoriosCuidador = await prisma.tipo_documento.findMany({
    where: { aplica_a: 'cuidador', obligatorio: true }
  });

  const docsObligatorios = await prisma.documento.findMany({
    where: {
      id_usuario,
      id_tipo_documento: { in: tiposObligatoriosCuidador.map(t => t.id) }
    }
  });

  const tieneTodos = docsObligatorios.length >= tiposObligatoriosCuidador.length;

  await prisma.cuidador.updateMany({
    where: { id_usuario },
    data: { con_documentacion: tieneTodos ? 1 : 0 }
  });
}

module.exports = {
  subirDocumento,
  listarDocumentosUsuario,
  listarDocumentosPaciente,
  eliminarDocumento,
  listarTiposDocumento,
};
