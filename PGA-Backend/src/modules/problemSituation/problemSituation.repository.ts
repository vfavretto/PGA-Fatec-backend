import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProblemSituationDto } from './dto/create-problemSituation.dto';
import { UpdateProblemSituationDto } from './dto/update-problemSituation.dto';

@Injectable()
export class ProblemSituationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProblemSituationDto) {
    return this.prisma.situacaoProblema.create({
      data: {
        codigo_categoria: data.codigo_categoria,
        descricao: data.descricao,
        fonte: data.fonte,
        ordem: data.ordem,
      },
    });
  }

  async findAll() {
    return this.prisma.situacaoProblema.findMany({
      where: { ativo: true },
      orderBy: { codigo_categoria: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.situacaoProblema.findUnique({
      where: { situacao_id: id },
    });
  }

  async update(id: number, data: UpdateProblemSituationDto) {
    return this.prisma.situacaoProblema.update({
      where: { situacao_id: id },
      data: {
        codigo_categoria: data.codigo_categoria,
        descricao: data.descricao,
        fonte: data.fonte,
        ativo: data.ativo,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.situacaoProblema.update({
      where: { situacao_id: id },
      data: { ativo: false },
    });
  }

  async findByCodigoCategoria(codigo: string) {
    return this.prisma.situacaoProblema.findFirst({
      where: {
        codigo_categoria: codigo,
        ativo: true,
      },
    });
  }
}
