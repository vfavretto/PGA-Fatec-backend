import { PartialType } from '@nestjs/mapped-types';
import { CreateRoutineParticipantDto } from './create-routine-participant.dto';

export class UpdateRoutineParticipantDto extends PartialType(
  CreateRoutineParticipantDto,
) {}
