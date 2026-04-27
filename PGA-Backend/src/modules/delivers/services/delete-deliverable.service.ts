import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';

@Injectable()
export class DeleteDeliverableService {
  constructor(private readonly repo: DeliverableRepository) {}

  async execute(id: string, usuario_id?: string) {
    const deliverable = await this.repo.findOne(id);
    if (!deliverable) throw new NotFoundException('Entregável não encontrado');

    return this.repo.softDelete(id);
  }
}
