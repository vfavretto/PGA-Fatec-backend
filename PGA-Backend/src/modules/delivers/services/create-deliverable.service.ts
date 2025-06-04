import { Injectable } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';
import { CreateDeliverableDto } from '../dto/create-deliverable.dto';
import { EntregavelLinkSei } from '@prisma/client';

@Injectable()
export class CreateDeliverableService {
  constructor(private readonly repository: DeliverableRepository) {}

  async execute(dto: CreateDeliverableDto): Promise<EntregavelLinkSei> {
    return this.repository.create(dto);
  }
}