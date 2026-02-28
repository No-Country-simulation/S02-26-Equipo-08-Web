-- CreateTable
CREATE TABLE "tipo_documento" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "aplica_a" VARCHAR(20) NOT NULL,
    "obligatorio" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tipo_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento" (
    "id" SERIAL NOT NULL,
    "id_tipo_documento" INTEGER NOT NULL,
    "id_usuario" INTEGER,
    "id_paciente" INTEGER,
    "subido_por" INTEGER NOT NULL,
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "nombre_guardado" VARCHAR(255) NOT NULL,
    "ruta_archivo" VARCHAR(500) NOT NULL,
    "mime_type" VARCHAR(100),
    "tamanio_bytes" INTEGER,
    "fecha_subida" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documento_pkey" PRIMARY KEY ("id")
);
