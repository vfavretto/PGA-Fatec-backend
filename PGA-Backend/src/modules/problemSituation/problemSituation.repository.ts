import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProblemSituationDto } from './dto/create-problemSituation.dto';
import { UpdateProblemSituationDto } from './dto/update-problemSituation.dto';
import { BaseRepository } from '../../common/repositories/base.repository';
import { SituacaoProblema } from '@prisma/client';

@Injectable()
export class ProblemSituationRepository extends BaseRepository<SituacaoProblema> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateProblemSituationDto) {
    return this.prisma.situacaoProblema.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.situacaoProblema.findMany({
      where: this.whereActive(),
      orderBy: { codigo_categoria: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.situacaoProblema.findFirst({
      where: this.whereActive({ situacao_id: id }),
    });
  }

  async update(id: number, data: UpdateProblemSituationDto) {
    return this.prisma.situacaoProblema.update({
      where: { situacao_id: id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.situacaoProblema.update({
      where: { situacao_id: id },
      data: { ativo: false },
    });
  }

  async findByCodigoCategoria(codigo: string) {
    return this.prisma.situacaoProblema.findFirst({
      where: this.whereActive({ codigo_categoria: codigo }),
    });
  }
}
