import { Pessoa } from '@prisma/client';

export class PGA {
  pga_id: string;
  numero?: number;
  unidade_id: string | null;
  ano: number;
  versao?: string | null;
  analise_cenario?: string | null;
  data_elaboracao?: Date | null;
  data_parecer_gpr?: Date | null;
  status: string;

  // Template
  is_template: boolean;
  template_pga_id?: string | null;
  data_limite_submissao?: Date | null;

  // Revisão Regional
  regional_responsavel_id?: string | null;
  parecer_regional?: string | null;
  data_parecer_regional?: Date | null;
  regionalResponsavel?: Pessoa | null;

  // Revisão CPS
  parecer_cps?: string | null;
  cps_aprovador_id?: string | null;
  data_parecer_cps?: Date | null;
  cpsAprovador?: Pessoa | null;

  // Metadados
  ativo?: boolean;
  usuario_criacao_id?: string | null;
}
