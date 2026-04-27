import { Pessoa } from '@prisma/client';

export class PGA {
  pga_id: string;
  unidade_id: string | null;
  ano: number;
  versao?: string | null;
  analise_cenario?: string | null;
  data_elaboracao?: Date | null;
  data_parecer_gpr?: Date | null;
  status: string;
  regional_responsavel_id?: string | null;
  parecer_regional?: string | null;
  data_parecer_regional?: Date | null;
  regionalResponsavel?: Pessoa | null;
}
