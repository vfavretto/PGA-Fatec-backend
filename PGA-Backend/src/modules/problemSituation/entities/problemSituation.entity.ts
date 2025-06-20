export class ProblemSituationEntity {
  situacao_id: number;
  codigo_categoria: string;
  descricao: string;
  fonte?: string;
  ativo: boolean;
  ordem?: number;
}
