import { Pessoa } from '@prisma/client';

export class PGA {
  pga_id: number;
  unidade_id: number;
  ano: number;
  versao?: string | null;
  analise_cenario?: string | null;
  data_elaboracao?: Date | null;
  data_parecer_gpr?: Date | null;
  status: string;
  regional_responsavel_id?: number | null;
  parecer_regional?: string | null;
  data_parecer_regional?: Date | null;
  regionalResponsavel?: Pessoa | null;
}
