import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';
import { UpdateAttachmentDto } from '../dto/update-attachment.dto';
@Injectable()
export class UpdateAttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(id: number, data: UpdateAttachmentDto) {
    return this.attachmentRepository.update(id, data);
  }
}
