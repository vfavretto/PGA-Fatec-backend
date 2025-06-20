import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository';

@Injectable()
export class FindByDeliverableService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(entregavelId: number) {
    return this.attachmentRepository.findByEntregavel(entregavelId);
  }
}
