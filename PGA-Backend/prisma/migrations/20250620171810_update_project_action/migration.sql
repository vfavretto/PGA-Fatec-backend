/*
  Warnings:

  - Added the required column `codigo_projeto` to the `AcaoProjeto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcaoProjeto" ADD COLUMN     "codigo_projeto" VARCHAR(20) NOT NULL,
ADD COLUMN     "nome_projeto" VARCHAR(255);

-- CreateIndex
CREATE INDEX "AcaoProjeto_codigo_projeto_idx" ON "AcaoProjeto"("codigo_projeto");
