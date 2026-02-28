const { Router } = require('express');
const upload = require('../middlewares/upload');
const {
  subirDocumento,
  listarDocumentosUsuario,
  listarDocumentosPaciente,
  eliminarDocumento,
  listarTiposDocumento,
} = require('../controllers/documento.controllers');

const router = Router();

router.get('/tipos', listarTiposDocumento);
router.post('/subir', upload.single('archivo'), subirDocumento);
router.get('/usuario/:id', listarDocumentosUsuario);
router.get('/paciente/:id', listarDocumentosPaciente);
router.delete('/:id', eliminarDocumento);

module.exports = router;
