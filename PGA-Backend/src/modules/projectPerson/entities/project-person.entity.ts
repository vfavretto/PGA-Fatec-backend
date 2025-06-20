import { PapelProjeto } from '@prisma/client';

export class ProjectPerson {
  projeto_pessoa_id: number;
  acao_projeto_id: number;
  pessoa_id: number;
  papel: PapelProjeto;
  carga_horaria_semanal?: number | null;
  tipo_vinculo_hae_id?: number | null;
}
