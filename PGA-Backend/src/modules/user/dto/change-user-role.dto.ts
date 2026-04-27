import { IsEnum, IsUUID, IsOptional, ValidateIf } from 'class-validator';
import { TipoUsuario } from '@prisma/client';

export class ChangeUserRoleDto {
  @IsEnum(TipoUsuario, {
    message: 'Tipo de usuário inválido',
  })
  novoTipo: TipoUsuario;

  @ValidateIf((o) => o.novoTipo === 'Diretor')
  @IsUUID('4', { message: 'ID da unidade inválido' })
  unidadeId?: string;

  @IsOptional()
  @IsUUID('4')
  usuarioLogadoId: string;
}
