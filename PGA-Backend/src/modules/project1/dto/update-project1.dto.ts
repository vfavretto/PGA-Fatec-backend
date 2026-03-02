import { IsOptional, IsArray, IsNumber } from 'class-validator';
import { Prisma, StatusProjetoRegional } from '@prisma/client';

export class UpdateProject1Dto {
  @IsOptional()
  codigo_projeto?: string | Prisma.StringFieldUpdateOperationsInput;

  @IsOptional()
  nome_projeto?:
    | string
    | Prisma.NullableStringFieldUpdateOperationsInput
    | null;

  @IsOptional()
  pga_id?: number | Prisma.IntFieldUpdateOperationsInput;

  @IsOptional()
  eixo_id?: number | Prisma.IntFieldUpdateOperationsInput;

  @IsOptional()
  prioridade_id?: number | Prisma.IntFieldUpdateOperationsInput;

  @IsOptional()
  tema_id?: number | Prisma.IntFieldUpdateOperationsInput;

  @IsOptional()
  o_que_sera_feito?: string | Prisma.StringFieldUpdateOperationsInput;

  @IsOptional()
  por_que_sera_feito?: string | Prisma.StringFieldUpdateOperationsInput;

  @IsOptional()
  objetivos_institucionais_referenciados?:
    | string
    | Prisma.NullableStringFieldUpdateOperationsInput
    | null;

  @IsOptional()
  data_inicio?:
    | Date
    | string
    | Prisma.NullableDateTimeFieldUpdateOperationsInput
    | null;

  @IsOptional()
  data_final?:
    | Date
    | string
    | Prisma.NullableDateTimeFieldUpdateOperationsInput
    | null;

  @IsOptional()
  obrigatorio_inclusao?: boolean | Prisma.BoolFieldUpdateOperationsInput;

  @IsOptional()
  obrigatorio_sustentabilidade?:
    | boolean
    | Prisma.BoolFieldUpdateOperationsInput;

  @IsOptional()
  custo_total_estimado?:
    | string
    | number
    | Prisma.NullableDecimalFieldUpdateOperationsInput
    | null;

  @IsOptional()
  fonte_recursos?:
    | string
    | Prisma.NullableStringFieldUpdateOperationsInput
    | null;

  @IsOptional()
  ativo?: boolean | Prisma.BoolFieldUpdateOperationsInput;

  @IsOptional()
  status_regional?:
    | StatusProjetoRegional
    | Prisma.EnumStatusProjetoRegionalFieldUpdateOperationsInput;

  @IsOptional()
  parecer_regional?:
    | string
    | Prisma.NullableStringFieldUpdateOperationsInput
    | null;

  @IsOptional()
  data_parecer_regional?:
    | Date
    | string
    | Prisma.NullableDateTimeFieldUpdateOperationsInput
    | null;

  @IsOptional()
  regional_responsavel_id?:
    | number
    | Prisma.NullableIntFieldUpdateOperationsInput
    | null;

  @IsOptional()
  @IsArray()
  situacoes_problema_ids?: number[];

  @IsOptional()
  @IsArray()
  pessoas?: Array<{
    pessoa_id: number;
    papel: 'Responsavel' | 'Colaborador';
    carga_horaria_semanal?: number | null;
    tipo_vinculo_hae_id?: number | null;
    projeto_pessoa_id?: number;
  }>;

  @IsOptional()
  @IsArray()
  etapas?: Array<{
    descricao: string;
    entregavel_id?: number | null;
    numero_ref?: string | null;
    status_verificacao?: string | null;
    data_verificacao_prevista?: string | null;
    data_verificacao_realizada?: string | null;
    etapa_id?: number;
  }>;
}
