import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../config/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";
import { AcaoProjeto } from "@prisma/client";
import { CreateProject1Dto } from "./dto/create-project1.dto";
import { UpdateProject1Dto } from "./dto/update-project1.dto";

@Injectable()
export class Project1Repository extends BaseRepository<AcaoProjeto> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateProject1Dto) {
    return this.prisma.acaoProjeto.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.acaoProjeto.findMany({
      where: this.whereActive(),
      include: {
        eixo: true,
        pga: true,
        prioridade: true,
        tema: true,
        etapas: {
          where: this.whereActive(),
        },
        pessoas: {
          where: this.whereActive(),
          include: {
            pessoa: true,
          },
        },
        situacoesProblemas: {
          where: this.whereActive(),
          include: {
            situacaoProblema: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.acaoProjeto.findFirst({
      where: this.whereActive({ acao_projeto_id: id }),
      include: {
        eixo: true,
        pga: true,
        prioridade: true,
        tema: true,
        etapas: {
          where: this.whereActive(),
        },
        pessoas: {
          where: this.whereActive(),
          include: {
            pessoa: true,
          },
        },
        situacoesProblemas: {
          where: this.whereActive(),
          include: {
            situacaoProblema: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateProject1Dto) {
    return this.prisma.acaoProjeto.update({
      where: { acao_projeto_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.acaoProjeto.update({
      where: { acao_projeto_id: id },
      data: { ativo: false },
    });
  }

  async findByPgaId(pgaId: number) {
    return this.prisma.acaoProjeto.findMany({
      where: this.whereActive({ pga_id: pgaId }),
      include: {
        eixo: true,
        prioridade: true,
        tema: true,
      },
    });
  }
}
