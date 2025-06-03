import { PartialType } from '@nestjs/mapped-types';
import { CreatePriorityActionDto } from './create-priority-action.dto';

export class UpdatePriorityActionDto extends PartialType(CreatePriorityActionDto) {}