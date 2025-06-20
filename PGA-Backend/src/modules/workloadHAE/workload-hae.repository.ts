import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { TipoVinculoHAE } from '@prisma/client';
import { CreateWorkloadHaeDto } from './dto/create-workload-hae.dto';
import { UpdateWorkloadHaeDto } from './dto/update-workload-hae.dto';

@Injectable()
export class WorkloadHaeRepository extends BaseRepository<TipoVinculoHAE> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateWorkloadHaeDto) {
    return this.prisma.tipoVinculoHAE.create({
      data
    });
  }

  async findAll() {
    return this.prisma.tipoVinculoHAE.findMany({
      where: this.whereActive(),
      orderBy: {
        sigla: 'asc'
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.tipoVinculoHAE.findFirst({
      where: this.whereActive({ id })
    });
  }

  async update(id: number, data: UpdateWorkloadHaeDto) {
    return this.prisma.tipoVinculoHAE.update({
      where: { id },
      data
    });
  }

  async softDelete(id: number) {
    return this.prisma.tipoVinculoHAE.update({
      where: { id },
      data: { ativo: false }
    });
  }
}