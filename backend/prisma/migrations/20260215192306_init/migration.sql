-- DropForeignKey
ALTER TABLE "asignacion_servico" DROP CONSTRAINT "asignacion_servico_id_asignado_por_fkey";

-- DropForeignKey
ALTER TABLE "asignacion_servico" DROP CONSTRAINT "asignacion_servico_id_cuidador_fkey";

-- DropForeignKey
ALTER TABLE "asignacion_servico" DROP CONSTRAINT "asignacion_servico_id_paciente_fkey";

-- DropForeignKey
ALTER TABLE "asignacion_servico" DROP CONSTRAINT "asignacion_servico_id_pedido_fkey";

-- DropForeignKey
ALTER TABLE "asignacion_servico" DROP CONSTRAINT "asignacion_servico_id_tarea_fkey";

-- DropForeignKey
ALTER TABLE "cuidador" DROP CONSTRAINT "cuidador_id_autorizado_por_fkey";

-- DropForeignKey
ALTER TABLE "cuidador" DROP CONSTRAINT "cuidador_id_cuidador_estado_fkey";

-- DropForeignKey
ALTER TABLE "cuidador" DROP CONSTRAINT "cuidador_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "familiar" DROP CONSTRAINT "familiar_id_paciente_fkey";

-- DropForeignKey
ALTER TABLE "familiar" DROP CONSTRAINT "familiar_id_parentesco_fkey";

-- DropForeignKey
ALTER TABLE "familiar" DROP CONSTRAINT "familiar_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "guardia" DROP CONSTRAINT "guardia_id_asignacion_fkey";

-- DropForeignKey
ALTER TABLE "guardia" DROP CONSTRAINT "guardia_id_cuidador_fkey";

-- DropForeignKey
ALTER TABLE "guardia" DROP CONSTRAINT "guardia_id_guardia_estado_fkey";

-- DropForeignKey
ALTER TABLE "guardia" DROP CONSTRAINT "guardia_id_paciente_fkey";

-- DropForeignKey
ALTER TABLE "guardia" DROP CONSTRAINT "guardia_id_pedido_servicio_fkey";

-- DropForeignKey
ALTER TABLE "log_auditoria" DROP CONSTRAINT "log_auditoria_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_id_cuidador_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_id_guardia_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_id_pago_autorizo_fkey";

-- DropForeignKey
ALTER TABLE "pedido_servicio" DROP CONSTRAINT "pedido_servicio_id_paciente_fkey";

-- DropForeignKey
ALTER TABLE "pedido_servicio" DROP CONSTRAINT "pedido_servicio_id_pedido_estado_fkey";

-- DropForeignKey
ALTER TABLE "pedido_servicio" DROP CONSTRAINT "pedido_servicio_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "persona" DROP CONSTRAINT "persona_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_id_rol_fkey";

-- DropIndex
DROP INDEX "cuidador_id_usuario_key";

-- DropIndex
DROP INDEX "persona_id_usuario_key";
