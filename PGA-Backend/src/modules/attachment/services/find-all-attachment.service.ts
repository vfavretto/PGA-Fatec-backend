import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';

@Injectable()
export class FindAllAttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}
  async execute(user?: any) {
    const active = user?.active_context;
    if (active?.tipo === 'unidade') return this.attachmentRepository.findAllByUnit(active.id);
    if (active?.tipo === 'regional') return this.attachmentRepository.findAllByRegional(active.id);
    return this.attachmentRepository.findAll();
  }
}
