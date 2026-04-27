import { TipoCurso, StatusCurso } from '@prisma/client';

export class Course {
  curso_id: string;
  unidade_id: string;
  nome: string;
  tipo: TipoCurso;
  status: StatusCurso;
  coordenador_id?: string | null;
}
