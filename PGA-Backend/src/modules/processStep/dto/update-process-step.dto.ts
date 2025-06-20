import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessStepDto } from './create-process-step.dto';

export class UpdateProcessStepDto extends PartialType(CreateProcessStepDto) {}
