import { Injectable, NotFoundException } from '@nestjs/common';
import { ThematicAxisRepository } from '../thematicAxis.repository';

@Injectable()
export class DeleteThematicAxisService {
  constructor(private readonly repo: ThematicAxisRepository) {}

  async execute(id: string, usuario_id?: string) {
    const eixo = await this.repo.findOne(id);
    if (!eixo) throw new NotFoundException('Eixo Temático não encontrado');

    return this.repo.softDelete(id);
  }
}
