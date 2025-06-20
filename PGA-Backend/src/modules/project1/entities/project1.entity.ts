import { EixoTematico, EtapaProcesso, PGA, PrioridadeAcao, ProjetoPessoa, SituacaoProblema, Tema } from "@prisma/client";

export class AcaoProjeto {
  acao_projeto_id: number;
  codigo_projeto: string;
  nome_projeto?: string;
  pga_id: number;
  eixo_id: number;
  prioridade_id: number;
  tema_id: number;
  o_que_sera_feito: string;
  por_que_sera_feito: string;
  data_inicio?: Date | null;
  data_final?: Date | null;
  objetivos_institucionais_referenciados?: string | null;
  obrigatorio_inclusao: boolean;
  obrigatorio_sustentabilidade: boolean;
  ativo: boolean;
  custo_total_estimado?: number | null;
  fonte_recursos?: string | null;

  eixo?: EixoTematico;
  tema?: Tema;
  pga?: PGA;
  prioridade?: PrioridadeAcao;
  situacoesProblemas?: SituacaoProblema[];
  etapas?: EtapaProcesso[];
  pessoas?: ProjetoPessoa[];
}
