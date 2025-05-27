import { PartialType } from '@nestjs/mapped-types';
import { CreateProblemSituationDto } from './create-problemSituation.dto';

export class UpdateProblemSituationDto extends PartialType(CreateProblemSituationDto) {}