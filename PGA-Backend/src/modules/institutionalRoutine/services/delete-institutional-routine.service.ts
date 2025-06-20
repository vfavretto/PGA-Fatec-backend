import { Injectable, NotFoundException } from '@nestjs/common';
import { InstitutionalRoutineRepository } from '../institutional-routine.repository';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class DeleteInstitutionalRoutineService {
  constructor(
    private readonly repository: InstitutionalRoutineRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const routine = await this.repository.findOne(id);
    if (!routine) throw new NotFoundException('Rotina institucional não encontrada');
    
    return this.prisma.$transaction(async (tx) => {
      await tx.rotinaOcorrencia.updateMany({
        where: {
          rotina_id: id,
          ativo: true
        },
        data: { ativo: false }
      });

      await tx.rotinaParticipante.updateMany({
        where: {
          rotina_id: id,
          ativo: true
        },
        data: { ativo: false }
      });

      return this.repository.softDelete(id);
    });
  }
}