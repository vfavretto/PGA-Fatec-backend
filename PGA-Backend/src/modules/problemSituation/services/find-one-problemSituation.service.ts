import { Injectable } from '@nestjs/common';
import { ProblemSituationRepository } from '../problemSituation.repository';

@Injectable()
export class FindOneProblemSituationService {
  constructor(private readonly repo: ProblemSituationRepository) {}

  async execute(id: number) {
    return this.repo.findOne(id);
  }
}