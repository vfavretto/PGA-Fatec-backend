import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class DeletePgaService {
  constructor(
    private readonly pgaRepository: PgaRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const pga = await this.pgaRepository.findOne(id);
    if (!pga) throw new NotFoundException('PGA não encontrado');

    // Verificar se existem ações de projeto vinculadas
    const acoesProjeto = await this.prisma.acaoProjeto.count({
      where: {
        pga_id: id,
        ativo: true
      }
    });

    if (acoesProjeto > 0) {
      throw new ConflictException('Este PGA possui ações de projeto ativas e não pode ser excluído');
    }
    
    // Usar transação para garantir a consistência
    return this.prisma.$transaction(async (tx) => {
      // Inativar situações problema vinculadas
      await tx.pGASituacaoProblema.updateMany({
        where: {
          pga_id: id,
          ativo: true
        },
        data: { ativo: false }
      });
      
      // Soft delete do PGA
      return this.pgaRepository.delete(id);
    });
  }
}