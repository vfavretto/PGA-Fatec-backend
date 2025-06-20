import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { EtapaProcesso } from '@prisma/client';
import { CreateProcessStepDto } from './dto/create-process-step.dto';
import { UpdateProcessStepDto } from './dto/update-process-step.dto';

@Injectable()
export class ProcessStepRepository extends BaseRepository<EtapaProcesso> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateProcessStepDto) {
    return this.prisma.etapaProcesso.create({
      data
    });
  }

  async findAll() {
    return this.prisma.etapaProcesso.findMany({
      where: this.whereActive(),
      include: {
        acaoProjeto: true,
        entregavel_link_sei: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.etapaProcesso.findFirst({
      where: this.whereActive({ etapa_id: id }),
      include: {
        acaoProjeto: true,
        entregavel_link_sei: true
      }
    });
  }

  async update(id: number, data: UpdateProcessStepDto) {
    return this.prisma.etapaProcesso.update({
      where: { etapa_id: id },
      data
    });
  }

  async softDelete(id: number) {
    return this.prisma.etapaProcesso.update({
      where: { etapa_id: id },
      data: { ativo: false }
    });
  }

  async findByProjectId(projectId: number) {
    return this.prisma.etapaProcesso.findMany({
      where: this.whereActive({ acao_projeto_id: projectId }),
      include: {
        entregavel_link_sei: true
      },
      orderBy: {
        data_verificacao_prevista: 'asc'
      }
    });
  }
}