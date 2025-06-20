import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliverableRepository } from '../deliverable.repository';

@Injectable()
export class DeleteDeliverableService {
  constructor(private readonly repo: DeliverableRepository) {}

  async execute(id: number, usuario_id?: number) {
    const deliverable = await this.repo.findOne(id);
    if (!deliverable) throw new NotFoundException('Entregável não encontrado');

    return this.repo.softDelete(id);
  }
}
