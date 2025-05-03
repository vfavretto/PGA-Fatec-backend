-- CreateEnum
CREATE TYPE "StatusPGA" AS ENUM ('EmElaboracao', 'Submetido', 'Aprovado', 'Reprovado');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('Docente', 'Administrativo', 'Gestor');

-- CreateEnum
CREATE TYPE "PapelProjeto" AS ENUM ('Responsavel', 'Colaborador');

-- CreateEnum
CREATE TYPE "TipoVinculoHAE" AS ENUM ('15', '25', '40', 'NaoSeAplica');

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

-- CreateTable
CREATE TABLE "Unidade" (
    "unidade_id" SERIAL NOT NULL,
    "codigo_fnnn" VARCHAR(10) NOT NULL,
    "nome_completo" VARCHAR(255) NOT NULL,
    "diretor_nome" VARCHAR(255),

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

    CONSTRAINT "PGA_pkey" PRIMARY KEY ("pga_id")
);

-- CreateTable
CREATE TABLE "SituacaoProblema" (
    "situacao_id" SERIAL NOT NULL,
    "pga_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "fonte" VARCHAR(255),

    CONSTRAINT "SituacaoProblema_pkey" PRIMARY KEY ("situacao_id")
);

-- CreateTable
CREATE TABLE "EixoTematico" (
    "eixo_id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "EixoTematico_pkey" PRIMARY KEY ("eixo_id")
);

-- CreateTable
CREATE TABLE "PrioridadeAcao" (
    "prioridade_id" SERIAL NOT NULL,
    "grau" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "tipo_gestao" VARCHAR(100),

    CONSTRAINT "PrioridadeAcao_pkey" PRIMARY KEY ("prioridade_id")
);

-- CreateTable
CREATE TABLE "AcaoProjeto" (
    "acao_projeto_id" SERIAL NOT NULL,
    "pga_id" INTEGER NOT NULL,
    "eixo_id" INTEGER NOT NULL,
    "prioridade_id" INTEGER NOT NULL,
    "tema" VARCHAR(255) NOT NULL,
    "o_que_sera_feito" TEXT NOT NULL,
    "por_que_sera_feito" TEXT NOT NULL,
    "data_inicio" DATE,
    "data_final" DATE,
    "objetivos_institucionais_referenciados" TEXT,
    "obrigatorio_inclusao" BOOLEAN NOT NULL DEFAULT false,
    "obrigatorio_sustentabilidade" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AcaoProjeto_pkey" PRIMARY KEY ("acao_projeto_id")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "pessoa_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "nome_usuario" VARCHAR(30),
    "senha" VARCHAR(30),
    "tipo_usuario" "TipoUsuario" NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("pessoa_id")
);

-- CreateTable
CREATE TABLE "ProjetoPessoa" (
    "projeto_pessoa_id" SERIAL NOT NULL,
    "acao_projeto_id" INTEGER NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "papel" "PapelProjeto" NOT NULL,
    "carga_horaria_semanal" INTEGER,
    "tipo_vinculo_hae" "TipoVinculoHAE" NOT NULL DEFAULT 'NaoSeAplica',

    CONSTRAINT "ProjetoPessoa_pkey" PRIMARY KEY ("projeto_pessoa_id")
);

-- CreateTable
CREATE TABLE "EtapaProcesso" (
    "etapa_id" SERIAL NOT NULL,
    "acao_projeto_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "entregavel_link_sei" VARCHAR(255),
    "numero_ref" VARCHAR(50),
    "data_verificacao_prevista" DATE,
    "data_verificacao_realizada" DATE,
    "status_verificacao" "StatusVerificacao" NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "EtapaProcesso_pkey" PRIMARY KEY ("etapa_id")
);

-- CreateTable
CREATE TABLE "Aquisicao" (
    "aquisicao_id" SERIAL NOT NULL,
    "acao_projeto_id" INTEGER,
    "pga_id" INTEGER NOT NULL,
    "tipo_anexo" "TipoAnexo" NOT NULL,
    "descricao_item" VARCHAR(255) NOT NULL,
    "unidade_medida" VARCHAR(50),
    "quantidade" INTEGER NOT NULL,
    "justificativa" TEXT,
    "valor_unitario_estimado" DECIMAL(10,2),
    "valor_total_estimado" DECIMAL(10,2),

    CONSTRAINT "Aquisicao_pkey" PRIMARY KEY ("aquisicao_id")
);

-- CreateTable
CREATE TABLE "AcaoCPA" (
    "acao_cpa_id" SERIAL NOT NULL,
    "pga_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "justificativa" TEXT,

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

    CONSTRAINT "RotinaInstitucional_pkey" PRIMARY KEY ("rotina_id")
);

-- CreateTable
CREATE TABLE "RotinaParticipante" (
    "rotina_participante_id" SERIAL NOT NULL,
    "rotina_id" INTEGER NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "papel" VARCHAR(100),

    CONSTRAINT "RotinaParticipante_pkey" PRIMARY KEY ("rotina_participante_id")
);

-- CreateTable
CREATE TABLE "RotinaOcorrencia" (
    "ocorrencia_id" SERIAL NOT NULL,
    "rotina_id" INTEGER NOT NULL,
    "data_realizacao" DATE NOT NULL,
    "hora_inicio" TIME,
    "hora_fim" TIME,
    "local" VARCHAR(255),
    "pauta" TEXT,
    "resultado" TEXT,
    "link_ata" VARCHAR(255),
    "status" "StatusOcorrencia" NOT NULL DEFAULT 'Planejada',

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

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("curso_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unidade_codigo_fnnn_key" ON "Unidade"("codigo_fnnn");

-- CreateIndex
CREATE UNIQUE INDEX "EixoTematico_numero_key" ON "EixoTematico"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "PrioridadeAcao_grau_key" ON "PrioridadeAcao"("grau");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_nome_usuario_key" ON "Pessoa"("nome_usuario");

-- AddForeignKey
ALTER TABLE "PGA" ADD CONSTRAINT "PGA_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "Unidade"("unidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SituacaoProblema" ADD CONSTRAINT "SituacaoProblema_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_eixo_id_fkey" FOREIGN KEY ("eixo_id") REFERENCES "EixoTematico"("eixo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoProjeto" ADD CONSTRAINT "AcaoProjeto_prioridade_id_fkey" FOREIGN KEY ("prioridade_id") REFERENCES "PrioridadeAcao"("prioridade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoPessoa" ADD CONSTRAINT "ProjetoPessoa_acao_projeto_id_fkey" FOREIGN KEY ("acao_projeto_id") REFERENCES "AcaoProjeto"("acao_projeto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoPessoa" ADD CONSTRAINT "ProjetoPessoa_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtapaProcesso" ADD CONSTRAINT "EtapaProcesso_acao_projeto_id_fkey" FOREIGN KEY ("acao_projeto_id") REFERENCES "AcaoProjeto"("acao_projeto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aquisicao" ADD CONSTRAINT "Aquisicao_acao_projeto_id_fkey" FOREIGN KEY ("acao_projeto_id") REFERENCES "AcaoProjeto"("acao_projeto_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aquisicao" ADD CONSTRAINT "Aquisicao_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoCPA" ADD CONSTRAINT "AcaoCPA_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaInstitucional" ADD CONSTRAINT "RotinaInstitucional_pga_id_fkey" FOREIGN KEY ("pga_id") REFERENCES "PGA"("pga_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaInstitucional" ADD CONSTRAINT "RotinaInstitucional_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Curso"("curso_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaInstitucional" ADD CONSTRAINT "RotinaInstitucional_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaParticipante" ADD CONSTRAINT "RotinaParticipante_rotina_id_fkey" FOREIGN KEY ("rotina_id") REFERENCES "RotinaInstitucional"("rotina_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaParticipante" ADD CONSTRAINT "RotinaParticipante_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotinaOcorrencia" ADD CONSTRAINT "RotinaOcorrencia_rotina_id_fkey" FOREIGN KEY ("rotina_id") REFERENCES "RotinaInstitucional"("rotina_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "Unidade"("unidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_coordenador_id_fkey" FOREIGN KEY ("coordenador_id") REFERENCES "Pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE;
