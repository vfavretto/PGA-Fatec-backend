import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';
import { EntregavelLinkSei } from '@prisma/client';

@Injectable()
export class DeleteDeliverableService {
  constructor(private readonly repository: DeliverableRepository) {}

  async execute(entregavel_id: number): Promise<EntregavelLinkSei> {
    const exists = await this.repository.findOne(entregavel_id);
    if (!exists) throw new NotFoundException('Entregável não encontrado');
    return this.repository.delete(entregavel_id);
  }
}