import { StatusVerificacao } from '@prisma/client';

export class ProcessStep {
  etapa_id: number;
  acao_projeto_id: number;
  descricao: string;
  entregavel_id?: number | null;
  numero_ref?: string | null;
  data_verificacao_prevista?: Date | null;
  data_verificacao_realizada?: Date | null;
  status_verificacao?: StatusVerificacao | null;
}
