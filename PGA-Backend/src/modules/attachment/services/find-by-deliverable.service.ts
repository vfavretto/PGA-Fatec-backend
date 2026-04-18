import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';

@Injectable()
export class FindByDeliverableService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(entregavelId: number, user?: any) {
    const active = user?.active_context;
    if (active) return this.attachmentRepository.findByEntregavelWithContext(entregavelId, active);
    return this.attachmentRepository.findByEntregavel(entregavelId);
  }
}
