import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoOperacaoAuditoria } from '@prisma/client';

export class CreateAuditDto {
  @ApiProperty({
    description: 'Nome da tabela auditada',
    example: 'PGA'
  })
  tabela: string;

  @ApiProperty({
    description: 'ID do registro auditado',
    example: 1,
    type: 'integer'
  })
  registro_id: number;

  @ApiProperty({
    description: 'Ano de referência da auditoria',
    example: 2024,
    type: 'integer'
  })
  ano: number;

  @ApiProperty({
    description: 'Tipo da operação auditada',
    enum: TipoOperacaoAuditoria,
    example: 'CRIACAO'
  })
  operacao: TipoOperacaoAuditoria;

  @ApiPropertyOptional({
    description: 'Dados antes da operação (para UPDATE/DELETE)',
    example: { nome: 'Valor anterior' }
  })
  dados_antes?: any;

  @ApiPropertyOptional({
    description: 'Dados depois da operação (para CREATE/UPDATE)',
    example: { nome: 'Novo valor' }
  })
  dados_depois?: any;

  @ApiPropertyOptional({
    description: 'ID do usuário responsável pela operação',
    example: 5,
    type: 'integer'
  })
  usuario_id?: number;

  @ApiPropertyOptional({
    description: 'Motivo da operação',
    example: 'Correção de dados'
  })
  motivo?: string;
}