import { PartialType } from '@nestjs/mapped-types';
import { CreateRoutineOccurrenceDto } from './create-routine-occurrence.dto';

export class UpdateRoutineOccurrenceDto extends PartialType(CreateRoutineOccurrenceDto) {}