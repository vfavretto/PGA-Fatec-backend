import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UnitRepository } from '../unit.repository';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class DeleteUnitService {
  constructor(
    private readonly unitRepository: UnitRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const unit = await this.unitRepository.findOne(id);
    if (!unit) throw new NotFoundException('Unidade não encontrada');

    const pgasAtivos = await this.prisma.pGA.count({
      where: {
        unidade_id: id,
        ativo: true
      }
    });
    
    if (pgasAtivos > 0) {
      throw new ConflictException('Esta unidade possui PGAs ativos e não pode ser excluída');
    }
    
    return this.unitRepository.softDelete(id);
  }
}