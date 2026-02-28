const prisma = require('../../database');

const insertarTiposDocumento = async () => {
  const existente = await prisma.tipo_documento.findFirst();
  if (existente != null) return;

  const tipos = [
    { id: 1, descripcion: 'DNI – Frente',                   aplica_a: 'cuidador', obligatorio: true  },
    { id: 2, descripcion: 'DNI – Dorso',                    aplica_a: 'cuidador', obligatorio: true  },
    { id: 3, descripcion: 'Constancia inscripción fiscal',   aplica_a: 'cuidador', obligatorio: false },
    { id: 4, descripcion: 'Constancia bancaria (CBU/CVU)',  aplica_a: 'cuidador', obligatorio: false },
    { id: 5, descripcion: 'Cert. antecedentes penales',     aplica_a: 'cuidador', obligatorio: true  },
    { id: 6, descripcion: 'DNI del familiar',               aplica_a: 'familiar', obligatorio: true  },
    { id: 7, descripcion: 'DNI del paciente',               aplica_a: 'paciente', obligatorio: true  },
    { id: 8, descripcion: 'Documento de vínculo',           aplica_a: 'paciente', obligatorio: false },
    { id: 9, descripcion: 'Historia clínica',               aplica_a: 'paciente', obligatorio: false },
  ];

  for (const tipo of tipos) {
    await prisma.tipo_documento.create({ data: tipo });
    console.log(`TIPO_DOC INS: ${tipo.id} - ${tipo.descripcion}`);
  }
};

module.exports = { insertarTiposDocumento };
