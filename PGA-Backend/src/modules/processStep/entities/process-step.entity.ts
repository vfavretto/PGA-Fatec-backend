import { StatusVerificacao } from '@prisma/client';

export class ProcessStep {
  etapa_id: string;
  acao_projeto_id: string;
  descricao: string;
  entregavel_id?: string | null;
  numero_ref?: string | null;
  data_verificacao_prevista?: Date | null;
  data_verificacao_realizada?: Date | null;
  status_verificacao?: StatusVerificacao | null;
}
