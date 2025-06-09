/*
  Warnings:

  - A unique constraint covering the columns `[codigo_categoria,ativo]` on the table `SituacaoProblema` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SituacaoProblema_codigo_categoria_key";

-- CreateIndex
CREATE UNIQUE INDEX "SituacaoProblema_codigo_categoria_ativo_key" ON "SituacaoProblema"("codigo_categoria", "ativo");
