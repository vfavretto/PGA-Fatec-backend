-- CreateEnum
CREATE TYPE "StatusPGA" AS ENUM ('EmElaboracao', 'Submetido', 'Aprovado', 'Reprovado');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('Administrador', 'CPS', 'Regional', 'Diretor', 'Coordenador', 'Administrativo', 'Docente');

-- CreateEnum
CREATE TYPE "PapelProjeto" AS ENUM ('Responsavel', 'Colaborador');

-- CreateEnum
CREATE TYPE "StatusVerificacao" AS ENUM ('Pendente', 'OK', 'RequerAcao');

-- CreateEnum
CREATE TYPE "TipoAnexo" AS ENUM ('MaterialPermanente', 'MaterialConsumo', 'ReagenteQuimico', 'Livro', 'Software');

-- CreateEnum
CREATE TYPE "TipoRotina" AS ENUM ('CPA', 'CEPE', 'NDE', 'ReuniaoPedagogica', 'Planejamento', 'AvaliacaoInstitucional', 'AcompanhamentoAcademico', 'Outro');

-- CreateEnum
CREATE TYPE "PeriodicidadeRotina" AS ENUM ('Semanal', 'Quinzenal', 'Mensal', 'Bimestral', 'Semestral', 'Anual', 'SobDemanda');

-- CreateEnum
CREATE TYPE "StatusRotina" AS ENUM ('Planejada', 'EmAndamento', 'Concluida', 'Cancelada');

-- CreateEnum
CREATE TYPE "StatusOcorrencia" AS ENUM ('Planejada', 'Realizada', 'Cancelada', 'Adiada');

-- CreateEnum
CREATE TYPE "TipoCurso" AS ENUM ('Tecnologico', 'AMS', 'Outro');

-- CreateEnum
CREATE TYPE "StatusCurso" AS ENUM ('EmPlanejamento', 'EmImplantacao', 'Ativo', 'Inativo');

-- CreateEnum
CREATE TYPE "StatusProjetoRegional" AS ENUM ('EmAnalise', 'Aprovado', 'Reprovado');

-- CreateEnum
CREATE TYPE "AnexoProjetoUm" AS ENUM ('1', '2', '3', '4');

-- CreateEnum
CREATE TYPE "TipoOperacaoAuditoria" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'SNAPSHOT_CREATED');

-- CreateEnum
CREATE TYPE "StatusSolicitacao" AS ENUM ('Pendente', 'Aprovada', 'Rejeitada');

-- CreateTable
CREATE TABLE "Unidade" (
    "unidade_id" SERIAL NOT NULL,
    "codigo_fnnn" VARCHAR(10) NOT NULL,
    "nome_unidade" VARCHAR(255) NOT NULL,
    "regional_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "diretor_id" INTEGER,
    "endereco" VARCHAR(255),
    "complemento" VARCHAR(255),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "uf" VARCHAR(2),
    "cep" VARCHAR(10),
    "telefone" VARCHAR(20),
    "site" VARCHAR(255),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "criado_por" INTEGER,
    "atualizado_por" INTEGER,

    CONSTRAINT "Unidade_pkey" PRIMARY KEY ("unidade_id")
);

-- CreateTable
CREATE TABLE "PGA" (
    "pga_id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "versao" VARCHAR(10),
    "analise_cenario" TEXT,
    "data_elaboracao" DATE,
    "data_parecer_gpr" DATE,
    "status" "StatusPGA" NOT NULL DEFAULT 'EmElaboracao',
    "configuracoes_snapshot" JSONB,
    "data_snapshot_criado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_criacao_id" INTEGER,
    "regional_responsavel_id" INTEGER,
    "parecer_regional" TEXT,
    "data_parecer_regional" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PGA_pkey" PRIMARY KEY ("pga_id")
);

-- CreateTable
CREATE TABLE "SituacaoProblema" (
    "situacao_id" SERIAL NOT NULL,
    "codigo_categoria" VARCHAR(20) NOT NULL,
    "descricao" TEXT NOT NULL,
    "fonte" VARCHAR(255),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_por" INTEGER,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "atualizado_por" INTEGER,

    CONSTRAINT "SituacaoProblema_pkey" PRIMARY KEY ("situacao_id")
);

-- CreateTable
CREATE TABLE "EixoTematico" (
    "eixo_id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nome_eixo" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_por" INTEGER,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,

    CONSTRAINT "EixoTematico_pkey" PRIMARY KEY ("eixo_id")
);

-- CreateTable
CREATE TABLE "PrioridadeAcao" (
    "prioridade_id" SERIAL NOT NULL,
    "grau" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "tipo_gestao" VARCHAR(100) NOT NULL,
    "detalhes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_por" INTEGER,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "atualizado_por" INTEGER,

    CONSTRAINT "PrioridadeAcao_pkey" PRIMARY KEY ("prioridade_id")
);

-- CreateTable
CREATE TABLE "Tema" (
    "tema_id" SERIAL NOT NULL,
    "tema_num" INTEGER NOT NULL,
    "eixo_id" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_por" INTEGER,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,

    CONSTRAINT "Tema_pkey" PRIMARY KEY ("tema_id")
);

-- CreateTable
CREATE TABLE "AcaoProjeto" (
    "acao_projeto_id" SERIAL NOT NULL,
    "codigo_projeto" VARCHAR(20) NOT NULL,
    "nome_projeto" VARCHAR(255),
    "pga_id" INTEGER NOT NULL,
    "eixo_id" INTEGER NOT NULL,
    "prioridade_id" INTEGER NOT NULL,
    "tema_id" INTEGER NOT NULL,
    "o_que_sera_feito" TEXT NOT NULL,
    "por_que_sera_feito" TEXT NOT NULL,
    "data_inicio" DATE,
    "data_final" DATE,
    "objetivos_institucionais_referenciados" TEXT,
    "obrigatorio_inclusao" BOOLEAN NOT NULL DEFAULT false,
    "obrigatorio_sustentabilidade" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "custo_total_estimado" DECIMAL(10,2),
    "fonte_recursos" VARCHAR(255),
    "status_regional" "StatusProjetoRegional" NOT NULL DEFAULT 'EmAnalise',
    "parecer_regional" TEXT,
    "data_parecer_regional" TIMESTAMP(3),
    "regional_responsavel_id" INTEGER,

    CONSTRAINT "AcaoProjeto_pkey" PRIMARY KEY ("acao_projeto_id")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "pessoa_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "nome_usuario" VARCHAR(30),
    "senha" VARCHAR(255),
    "tipo_usuario" "TipoUsuario" NOT NULL,
    "cpf" VARCHAR(11),
    "matricula" VARCHAR(20),
    "telefone" VARCHAR(20),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "criado_por" INTEGER,
    "atualizado_por" INTEGER,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("pessoa_id")
);

-- CreateTable
CREATE TABLE "ProjetoPessoa" (
    "projeto_pessoa_id" SERIAL NOT NULL,
    "acao_projeto_id" INTEGER NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "papel" "PapelProjeto" NOT NULL,
    "carga_horaria_semanal" INTEGER,
    "tipo_vinculo_hae_id" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProjetoPessoa_pkey" PRIMARY KEY ("projeto_pessoa_id")
);

-- CreateTable
CREATE TABLE "EtapaProcesso" (
    "etapa_id" SERIAL NOT NULL,
    "acao_projeto_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "entregavel_id" INTEGER,
    "numero_ref" VARCHAR(50),
    "data_verificacao_prevista" DATE,
    "data_verificacao_realizada" DATE,
    "status_verificacao" "StatusVerificacao" DEFAULT 'Pendente',
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EtapaProcesso_pkey" PRIMARY KEY ("etapa_id")
);

-- CreateTable
CREATE TABLE "Anexo" (
    "anexo_id" SERIAL NOT NULL,
    "etapa_processo_id" INTEGER,
    "entregavel_id" INTEGER NOT NULL,
    "item" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario_estimado" DECIMAL(10,2) NOT NULL,
    "preco_total_estimado" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anexo_pkey" PRIMARY KEY ("anexo_id")
);

-- CreateTable
CREATE TABLE "EntregavelLinkSei" (
    "entregavel_id" SERIAL NOT NULL,
    "entregavel_numero" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "detalhes" VARCHAR(500),
    "requer_anexo" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_por" INTEGER,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,

    CONSTRAINT "EntregavelLinkSei_pkey" PRIMARY KEY ("entregavel_id")
);

-- CreateTable
CREATE TABLE "AcaoCPA" (
    "acao_cpa_id" SERIAL NOT NULL,
    "pga_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "justificativa" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AcaoCPA_pkey" PRIMARY KEY ("acao_cpa_id")
);

-- CreateTable
CREATE TABLE "RotinaInstitucional" (
    "rotina_id" SERIAL NOT NULL,
    "pga_id" INTEGER NOT NULL,
    "curso_id" INTEGER,
    "tipo_rotina" "TipoRotina" NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,
    "periodicidade" "PeriodicidadeRotina" NOT NULL,
    "data_inicio" DATE,
    "data_fim" DATE,
    "responsavel_id" INTEGER NOT NULL,
    "entregavel_esperado" TEXT,
    "status" "StatusRotina" NOT NULL DEFAULT 'Planejada',
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RotinaInstitucional_pkey" PRIMARY KEY ("rotina_id")
);

-- CreateTable
CREATE TABLE "RotinaParticipante" (
    "rotina_participante_id" SERIAL NOT NULL,
    "rotina_id" INTEGER NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "papel" VARCHAR(100),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RotinaParticipante_pkey" PRIMARY KEY ("rotina_participante_id")
);

-- CreateTable
CREATE TABLE "RotinaOcorrencia" (
    "ocorrencia_id" SERIAL NOT NULL,
    "rotina_id" INTEGER NOT NULL,
    "data_realizacao" DATE NOT NULL,
    "hora_inicio" TIME(6),
    "hora_fim" TIME(6),
    "local" VARCHAR(255),
    "pauta" TEXT,
    "resultado" TEXT,
    "link_ata" VARCHAR(255),
    "status" "StatusOcorrencia" NOT NULL DEFAULT 'Planejada',
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RotinaOcorrencia_pkey" PRIMARY KEY ("ocorrencia_id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "curso_id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "tipo" "TipoCurso" NOT NULL,
    "status" "StatusCurso" NOT NULL,
    "coordenador_id" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("curso_id")
);

-- CreateTable
CREATE TABLE "TipoVinculoHAE" (
    "id" SERIAL NOT NULL,
    "sigla" VARCHAR(10) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "detalhes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TipoVinculoHAE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PGASituacaoProblema" (
    "pga_id" INTEGER NOT NULL,
    "situacao_problema_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PGASituacaoProblema_pkey" PRIMARY KEY ("pga_id","situacao_problema_id")
);

-- CreateTable
CREATE TABLE "AcaoProjetoSituacaoProblema" (
    "acao_projeto_id" INTEGER NOT NULL,
    "situacao_problema_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AcaoProjetoSituacaoProblema_pkey" PRIMARY KEY ("acao_projeto_id","situacao_problema_id")
);

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

-- CreateTable
CREATE TABLE "SolicitacaoAcesso" (
    "solicitacao_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "status" "StatusSolicitacao" NOT NULL DEFAULT 'Pendente',
    "data_solicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_processamento" TIMESTAMP(3),
    "processado_por" INTEGER,
    "tipo_usuario_concedido" "TipoUsuario",

    CONSTRAINT "SolicitacaoAcesso_pkey" PRIMARY KEY ("solicitacao_id")
);

-- CreateTable
CREATE TABLE "PessoaUnidade" (
    "pessoa_id" INTEGER NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "data_vinculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PessoaUnidade_pkey" PRIMARY KEY ("pessoa_id","unidade_id")
);

-- CreateTable
CREATE TABLE "PessoaRegional" (
    "pessoa_id" INTEGER NOT NULL,
    "regional_id" INTEGER NOT NULL,
    "data_vinculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PessoaRegional_pkey" PRIMARY KEY ("pessoa_id","regional_id")
);

-- CreateTable
CREATE TABLE "Regional" (
    "regional_id" SERIAL NOT NULL,
    "nome_regional" VARCHAR(255) NOT NULL,
    "codigo_regional" VARCHAR(10),
    "responsavel_id" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "criado_por" INTEGER,
    "atualizado_por" INTEGER,

    CONSTRAINT "Regional_pkey" PRIMARY KEY ("regional_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unidade_codigo_fnnn_key" ON "Unidade"("codigo_fnnn");

-- CreateIndex
CREATE UNIQUE INDEX "Unidade_diretor_id_key" ON "Unidade"("diretor_id");

-- CreateIndex
CREATE INDEX "Unidade_regional_id_idx" ON "Unidade"("regional_id");

-- CreateIndex
CREATE INDEX "SituacaoProblema_codigo_categoria_idx" ON "SituacaoProblema"("codigo_categoria");

-- CreateIndex
CREATE INDEX "SituacaoProblema_ativo_idx" ON "SituacaoProblema"("ativo");

-- CreateIndex
CREATE INDEX "SituacaoProblema_criado_em_idx" ON "SituacaoProblema"("criado_em");

-- CreateIndex
CREATE UNIQUE INDEX "EixoTematico_numero_key" ON "EixoTematico"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "PrioridadeAcao_grau_key" ON "PrioridadeAcao"("grau");

-- CreateIndex
CREATE UNIQUE INDEX "Tema_tema_num_eixo_id_key" ON "Tema"("tema_num", "eixo_id");

-- CreateIndex
CREATE INDEX "AcaoProjeto_codigo_projeto_idx" ON "AcaoProjeto"("codigo_projeto");

-- CreateIndex
CREATE INDEX "AcaoProjeto_status_regional_idx" ON "AcaoProjeto"("status_regional");

-- CreateIndex
CREATE INDEX "AcaoProjeto_pga_id_idx" ON "AcaoProjeto"("pga_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_nome_usuario_key" ON "Pessoa"("nome_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "Pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_matricula_key" ON "Pessoa"("matricula");

-- CreateIndex
CREATE INDEX "Anexo_etapa_processo_id_idx" ON "Anexo"("etapa_processo_id");

-- CreateIndex
CREATE INDEX "Anexo_entregavel_id_idx" ON "Anexo"("entregavel_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntregavelLinkSei_entregavel_numero_key" ON "EntregavelLinkSei"("entregavel_numero");

-- CreateIndex
CREATE UNIQUE INDEX "TipoVinculoHAE_sigla_key" ON "TipoVinculoHAE"("sigla");

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
CREATE UNIQUE INDEX "Regional_codigo_regional_key" ON "Regional"("codigo_regional");

-- AddForeignKey
ALTER TABLE "Unidade" ADD CONSTRAINT "Unidade_diretor_id_fkey" FOREIGN KEY ("diretor_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidade" ADD CONSTRAINT "Unidade_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidade" ADD CONSTRAINT "Unidade_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidade" ADD CONSTRAINT "Unidade_regional_id_fkey" FOREIGN KEY ("regional_id") REFERENCES "Regional"("regional_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PGA" ADD CONSTRAINT "PGA_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "Unidade"("unidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PGA" ADD CONSTRAINT "PGA_usuario_criacao_id_fkey" FOREIGN KEY ("usuario_criacao_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PGA" ADD CONSTRAINT "PGA_regional_responsavel_id_fkey" FOREIGN KEY ("regional_responsavel_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "Tema" ADD CONSTRAINT "Tema_eixo_id_fkey" FOREIGN KEY ("eixo_id") REFERENCES "EixoTematico"("eixo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tema" ADD CONSTRAINT "Tema_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tema" ADD CONSTRAINT "Tema_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_eixo_id_fkey" FOREIGN KEY ("eixo_id") REFERENCES "EixoTematico"("eixo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_tema_id_fkey" FOREIGN KEY ("tema_id") REFERENCES "Tema"("tema_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_prioridade_id_fkey" FOREIGN KEY ("prioridade_id") REFERENCES "PrioridadeAcao"("prioridade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_regional_responsavel_id_fkey" FOREIGN KEY ("regional_responsavel_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoPessoa" ADD CONSTRAINT "ProjetoPessoa_tipo_vinculo_hae_id_fkey" FOREIGN KEY ("tipo_vinculo_hae_id") REFERENCES "TipoVinculoHAE"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoPessoa" ADD CONSTRAINT "ProjetoPessoa_acao_projeto_id_fkey" FOREIGN KEY ("acao_projeto_id") REFERENCES "AcaoProjeto"("acao_projeto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoPessoa" ADD CONSTRAINT "ProjetoPessoa_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtapaProcesso" ADD CONSTRAINT "EtapaProcesso_entregavel_id_fkey" FOREIGN KEY ("entregavel_id") REFERENCES "EntregavelLinkSei"("entregavel_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtapaProcesso" ADD CONSTRAINT "EtapaProcesso_acao_projeto_id_fkey" FOREIGN KEY ("acao_projeto_id") REFERENCES "AcaoProjeto"("acao_projeto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anexo" ADD CONSTRAINT "Anexo_etapa_processo_id_fkey" FOREIGN KEY ("etapa_processo_id") REFERENCES "EtapaProcesso"("etapa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anexo" ADD CONSTRAINT "Anexo_entregavel_id_fkey" FOREIGN KEY ("entregavel_id") REFERENCES "EntregavelLinkSei"("entregavel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregavelLinkSei" ADD CONSTRAINT "EntregavelLinkSei_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregavelLinkSei" ADD CONSTRAINT "EntregavelLinkSei_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoCPA" ADD CONSTRAINT "AcaoCPA_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaInstitucional" ADD CONSTRAINT "RotinaInstitucional_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Curso"("curso_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaInstitucional" ADD CONSTRAINT "RotinaInstitucional_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaInstitucional" ADD CONSTRAINT "RotinaInstitucional_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaParticipante" ADD CONSTRAINT "RotinaParticipante_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaParticipante" ADD CONSTRAINT "RotinaParticipante_rotina_id_fkey" FOREIGN KEY ("rotina_id") REFERENCES "RotinaInstitucional"("rotina_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaOcorrencia" ADD CONSTRAINT "RotinaOcorrencia_rotina_id_fkey" FOREIGN KEY ("rotina_id") REFERENCES "RotinaInstitucional"("rotina_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_coordenador_id_fkey" FOREIGN KEY ("coordenador_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "Unidade"("unidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PGASituacaoProblema" ADD CONSTRAINT "PGASituacaoProblema_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PGASituacaoProblema" ADD CONSTRAINT "PGASituacaoProblema_situacao_problema_id_fkey" FOREIGN KEY ("situacao_problema_id") REFERENCES "SituacaoProblema"("situacao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjetoSituacaoProblema" ADD CONSTRAINT "AcaoProjetoSituacaoProblema_acao_projeto_id_fkey" FOREIGN KEY ("acao_projeto_id") REFERENCES "AcaoProjeto"("acao_projeto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjetoSituacaoProblema" ADD CONSTRAINT "AcaoProjetoSituacaoProblema_situacao_problema_id_fkey" FOREIGN KEY ("situacao_problema_id") REFERENCES "SituacaoProblema"("situacao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "SolicitacaoAcesso" ADD CONSTRAINT "SolicitacaoAcesso_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "Unidade"("unidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitacaoAcesso" ADD CONSTRAINT "SolicitacaoAcesso_processado_por_fkey" FOREIGN KEY ("processado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaUnidade" ADD CONSTRAINT "PessoaUnidade_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaUnidade" ADD CONSTRAINT "PessoaUnidade_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "Unidade"("unidade_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaRegional" ADD CONSTRAINT "PessoaRegional_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaRegional" ADD CONSTRAINT "PessoaRegional_regional_id_fkey" FOREIGN KEY ("regional_id") REFERENCES "Regional"("regional_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regional" ADD CONSTRAINT "Regional_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regional" ADD CONSTRAINT "Regional_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regional" ADD CONSTRAINT "Regional_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;
