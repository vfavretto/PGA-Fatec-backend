import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThemeDto {
  @ApiProperty({
    description: 'Número identificador do tema',
    example: 1,
    type: 'integer'
  })
  @IsInt()
  tema_num: number;

  @ApiProperty({
    description: 'ID do eixo temático ao qual o tema pertence',
    example: 2,
    type: 'integer'
  })
  @IsUUID('4')
  eixo_id: string;

  @ApiProperty({
    description: 'Descrição do tema',
    example: 'Inclusão e Acessibilidade',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;
}
