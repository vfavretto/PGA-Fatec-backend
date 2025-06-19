import { PartialType } from '@nestjs/mapped-types';
import { CreatePgaDto } from './create-pga.dto';

export class UpdatePgaDto extends PartialType(CreatePgaDto) {}