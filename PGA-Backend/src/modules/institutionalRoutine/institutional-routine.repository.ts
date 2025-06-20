import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { RotinaInstitucional } from '@prisma/client';
import { CreateInstitutionalRoutineDto } from './dto/create-institutional-routine.dto';
import { UpdateInstitutionalRoutineDto } from './dto/update-institutional-routine.dto';

@Injectable()
export class InstitutionalRoutineRepository extends BaseRepository<RotinaInstitucional> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateInstitutionalRoutineDto) {
    return this.prisma.rotinaInstitucional.create({
      data
    });
  }

  async findAll() {
    return this.prisma.rotinaInstitucional.findMany({
      where: this.whereActive(),
      include: {
        curso: true,
        pga: true,
        responsavel: true,
        ocorrencias: {
          where: this.whereActive()
        },
        participantes: {
          where: this.whereActive(),
          include: {
            pessoa: true
          }
        }
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.rotinaInstitucional.findFirst({
      where: this.whereActive({ rotina_id: id }),
      include: {
        curso: true,
        pga: true,
        responsavel: true,
        ocorrencias: {
          where: this.whereActive()
        },
        participantes: {
          where: this.whereActive(),
          include: {
            pessoa: true
          }
        }
      }
    });
  }

  async update(id: number, data: UpdateInstitutionalRoutineDto) {
    return this.prisma.rotinaInstitucional.update({
      where: { rotina_id: id },
      data
    });
  }

  async softDelete(id: number) {
    return this.prisma.rotinaInstitucional.update({
      where: { rotina_id: id },
      data: { ativo: false }
    });
  }

  async findByPgaId(pgaId: number) {
    return this.prisma.rotinaInstitucional.findMany({
      where: this.whereActive({ pga_id: pgaId }),
      include: {
        curso: true,
        responsavel: true
      }
    });
  }
}