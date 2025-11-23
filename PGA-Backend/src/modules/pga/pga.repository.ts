import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PGA } from '@prisma/client';
import { CreatePgaDto } from './dto/create-pga.dto';
import { UpdatePgaDto } from './dto/update-pga.dto';

@Injectable()
export class PgaRepository extends BaseRepository<PGA> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreatePgaDto) {
    return this.prisma.pGA.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.pGA.findMany({
      where: this.whereActive(),
      include: {
        unidade: true,
        regionalResponsavel: true,
      },
      orderBy: [{ ano: 'desc' }, { unidade: { nome_completo: 'asc' } }],
    });
  }

  async findOne(id: number) {
    return this.prisma.pGA.findFirst({
      where: this.whereActive({ pga_id: id }),
      include: {
        unidade: true,
        regionalResponsavel: true,
        situacoesProblemas: {
          where: this.whereActive(),
          include: {
            situacaoProblema: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdatePgaDto) {
    return this.prisma.pGA.update({
      where: { pga_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.pGA.update({
      where: { pga_id: id },
      data: { ativo: false } as any,
    });
  }

  async findByAnoAndUnidade(ano: number, unidadeId: number) {
    return this.prisma.pGA.findFirst({
      where: this.whereActive({
        ano,
        unidade_id: unidadeId,
      }),
      include: {
        unidade: true,
      },
    });
  }
}
