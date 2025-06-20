import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';
import { EntregavelLinkSei } from '@prisma/client';

@Injectable()
export class FindOneDeliverableService {
  constructor(private readonly repository: DeliverableRepository) {}

  async execute(entregavel_id: number): Promise<EntregavelLinkSei> {
    const result = await this.repository.findOne(entregavel_id);
    if (!result) throw new NotFoundException('Entregável não encontrado');
    return result;
  }
}
