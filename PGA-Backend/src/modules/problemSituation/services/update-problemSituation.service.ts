import { Injectable, NotFoundException } from '@nestjs/common';
import { ProblemSituationRepository } from '../problemSituation.repository';
import { UpdateProblemSituationDto } from '../dto/update-problemSituation.dto';

@Injectable()
export class UpdateProblemSituationService {
  constructor(private readonly repo: ProblemSituationRepository) {}

  async execute(id: number, data: UpdateProblemSituationDto) {
    const situation = await this.repo.findOne(id);
    if (!situation) throw new NotFoundException('Problem Situation not found');
    return this.repo.update(id, data);
  }
}