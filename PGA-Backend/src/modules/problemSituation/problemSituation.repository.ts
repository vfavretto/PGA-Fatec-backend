import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProblemSituationDto } from './dto/create-problemSituation.dto';
import { UpdateProblemSituationDto } from './dto/update-problemSituation.dto';

@Injectable()
export class ProblemSituationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProblemSituationDto) {
    return this.prisma.situacaoProblema.create({ data: {
      pga_id: data.pga_id,
      descricao: data.descricao,
      fonte: data.fonte,
    } });
  }

  async findAll() {
    return this.prisma.situacaoProblema.findMany();
  }

  async findOne(id: number) {
    return this.prisma.situacaoProblema.findUnique({ where: { situacao_id: id } });
  }

  async update(id: number, data: UpdateProblemSituationDto) {
    return this.prisma.situacaoProblema.update({
      where: { situacao_id: id },
      data: {
        pga_id: data.pga_id,
        descricao: data.descricao,
        fonte: data.fonte,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.situacaoProblema.delete({ where: { situacao_id: id } });
  }
}