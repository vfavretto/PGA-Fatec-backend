import { Injectable, NotFoundException } from '@nestjs/common';
import { ProblemSituationRepository } from '../problemSituation.repository';

@Injectable()
export class DeleteProblemSituationService {
  constructor(private readonly repo: ProblemSituationRepository) {}

  async execute(id: number, usuario_id?: number) {
    const situation = await this.repo.findOne(id);
    if (!situation) throw new NotFoundException('Situação Problema não encontrada');
    
    return this.repo.softDelete(id);
  }
}