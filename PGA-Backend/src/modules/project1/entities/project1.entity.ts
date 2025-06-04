export class AcaoProjeto {
  acao_projeto_id: number;
  pga_id: number;
  eixo_id: number;
  prioridade_id: number;
  tema: string;
  o_que_sera_feito: string;
  por_que_sera_feito: string;
  data_inicio?: Date;
  data_final?: Date;
  objetivos_institucionais_referenciados?: string;
  obrigatorio_inclusao: boolean;
  obrigatorio_sustentabilidade: boolean;

  eixo?: any;
  pga?: any;
  prioridade?: any;
  aquisicoes?: any[];
  etapas?: any[];
  pessoas?: any[];
}
