import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkloadHaeDto } from './create-workload-hae.dto';

export class UpdateWorkloadHaeDto extends PartialType(CreateWorkloadHaeDto) {}
