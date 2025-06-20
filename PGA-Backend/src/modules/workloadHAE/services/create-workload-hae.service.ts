import { Injectable } from '@nestjs/common';
import { WorkloadHaeRepository } from '../workload-hae.repository';
import { CreateWorkloadHaeDto } from '../dto/create-workload-hae.dto';
import { TipoVinculoHAE } from '@prisma/client';

@Injectable()
export class CreateWorkloadHaeService {
  constructor(private readonly repository: WorkloadHaeRepository) {}

  async execute(dto: CreateWorkloadHaeDto): Promise<TipoVinculoHAE> {
    return this.repository.create(dto);
  }
}
