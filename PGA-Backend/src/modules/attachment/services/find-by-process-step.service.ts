import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';

@Injectable()
export class FindByProcessStepService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(etapaProcessoId: number, user?: any) {
    const active = user?.active_context;
    if (active) return this.attachmentRepository.findByEtapaProcessoWithContext(etapaProcessoId, active);
    return this.attachmentRepository.findByEtapaProcesso(etapaProcessoId);
  }
}
