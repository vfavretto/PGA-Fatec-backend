import { IsIn, IsOptional, IsNumber } from 'class-validator';

export class SelectContextDto {
  @IsIn(['unidade', 'regional', 'global'])
  tipo: 'unidade' | 'regional' | 'global';

  @IsOptional()
  @IsNumber()
  id?: number;
}
