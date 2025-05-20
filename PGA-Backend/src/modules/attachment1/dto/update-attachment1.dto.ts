import { PartialType } from '@nestjs/mapped-types';
import { CreateAttachment1Dto } from './create-attachment1.dto';

export class UpdateAttachment1Dto extends PartialType(CreateAttachment1Dto) {}
