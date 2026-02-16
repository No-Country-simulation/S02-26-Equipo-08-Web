/*
  Warnings:

  - You are about to drop the column `id_cuidador_estado` on the `cuidador` table. All the data in the column will be lost.
  - You are about to drop the `cuidador_estado` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "cuidador" DROP COLUMN "id_cuidador_estado";

-- DropTable
DROP TABLE "cuidador_estado";
