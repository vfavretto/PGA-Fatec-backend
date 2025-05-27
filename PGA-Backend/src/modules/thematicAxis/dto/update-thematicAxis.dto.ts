import { PartialType } from '@nestjs/mapped-types';
import { CreateThematicAxisDto } from './create-thematicAxis.dto';

export class UpdateThematicAxisDto extends PartialType(CreateThematicAxisDto) {}