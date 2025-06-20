import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';

@Injectable()
export class FindAllAttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute() {
    return this.attachmentRepository.findAll();
  }
}
