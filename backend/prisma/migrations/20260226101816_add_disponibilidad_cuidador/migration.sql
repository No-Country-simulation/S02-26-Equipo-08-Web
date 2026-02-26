-- CreateTable
CREATE TABLE "disponibilidad_cuidador" (
    "id" SERIAL NOT NULL,
    "id_cuidador" INTEGER NOT NULL,
    "dia_semana" SMALLINT NOT NULL,
    "hora_inicio" TIME(6) NOT NULL,
    "hora_fin" TIME(6) NOT NULL,

    CONSTRAINT "disponibilidad_cuidador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "disponibilidad_cuidador_id_cuidador_idx" ON "disponibilidad_cuidador"("id_cuidador");

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidad_cuidador_id_cuidador_dia_semana_key" ON "disponibilidad_cuidador"("id_cuidador", "dia_semana");
