import { TipoCurso, StatusCurso } from '@prisma/client';

export class Course {
  curso_id: number;
  unidade_id: number;
  nome: string;
  tipo: TipoCurso;
  status: StatusCurso;
  coordenador_id?: number | null;
}
