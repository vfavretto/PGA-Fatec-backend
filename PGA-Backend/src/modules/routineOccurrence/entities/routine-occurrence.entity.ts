import { StatusOcorrencia } from '@prisma/client';

export class RoutineOccurrence {
  ocorrencia_id: number;
  rotina_id: number;
  data_realizacao: Date;
  hora_inicio?: Date | null;
  hora_fim?: Date | null;
  local?: string | null;
  pauta?: string | null;
  resultado?: string | null;
  link_ata?: string | null;
  status: StatusOcorrencia;
}
