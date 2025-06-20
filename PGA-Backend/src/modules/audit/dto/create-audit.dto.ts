import { TipoOperacaoAuditoria } from '@prisma/client';

export class CreateAuditDto {
  tabela: string;
  registro_id: number;
  ano: number;
  operacao: TipoOperacaoAuditoria;
  dados_antes?: any;
  dados_depois?: any;
  usuario_id?: number;
  motivo?: string;
}
