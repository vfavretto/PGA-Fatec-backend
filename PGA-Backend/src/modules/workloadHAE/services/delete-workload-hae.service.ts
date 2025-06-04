import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkloadHaeRepository } from '../workload-hae.repository';
import { TipoVinculoHAE } from '@prisma/client';

@Injectable()
export class DeleteWorkloadHaeService {
  constructor(private readonly repository: WorkloadHaeRepository) {}

  async execute(id: number): Promise<TipoVinculoHAE> {
    const exists = await this.repository.findOne(id);
    if (!exists) throw new NotFoundException('Tipo de vínculo HAE não encontrado');
    return this.repository.delete(id);
  }
}