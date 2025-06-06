import { TipoRotina, PeriodicidadeRotina, StatusRotina } from '@prisma/client';

export class InstitutionalRoutine {
  rotina_id: number;
  pga_id: number;
  curso_id?: number | null;
  tipo_rotina: TipoRotina;
  titulo: string;
  descricao: string;
  periodicidade: PeriodicidadeRotina;
  data_inicio?: Date | null;
  data_fim?: Date | null;
  responsavel_id: number;
  entregavel_esperado?: string | null;
  status: StatusRotina;
}