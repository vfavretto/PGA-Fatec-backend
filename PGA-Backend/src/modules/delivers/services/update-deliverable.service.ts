import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';
import { UpdateDeliverableDto } from '../dto/update-deliverable.dto';
import { EntregavelLinkSei } from '@prisma/client';

@Injectable()
export class UpdateDeliverableService {
  constructor(private readonly repository: DeliverableRepository) {}

  async execute(entregavel_id: number, dto: UpdateDeliverableDto): Promise<EntregavelLinkSei> {
    const exists = await this.repository.findOne(entregavel_id);
    if (!exists) throw new NotFoundException('Entregável não encontrado');
    return this.repository.update(entregavel_id, dto);
  }
}