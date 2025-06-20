import { Injectable } from '@nestjs/common';
import { WorkloadHaeRepository } from '../workload-hae.repository';
import { TipoVinculoHAE } from '@prisma/client';

@Injectable()
export class FindAllWorkloadHaeService {
  constructor(private readonly repository: WorkloadHaeRepository) {}

  async execute(): Promise<TipoVinculoHAE[]> {
    return this.repository.findAll();
  }
}
