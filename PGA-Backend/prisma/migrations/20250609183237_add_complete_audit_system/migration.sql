/*
  Warnings:

  - Added the required column `atualizado_em` to the `EixoTematico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `EntregavelLinkSei` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `Pessoa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `PrioridadeAcao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `SituacaoProblema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `Tema` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoOperacaoAuditoria" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'SNAPSHOT_CREATED');

-- DropIndex
DROP INDEX "SituacaoProblema_codigo_categoria_ativo_key";

-- AlterTable
ALTER TABLE "EixoTematico" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "atualizado_por" INTEGER,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criado_por" INTEGER;

-- AlterTable
ALTER TABLE "EntregavelLinkSei" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "atualizado_por" INTEGER,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criado_por" INTEGER;

-- AlterTable
ALTER TABLE "PGA" ADD COLUMN     "configuracoes_snapshot" JSONB,
ADD COLUMN     "data_snapshot_criado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuario_criacao_id" INTEGER;

-- AlterTable
ALTER TABLE "Pessoa" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PrioridadeAcao" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "atualizado_por" INTEGER,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criado_por" INTEGER;

-- AlterTable
ALTER TABLE "SituacaoProblema" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "atualizado_por" INTEGER,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criado_por" INTEGER;

-- AlterTable
ALTER TABLE "Tema" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "atualizado_por" INTEGER,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criado_por" INTEGER;

-- CreateTable
CREATE TABLE "ConfiguracaoAuditoria" (
    "auditoria_id" SERIAL NOT NULL,
    "tabela" VARCHAR(50) NOT NULL,
    "registro_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "operacao" "TipoOperacaoAuditoria" NOT NULL,
    "dados_antes" JSONB,
    "dados_depois" JSONB,
    "usuario_id" INTEGER,
    "data_operacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,

    CONSTRAINT "ConfiguracaoAuditoria_pkey" PRIMARY KEY ("auditoria_id")
);

-- CreateTable
CREATE TABLE "SituacaoProblemaVersao" (
    "versao_id" SERIAL NOT NULL,
    "situacao_base_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "codigo_categoria" VARCHAR(20) NOT NULL,
    "descricao" TEXT NOT NULL,
    "fonte" VARCHAR(255),
    "ativo_no_ano" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo_alteracao" TEXT,

    CONSTRAINT "SituacaoProblemaVersao_pkey" PRIMARY KEY ("versao_id")
);

-- CreateTable
CREATE TABLE "EixoTematicoVersao" (
    "versao_id" SERIAL NOT NULL,
    "eixo_base_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "ativo_no_ano" BOOLEAN NOT NULL DEFAULT true,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo_alteracao" TEXT,

    CONSTRAINT "EixoTematicoVersao_pkey" PRIMARY KEY ("versao_id")
);

-- CreateTable
CREATE TABLE "PrioridadeAcaoVersao" (
    "versao_id" SERIAL NOT NULL,
    "prioridade_base_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "grau" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "tipo_gestao" VARCHAR(100) NOT NULL,
    "detalhes" TEXT,
    "ativo_no_ano" BOOLEAN NOT NULL DEFAULT true,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo_alteracao" TEXT,

    CONSTRAINT "PrioridadeAcaoVersao_pkey" PRIMARY KEY ("versao_id")
);

-- CreateTable
CREATE TABLE "TemaVersao" (
    "versao_id" SERIAL NOT NULL,
    "tema_base_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "tema_num" INTEGER NOT NULL,
    "eixo_id" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "ativo_no_ano" BOOLEAN NOT NULL DEFAULT true,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo_alteracao" TEXT,

    CONSTRAINT "TemaVersao_pkey" PRIMARY KEY ("versao_id")
);

-- CreateTable
CREATE TABLE "EntregavelVersao" (
    "versao_id" SERIAL NOT NULL,
    "entregavel_base_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "entregavel_numero" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "detalhes" VARCHAR(500),
    "ativo_no_ano" BOOLEAN NOT NULL DEFAULT true,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo_alteracao" TEXT,

    CONSTRAINT "EntregavelVersao_pkey" PRIMARY KEY ("versao_id")
);

-- CreateTable
CREATE TABLE "PessoaVersao" (
    "versao_id" SERIAL NOT NULL,
    "pessoa_base_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "tipo_usuario" "TipoUsuario" NOT NULL,
    "ativo_no_ano" BOOLEAN NOT NULL DEFAULT true,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo_alteracao" TEXT,

    CONSTRAINT "PessoaVersao_pkey" PRIMARY KEY ("versao_id")
);

-- CreateIndex
CREATE INDEX "ConfiguracaoAuditoria_tabela_registro_id_idx" ON "ConfiguracaoAuditoria"("tabela", "registro_id");

-- CreateIndex
CREATE INDEX "ConfiguracaoAuditoria_ano_idx" ON "ConfiguracaoAuditoria"("ano");

-- CreateIndex
CREATE INDEX "ConfiguracaoAuditoria_data_operacao_idx" ON "ConfiguracaoAuditoria"("data_operacao");

-- CreateIndex
CREATE INDEX "SituacaoProblemaVersao_ano_idx" ON "SituacaoProblemaVersao"("ano");

-- CreateIndex
CREATE UNIQUE INDEX "SituacaoProblemaVersao_situacao_base_id_ano_key" ON "SituacaoProblemaVersao"("situacao_base_id", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "EixoTematicoVersao_eixo_base_id_ano_key" ON "EixoTematicoVersao"("eixo_base_id", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "PrioridadeAcaoVersao_prioridade_base_id_ano_key" ON "PrioridadeAcaoVersao"("prioridade_base_id", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "TemaVersao_tema_base_id_ano_key" ON "TemaVersao"("tema_base_id", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "EntregavelVersao_entregavel_base_id_ano_key" ON "EntregavelVersao"("entregavel_base_id", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "PessoaVersao_pessoa_base_id_ano_key" ON "PessoaVersao"("pessoa_base_id", "ano");

-- CreateIndex
CREATE INDEX "SituacaoProblema_criado_em_idx" ON "SituacaoProblema"("criado_em");

-- AddForeignKey
ALTER TABLE "PGA" ADD CONSTRAINT "PGA_usuario_criacao_id_fkey" FOREIGN KEY ("usuario_criacao_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SituacaoProblema" ADD CONSTRAINT "SituacaoProblema_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SituacaoProblema" ADD CONSTRAINT "SituacaoProblema_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EixoTematico" ADD CONSTRAINT "EixoTematico_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EixoTematico" ADD CONSTRAINT "EixoTematico_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrioridadeAcao" ADD CONSTRAINT "PrioridadeAcao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrioridadeAcao" ADD CONSTRAINT "PrioridadeAcao_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tema" ADD CONSTRAINT "Tema_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tema" ADD CONSTRAINT "Tema_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregavelLinkSei" ADD CONSTRAINT "EntregavelLinkSei_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregavelLinkSei" ADD CONSTRAINT "EntregavelLinkSei_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracaoAuditoria" ADD CONSTRAINT "ConfiguracaoAuditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SituacaoProblemaVersao" ADD CONSTRAINT "SituacaoProblemaVersao_situacao_base_id_fkey" FOREIGN KEY ("situacao_base_id") REFERENCES "SituacaoProblema"("situacao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SituacaoProblemaVersao" ADD CONSTRAINT "SituacaoProblemaVersao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EixoTematicoVersao" ADD CONSTRAINT "EixoTematicoVersao_eixo_base_id_fkey" FOREIGN KEY ("eixo_base_id") REFERENCES "EixoTematico"("eixo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EixoTematicoVersao" ADD CONSTRAINT "EixoTematicoVersao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrioridadeAcaoVersao" ADD CONSTRAINT "PrioridadeAcaoVersao_prioridade_base_id_fkey" FOREIGN KEY ("prioridade_base_id") REFERENCES "PrioridadeAcao"("prioridade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrioridadeAcaoVersao" ADD CONSTRAINT "PrioridadeAcaoVersao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemaVersao" ADD CONSTRAINT "TemaVersao_tema_base_id_fkey" FOREIGN KEY ("tema_base_id") REFERENCES "Tema"("tema_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemaVersao" ADD CONSTRAINT "TemaVersao_eixo_id_fkey" FOREIGN KEY ("eixo_id") REFERENCES "EixoTematico"("eixo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemaVersao" ADD CONSTRAINT "TemaVersao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregavelVersao" ADD CONSTRAINT "EntregavelVersao_entregavel_base_id_fkey" FOREIGN KEY ("entregavel_base_id") REFERENCES "EntregavelLinkSei"("entregavel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregavelVersao" ADD CONSTRAINT "EntregavelVersao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaVersao" ADD CONSTRAINT "PessoaVersao_pessoa_base_id_fkey" FOREIGN KEY ("pessoa_base_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaVersao" ADD CONSTRAINT "PessoaVersao_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;
