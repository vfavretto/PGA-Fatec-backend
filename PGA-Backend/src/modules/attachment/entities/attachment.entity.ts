export class Attachment {
  anexo_id: string;
  etapa_processo_id?: string;
  entregavel_id: string;
  item: string;
  descricao: string;
  quantidade: number;
  preco_unitario_estimado: number;
  preco_total_estimado: number;
  ativo: boolean;
  criado_em: Date;
  atualizado_em: Date;
}
