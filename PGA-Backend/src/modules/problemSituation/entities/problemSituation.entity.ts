export class ProblemSituationEntity {
  situacao_id: string;
  codigo_categoria: string;
  descricao: string;
  fonte?: string;
  ativo: boolean;
  ordem?: number;
}
