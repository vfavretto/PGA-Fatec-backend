import { Injectable } from '@nestjs/common';
import { CreateAttachment1Dto } from '../dto/create-attachment1.dto';
import { Attachment1Repository } from '../attachment1.repository';
import { Attachment1 } from '@prisma/client';

@Injectable()
export class CreateAttachment1Service {
  constructor(private readonly attachment1Repository: Attachment1Repository) {}

  async execute(dto: CreateAttachment1Dto): Promise<Attachment1> {
    return this.attachment1Repository.create(dto);
  }
}
