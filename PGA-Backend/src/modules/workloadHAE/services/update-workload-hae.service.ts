import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkloadHaeRepository } from '../workload-hae.repository';
import { UpdateWorkloadHaeDto } from '../dto/update-workload-hae.dto';
import { TipoVinculoHAE } from '@prisma/client';

@Injectable()
export class UpdateWorkloadHaeService {
  constructor(private readonly repository: WorkloadHaeRepository) {}

  async execute(id: number, dto: UpdateWorkloadHaeDto): Promise<TipoVinculoHAE> {
    const exists = await this.repository.findOne(id);
    if (!exists) throw new NotFoundException('Tipo de vínculo HAE não encontrado');
    return this.repository.update(id, dto);
  }
}