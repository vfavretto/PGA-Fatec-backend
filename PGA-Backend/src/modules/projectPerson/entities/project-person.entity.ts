import { PapelProjeto } from '@prisma/client';

export class ProjectPerson {
  projeto_pessoa_id: string;
  acao_projeto_id: string;
  pessoa_id: string;
  papel: PapelProjeto;
  carga_horaria_semanal?: number | null;
  tipo_vinculo_hae_id?: string | null;
}
