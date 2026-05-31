import { Injectable } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';
import { EntregavelLinkSei } from '@prisma/client';

@Injectable()
export class FindAllDeliverableService {
  constructor(private readonly repository: DeliverableRepository) {}

  async execute(): Promise<EntregavelLinkSei[]> {
    return this.repository.findAll();
  }
}
