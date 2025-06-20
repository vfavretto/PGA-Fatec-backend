export class Attachment {
  anexo_id: number;
  etapa_processo_id?: number;
  entregavel_id: number;
  item: string;
  descricao: string;
  quantidade: number;
  preco_unitario_estimado: number;
  preco_total_estimado: number;
  ativo: boolean;
  criado_em: Date;
  atualizado_em: Date;
}