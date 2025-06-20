import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectPersonDto } from './create-project-person.dto';

export class UpdateProjectPersonDto extends PartialType(
  CreateProjectPersonDto,
) {}
