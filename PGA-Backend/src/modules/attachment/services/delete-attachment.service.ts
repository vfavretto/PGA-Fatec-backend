import { Injectable, NotFoundException } from '@nestjs/common';
import { AttachmentRepository } from '../attachment.repository'; // Corrigido

@Injectable()
export class DeleteAttachmentService {
  // Corrigido
  constructor(private readonly repository: AttachmentRepository) {} // Corrigido

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    // Alterado tipo para number
    const attachment = await this.repository.findOne(id);
    if (!attachment) throw new NotFoundException('Attachment não encontrado');

    return this.repository.delete(id);
  }
}
