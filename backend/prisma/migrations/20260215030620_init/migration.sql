/*
  Warnings:

  - You are about to drop the column `email` on the `persona` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "idx_email";

-- DropIndex
DROP INDEX "persona_email_key";

-- AlterTable
ALTER TABLE "persona" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "email" VARCHAR(60) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
