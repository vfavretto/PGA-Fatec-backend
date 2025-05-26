import { Injectable } from '@nestjs/common';
import { ProblemSituationRepository } from '../problemSituation.repository';
import { CreateProblemSituationDto } from '../dto/create-problemSituation.dto';

@Injectable()
export class CreateProblemSituationService {
  constructor(private readonly repo: ProblemSituationRepository) {}

  async execute(data: CreateProblemSituationDto) {
    return this.repo.create(data);
  }
}