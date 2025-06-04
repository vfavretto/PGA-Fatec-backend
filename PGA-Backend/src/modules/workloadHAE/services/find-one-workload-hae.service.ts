import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkloadHaeRepository } from '../workload-hae.repository';
import { TipoVinculoHAE } from '@prisma/client';

@Injectable()
export class FindOneWorkloadHaeService {
  constructor(private readonly repository: WorkloadHaeRepository) {}

  async execute(id: number): Promise<TipoVinculoHAE> {
    const result = await this.repository.findOne(id);
    if (!result) throw new NotFoundException('Tipo de vínculo HAE não encontrado');
    return result;
  }
}