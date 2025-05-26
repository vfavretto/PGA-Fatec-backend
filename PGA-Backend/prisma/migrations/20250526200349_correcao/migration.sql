/*
  Warnings:

  - You are about to drop the column `tema` on the `AcaoProjeto` table. All the data in the column will be lost.
  - You are about to drop the column `projeto` on the `Attachment1` table. All the data in the column will be lost.
  - You are about to drop the column `entregavel_link_sei` on the `EtapaProcesso` table. All the data in the column will be lost.
  - Added the required column `tema_id` to the `AcaoProjeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flag` to the `Attachment1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entregavel_id` to the `EtapaProcesso` table without a default value. This is not possible if the table is not empty.
  - Made the column `tipo_gestao` on table `PrioridadeAcao` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AnexoProjetoUm" AS ENUM ('1', '2', '3', '4');

-- AlterTable
ALTER TABLE "AcaoProjeto" DROP COLUMN "tema",
ADD COLUMN     "attachment1Id" TEXT,
ADD COLUMN     "tema_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Attachment1" DROP COLUMN "projeto",
ADD COLUMN     "flag" "AnexoProjetoUm" NOT NULL;

-- AlterTable
ALTER TABLE "EtapaProcesso" DROP COLUMN "entregavel_link_sei",
ADD COLUMN     "entregavel_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PrioridadeAcao" ADD COLUMN     "detalhes" TEXT,
ALTER COLUMN "tipo_gestao" SET NOT NULL;

-- CreateTable
CREATE TABLE "Tema" (
    "tema_id" SERIAL NOT NULL,
    "tema_num" INTEGER NOT NULL,
    "eixo_id" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,

    CONSTRAINT "Tema_pkey" PRIMARY KEY ("tema_id")
);

-- CreateTable
CREATE TABLE "EntregavelLinkSei" (
    "entregavel_id" SERIAL NOT NULL,
    "entregavel_numero" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "detalhes" VARCHAR(500),

    CONSTRAINT "EntregavelLinkSei_pkey" PRIMARY KEY ("entregavel_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tema_tema_num_key" ON "Tema"("tema_num");

-- CreateIndex
CREATE UNIQUE INDEX "EntregavelLinkSei_entregavel_numero_key" ON "EntregavelLinkSei"("entregavel_numero");

-- AddForeignKey
ALTER TABLE "Tema" ADD CONSTRAINT "Tema_eixo_id_fkey" FOREIGN KEY ("eixo_id") REFERENCES "EixoTematico"("eixo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_tema_id_fkey" FOREIGN KEY ("tema_id") REFERENCES "Tema"("tema_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_attachment1Id_fkey" FOREIGN KEY ("attachment1Id") REFERENCES "Attachment1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtapaProcesso" ADD CONSTRAINT "EtapaProcesso_entregavel_id_fkey" FOREIGN KEY ("entregavel_id") REFERENCES "EntregavelLinkSei"("entregavel_id") ON DELETE RESTRICT ON UPDATE CASCADE;
