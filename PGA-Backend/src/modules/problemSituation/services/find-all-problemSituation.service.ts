import { Injectable } from '@nestjs/common';
import { ProblemSituationRepository } from '../problemSituation.repository';

@Injectable()
export class FindAllProblemSituationService {
  constructor(private readonly repo: ProblemSituationRepository) {}

  async execute() {
    return this.repo.findAll();
  }
}
