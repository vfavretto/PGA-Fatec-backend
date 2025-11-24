import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';

@Injectable()
export class FindOneAttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}
  async execute(id: number, user?: any) {
    return this.attachmentRepository.findOneWithContext(id, user?.active_context);
  }
}
