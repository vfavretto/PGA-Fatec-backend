import { Injectable } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';
import { EntregavelLinkSei } from '@prisma/client';

@Injectable()
export class FindAllDeliverableService {
  constructor(private readonly repository: DeliverableRepository) {}

  async execute(user?: any): Promise<EntregavelLinkSei[]> {
    const active = user?.active_context;
    if (active?.tipo === 'unidade') {
      return this.repository.findAllByUnit(active.id);
    }

    if (active?.tipo === 'regional') {
      return this.repository.findAllByRegional(active.id);
    }

    return this.repository.findAll();
  }
}
