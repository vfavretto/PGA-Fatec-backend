import { PartialType } from '@nestjs/mapped-types';
import { CreateCpaActionDto } from './create-cpa-action.dto';

export class UpdateCpaActionDto extends PartialType(CreateCpaActionDto) {}