import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { TipoUsuario } from '@prisma/client';

export class ProcessAccessRequestDto {
  @IsNotEmpty({ message: 'O status é obrigatório' })
  @IsEnum(['Aprovada', 'Rejeitada'], {
    message: 'Status inválido. Deve ser "Aprovada" ou "Rejeitada"'
  })
  status: 'Aprovada' | 'Rejeitada';

  @ValidateIf(o => o.status === 'Aprovada')
  @IsNotEmpty({ message: 'Tipo de usuário é obrigatório para aprovar uma solicitação' })
  @IsEnum(TipoUsuario, {
    message: 'Tipo de usuário inválido. Verifique os valores permitidos.'
  })
  tipo_usuario?: TipoUsuario;

  @ValidateIf(o => o.tipo_usuario === 'Diretor')
  @IsNotEmpty({ message: 'A unidade é obrigatória para diretores' })
  unidade_id: number;
}