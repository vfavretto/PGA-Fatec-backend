CREATE UNIQUE INDEX IF NOT EXISTS "EixoTematico_numero_ativo_unique" ON "EixoTematico"(numero) WHERE (ativo = true);
CREATE UNIQUE INDEX IF NOT EXISTS "PrioridadeAcao_grau_ativo_unique" ON "PrioridadeAcao"(grau) WHERE (ativo = true);
CREATE UNIQUE INDEX IF NOT EXISTS "Tema_num_eixo_ativo_unique" ON "Tema"(tema_num, eixo_id) WHERE (ativo = true);
CREATE UNIQUE INDEX IF NOT EXISTS "EntregavelLinkSei_numero_ativo_unique" ON "EntregavelLinkSei"(entregavel_numero) WHERE (ativo = true);
CREATE UNIQUE INDEX IF NOT EXISTS "TipoVinculoHAE_sigla_ativo_unique" ON "TipoVinculoHAE"(sigla) WHERE (ativo = true);