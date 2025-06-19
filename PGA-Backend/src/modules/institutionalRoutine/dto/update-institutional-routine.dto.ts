import { PartialType } from '@nestjs/mapped-types';
import { CreateInstitutionalRoutineDto } from './create-institutional-routine.dto';

export class UpdateInstitutionalRoutineDto extends PartialType(CreateInstitutionalRoutineDto) {}