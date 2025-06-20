import { Injectable, NotFoundException } from '@nestjs/common';
import { Attachment1Repository } from '../attachment1.repository';

@Injectable()
export class DeleteAttachment1Service {
  constructor(private readonly repository: Attachment1Repository) {}

  async execute(id: string, usuarioLogadoId?: number, motivo?: string) {
    const attachment = await this.repository.findOne(id);
    if (!attachment) throw new NotFoundException('Anexo não encontrado');
    
    return this.repository.softDelete(id);
  }
}
