/*
  Warnings:

  - A unique constraint covering the columns `[identificacion]` on the table `persona` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefono]` on the table `persona` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "persona_identificacion_key" ON "persona"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "persona_telefono_key" ON "persona"("telefono");
