/*
  Warnings:

  - Made the column `etapa_processo_id` on table `Anexo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Anexo" DROP CONSTRAINT "Anexo_etapa_processo_id_fkey";

-- AlterTable
ALTER TABLE "Anexo" ALTER COLUMN "etapa_processo_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Anexo" ADD CONSTRAINT "Anexo_etapa_processo_id_fkey" FOREIGN KEY ("etapa_processo_id") REFERENCES "EtapaProcesso"("etapa_id") ON DELETE CASCADE ON UPDATE CASCADE;
