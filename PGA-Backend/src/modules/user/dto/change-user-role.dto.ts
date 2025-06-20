import { IsEnum, IsInt, IsOptional, ValidateIf } from 'class-validator';
import { TipoUsuario } from '@prisma/client';

export class ChangeUserRoleDto {
  @IsEnum(TipoUsuario, {
    message: 'Tipo de usuário inválido',
  })
  novoTipo: TipoUsuario;

  @ValidateIf((o) => o.novoTipo === 'Diretor')
  @IsInt({ message: 'ID da unidade inválido' })
  unidadeId?: number;

  @IsOptional()
  @IsInt()
  usuarioLogadoId: number;
}
