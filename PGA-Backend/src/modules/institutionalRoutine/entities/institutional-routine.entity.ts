import { TipoRotina, PeriodicidadeRotina, StatusRotina } from '@prisma/client';

export class InstitutionalRoutine {
  rotina_id: string;
  pga_id: string;
  curso_id?: string | null;
  tipo_rotina: TipoRotina;
  titulo: string;
  descricao: string;
  periodicidade: PeriodicidadeRotina;
  data_inicio?: Date | null;
  data_fim?: Date | null;
  responsavel_id: string;
  entregavel_esperado?: string | null;
  status: StatusRotina;
}
