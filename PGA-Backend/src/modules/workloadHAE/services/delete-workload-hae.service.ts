import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { WorkloadHaeRepository } from '../workload-hae.repository';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class DeleteWorkloadHaeService {
  constructor(
    private readonly repository: WorkloadHaeRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const workloadHae = await this.repository.findOne(id);
    if (!workloadHae)
      throw new NotFoundException('Tipo de vínculo HAE não encontrado');

    // Verificar se existem projetos pessoas com esse tipo de vínculo
    const projetosPessoas = await this.prisma.projetoPessoa.count({
      where: {
        tipo_vinculo_hae_id: id,
        ativo: true,
      },
    });

    if (projetosPessoas > 0) {
      throw new ConflictException(
        'Este tipo de vínculo HAE está sendo usado em vínculos de projeto ativos e não pode ser excluído',
      );
    }

    return this.repository.softDelete(id);
  }
}
