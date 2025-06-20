import { Injectable } from '@nestjs/common';
import { CreateAttachmentDto } from '../dto/create-attachment.dto';
import { AttachmentRepository } from '../attachment.repository';
import { Anexo } from '@prisma/client';

@Injectable()
export class CreateAttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(data: CreateAttachmentDto): Promise<Anexo> {
    return this.attachmentRepository.create(data);
  }
}
