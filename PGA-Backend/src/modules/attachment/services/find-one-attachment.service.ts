import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';

@Injectable()
export class FindOneAttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(id: number) {
    return this.attachmentRepository.findOne(id);
  }
}
