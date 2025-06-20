import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';

@Injectable()
export class FindByProcessStepService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(etapaProcessoId: number) {
    return this.attachmentRepository.findByEtapaProcesso(etapaProcessoId);
  }
}