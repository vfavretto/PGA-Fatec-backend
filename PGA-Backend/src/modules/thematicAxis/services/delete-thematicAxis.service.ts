import { Injectable, NotFoundException } from '@nestjs/common';
import { ThematicAxisRepository } from '../thematicAxis.repository';

@Injectable()
export class DeleteThematicAxisService {
  constructor(private readonly repo: ThematicAxisRepository) {}

  async execute(id: number) {
    const eixo = await this.repo.findOne(id);
    if (!eixo) throw new NotFoundException('Eixo Temático não encontrado');
    return this.repo.remove(id);
  }
}