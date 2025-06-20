import { Injectable, NotFoundException } from '@nestjs/common';
import { ThematicAxisRepository } from '../thematicAxis.repository';
import { UpdateThematicAxisDto } from '../dto/update-thematicAxis.dto';

@Injectable()
export class UpdateThematicAxisService {
  constructor(private readonly repo: ThematicAxisRepository) {}

  async execute(id: number, data: UpdateThematicAxisDto) {
    const eixo = await this.repo.findOne(id);
    if (!eixo) throw new NotFoundException('Eixo Temático não encontrado');
    return this.repo.update(id, data);
  }
}
