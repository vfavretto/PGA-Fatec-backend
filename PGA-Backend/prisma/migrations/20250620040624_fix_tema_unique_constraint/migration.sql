/*
  Warnings:

  - A unique constraint covering the columns `[tema_num,eixo_id]` on the table `Tema` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tema_tema_num_key";

-- AlterTable
ALTER TABLE "EntregavelLinkSei" ALTER COLUMN "atualizado_em" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Tema_tema_num_eixo_id_key" ON "Tema"("tema_num", "eixo_id");
