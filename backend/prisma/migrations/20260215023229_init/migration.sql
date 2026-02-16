-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignacion_servico" (
    "id" SERIAL NOT NULL,
    "id_cuidador" INTEGER NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "id_tarea" INTEGER NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_asignado_por" INTEGER,
    "fecha_asignacion" TIMESTAMP(6),

    CONSTRAINT "asignacion_servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidador" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "cbu" VARCHAR(40),
    "cvu" VARCHAR(40),
    "alias" VARCHAR(40),
    "con_documentacion" SMALLINT NOT NULL DEFAULT 0,
    "id_cuidador_estado" INTEGER NOT NULL DEFAULT 1,
    "id_autorizado_por" INTEGER NOT NULL,
    "fecha_autorizado" TIMESTAMP(6),
    "fecha_ingreso" DATE NOT NULL,

    CONSTRAINT "cuidador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidador_estado" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(45),

    CONSTRAINT "cuidador_estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familiar" (
    "id" SERIAL NOT NULL,
    "id_paciente" INTEGER NOT NULL,
    "id_parentesco" INTEGER NOT NULL,

    CONSTRAINT "familiar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardia" (
    "id" SERIAL NOT NULL,
    "id_asignacion" INTEGER,
    "id_paciente" INTEGER,
    "id_cuidador" INTEGER,
    "id_pedido_servicio" INTEGER,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "hora_inicio" TIME(6) NOT NULL,
    "hora_finalizacion" TIME(6) NOT NULL,
    "id_guardia_estado" INTEGER,
    "observaciones" TEXT,

    CONSTRAINT "guardia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardia_estado" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(45) NOT NULL,

    CONSTRAINT "guardia_estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_auditoria" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "accion" VARCHAR(250) NOT NULL,
    "tabla_afectada" VARCHAR(250) NOT NULL,
    "valor_anterior" JSONB,
    "valor_nuevo" JSONB,
    "ip_direccion" VARCHAR(45),

    CONSTRAINT "log_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "id_cuidador" INTEGER NOT NULL,
    "id_guardia" INTEGER NOT NULL,
    "fecha_pago" TIMESTAMP(6),
    "id_pago_autorizo" INTEGER,
    "cantidad_horas" TIME(6),
    "importe_abonado" DOUBLE PRECISION,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parentesco" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(50),

    CONSTRAINT "parentesco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_estado" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(45) NOT NULL,

    CONSTRAINT "pedido_estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_servicio" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_del_servicio" TIMESTAMP(6) NOT NULL,
    "hora_inicio" TIME(6) NOT NULL,
    "cantidad_horas_solicitadas" DOUBLE PRECISION NOT NULL,
    "id_pedido_estado" INTEGER,
    "fecha_finalizado" DATE,
    "observaciones" VARCHAR(1000),

    CONSTRAINT "pedido_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona" (
    "id" SERIAL NOT NULL,
    "apellido" VARCHAR(60) NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "identificacion" VARCHAR(45) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "direccion" VARCHAR(1000) NOT NULL,
    "telefono" VARCHAR(200) NOT NULL,
    "edad" INTEGER NOT NULL,

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(45) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarea" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(60) NOT NULL,
    "valor_hora" DOUBLE PRECISION NOT NULL,
    "moneda" VARCHAR(45),

    CONSTRAINT "tarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "habilitado" SMALLINT NOT NULL DEFAULT 1,
    "password_hash" VARCHAR(500),
    "fecha_alta" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_ultimo_login" TIMESTAMP(6),
    "intentos_login" INTEGER NOT NULL DEFAULT 0,
    "fecha_deshabilitado" TIMESTAMP(6),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persona_email_key" ON "persona"("email");

-- CreateIndex
CREATE INDEX "idx_apellido_nombre" ON "persona"("apellido", "nombre");

-- CreateIndex
CREATE INDEX "idx_email" ON "persona"("email");

-- CreateIndex
CREATE INDEX "idx_usuario_id" ON "usuario"("id");
