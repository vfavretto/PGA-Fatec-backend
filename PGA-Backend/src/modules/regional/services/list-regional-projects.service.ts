import { Injectable } from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';
import { RegionalProjectQueryDto } from '../dto/regional-project-query.dto';

@Injectable()
export class ListRegionalProjectsService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: number, filters: RegionalProjectQueryDto) {
    return this.repository.findProjectsByRegional(regionalId, filters);
  }
}

