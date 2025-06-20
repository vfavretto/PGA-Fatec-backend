export class PGA {
  pga_id: number;
  unidade_id: number;
  ano: number;
  versao?: string | null;
  analise_cenario?: string | null;
  data_elaboracao?: Date | null;
  data_parecer_gpr?: Date | null;
  status: string;
}
