import { IsIn, IsOptional, IsString } from 'class-validator';

export class SelectContextDto {
  @IsIn(['unidade', 'regional', 'global'])
  tipo: 'unidade' | 'regional' | 'global';

  @IsOptional()
  @IsString()
  id?: string;
}
