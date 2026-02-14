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
    "cuidador_id" INTEGER NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "tarea_id" INTEGER NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "asignado_por" INTEGER,
    "fecha_asignacion" TIMESTAMP(6),

    CONSTRAINT "asignacion_servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidador" (
    "id" SERIAL NOT NULL,
    "cuidador_id" INTEGER NOT NULL,
    "cbu" VARCHAR(40),
    "cvu" VARCHAR(40),
    "alias" VARCHAR(40),
    "con_documentacion" SMALLINT NOT NULL DEFAULT 0,
    "cuidador_estado_id" INTEGER NOT NULL DEFAULT 1,
    "autorizado_por" INTEGER NOT NULL,
    "fecha_autorizado" TIMESTAMP(6),
    "fecha_ingreso" DATE NOT NULL,

    CONSTRAINT "cuidador_pkey" PRIMARY KEY ("id","cuidador_id")
);

-- CreateTable
CREATE TABLE "cuidador_estado" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(45),

    CONSTRAINT "cuidador_estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familiar" (
    "id" INTEGER NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "parentesco_id" INTEGER NOT NULL,

    CONSTRAINT "familiar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardia" (
    "id" SERIAL NOT NULL,
    "asignacion_id" INTEGER,
    "paciente_id" INTEGER,
    "cuidador_id" INTEGER,
    "pedido_servicio_id" INTEGER,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "hora_inicio" TIME(6) NOT NULL,
    "hora_finalizacion" TIME(6) NOT NULL,
    "estado_id" INTEGER,
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
    "usuario_id" INTEGER NOT NULL,
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
    "cuidador_id" INTEGER NOT NULL,
    "guardia_id" INTEGER NOT NULL,
    "fecha_pago" TIMESTAMP(6),
    "pago_autorizo" INTEGER,
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
    "usuario_id" INTEGER NOT NULL,
    "fecha_del_servicio" TIMESTAMP(6) NOT NULL,
    "hora_inicio" TIME(6) NOT NULL,
    "cantidad_horas_solicitadas" DOUBLE PRECISION NOT NULL,
    "estado_pedido_id" INTEGER,
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
    "id" INTEGER NOT NULL,
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
    "id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
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

-- AddForeignKey
ALTER TABLE "asignacion_servico" ADD CONSTRAINT "fk_asignacion_servico_pedido_servicio1" FOREIGN KEY ("pedido_id") REFERENCES "pedido_servicio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_servico" ADD CONSTRAINT "fk_asignacion_servico_tarea1" FOREIGN KEY ("tarea_id") REFERENCES "tarea"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuidador" ADD CONSTRAINT "fk_cuidador_cuidador_estado1" FOREIGN KEY ("cuidador_estado_id") REFERENCES "cuidador_estado"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cuidador" ADD CONSTRAINT "fk_cuidador_usuario1" FOREIGN KEY ("cuidador_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "familiar" ADD CONSTRAINT "fk_familiar_tipo_parentesco1" FOREIGN KEY ("parentesco_id") REFERENCES "parentesco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "fk_guardia_asignacion_servico1" FOREIGN KEY ("asignacion_id") REFERENCES "asignacion_servico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "fk_guardia_guardia_estado1" FOREIGN KEY ("estado_id") REFERENCES "guardia_estado"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "log_auditoria" ADD CONSTRAINT "fk_log_auditoria_usuario1" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "fk_pagos_guardia2" FOREIGN KEY ("guardia_id") REFERENCES "guardia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_servicio" ADD CONSTRAINT "fk_pedido_servicio_pedido_estado1" FOREIGN KEY ("estado_pedido_id") REFERENCES "pedido_estado"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_servicio" ADD CONSTRAINT "fk_pedido_servicio_usuario1" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "persona" ADD CONSTRAINT "fk_persona_usuario1" FOREIGN KEY ("id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("rol_id") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
