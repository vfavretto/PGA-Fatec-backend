import { IsOptional } from "class-validator";
import { Prisma } from "@prisma/client";

export class UpdateProject1Dto {
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
  objetivos_institucionais_referenciados?: string | Prisma.NullableStringFieldUpdateOperationsInput | null;

  @IsOptional()
  data_inicio?: Date | string | Prisma.NullableDateTimeFieldUpdateOperationsInput | null;

  @IsOptional()
  data_final?: Date | string | Prisma.NullableDateTimeFieldUpdateOperationsInput | null;

  @IsOptional()
  obrigatorio_inclusao?: boolean | Prisma.BoolFieldUpdateOperationsInput;

  @IsOptional()
  obrigatorio_sustentabilidade?: boolean | Prisma.BoolFieldUpdateOperationsInput;

  @IsOptional()
  ativo?: boolean | Prisma.BoolFieldUpdateOperationsInput;
}
