/*
  Warnings:

  - You are about to drop the column `habilitado` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_usuario]` on the table `cuidador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_usuario]` on the table `persona` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_usuario` to the `familiar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_paciente` to the `pedido_servicio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "familiar" ADD COLUMN     "id_usuario" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pedido_servicio" ADD COLUMN     "id_paciente" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "habilitado",
ADD COLUMN     "activo" SMALLINT NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "paciente" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "apellido" VARCHAR(60) NOT NULL,
    "identificacion" VARCHAR(45) NOT NULL,
    "direccion" VARCHAR(1000),
    "telefono" VARCHAR(200),
    "edad" INTEGER,
    "diagnostico" VARCHAR(500),
    "obra_social" VARCHAR(100),
    "nro_afiliado" VARCHAR(50),
    "fecha_ingreso" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cuidador_id_usuario_key" ON "cuidador"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "persona_id_usuario_key" ON "persona"("id_usuario");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona" ADD CONSTRAINT "persona_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familiar" ADD CONSTRAINT "familiar_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familiar" ADD CONSTRAINT "familiar_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familiar" ADD CONSTRAINT "familiar_id_parentesco_fkey" FOREIGN KEY ("id_parentesco") REFERENCES "parentesco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidador" ADD CONSTRAINT "cuidador_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidador" ADD CONSTRAINT "cuidador_id_autorizado_por_fkey" FOREIGN KEY ("id_autorizado_por") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidador" ADD CONSTRAINT "cuidador_id_cuidador_estado_fkey" FOREIGN KEY ("id_cuidador_estado") REFERENCES "cuidador_estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_servicio" ADD CONSTRAINT "pedido_servicio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_servicio" ADD CONSTRAINT "pedido_servicio_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_servicio" ADD CONSTRAINT "pedido_servicio_id_pedido_estado_fkey" FOREIGN KEY ("id_pedido_estado") REFERENCES "pedido_estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_servico" ADD CONSTRAINT "asignacion_servico_id_cuidador_fkey" FOREIGN KEY ("id_cuidador") REFERENCES "cuidador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_servico" ADD CONSTRAINT "asignacion_servico_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_servico" ADD CONSTRAINT "asignacion_servico_id_tarea_fkey" FOREIGN KEY ("id_tarea") REFERENCES "tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_servico" ADD CONSTRAINT "asignacion_servico_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido_servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_servico" ADD CONSTRAINT "asignacion_servico_id_asignado_por_fkey" FOREIGN KEY ("id_asignado_por") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "guardia_id_asignacion_fkey" FOREIGN KEY ("id_asignacion") REFERENCES "asignacion_servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "guardia_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "guardia_id_cuidador_fkey" FOREIGN KEY ("id_cuidador") REFERENCES "cuidador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "guardia_id_pedido_servicio_fkey" FOREIGN KEY ("id_pedido_servicio") REFERENCES "pedido_servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "guardia_id_guardia_estado_fkey" FOREIGN KEY ("id_guardia_estado") REFERENCES "guardia_estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_cuidador_fkey" FOREIGN KEY ("id_cuidador") REFERENCES "cuidador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_guardia_fkey" FOREIGN KEY ("id_guardia") REFERENCES "guardia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_pago_autorizo_fkey" FOREIGN KEY ("id_pago_autorizo") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_auditoria" ADD CONSTRAINT "log_auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
