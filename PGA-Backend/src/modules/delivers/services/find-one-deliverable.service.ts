import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';
import { EntregavelLinkSei } from '@prisma/client';

@Injectable()
export class FindOneDeliverableService {
  constructor(private readonly repository: DeliverableRepository) {}

  async execute(entregavel_id: number, user?: any): Promise<EntregavelLinkSei> {
    const result = await this.repository.findOneWithContext(entregavel_id, user?.active_context);
    if (!result) throw new NotFoundException('Entregável não encontrado');
    return result;
  }
}
