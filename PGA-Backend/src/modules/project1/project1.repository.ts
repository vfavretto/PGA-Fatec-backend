import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class Project1Repository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.acaoProjeto.findMany({
      include: {
        eixo: true,
        pga: true,
        prioridade: true,
        aquisicoes: true,
        etapas: true,
        pessoas: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.acaoProjeto.findUnique({
      where: { acao_projeto_id: id },
      include: {
        eixo: true,
        pga: true,
        prioridade: true,
        aquisicoes: true,
        etapas: true,
        pessoas: true,
      },
    });
  }

  create(data: Prisma.AcaoProjetoUncheckedCreateInput) {
    return this.prisma.acaoProjeto.create({ data });
  }

  update(id: number, data: Prisma.AcaoProjetoUncheckedUpdateInput) {
    return this.prisma.acaoProjeto.update({
      where: { acao_projeto_id: id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.acaoProjeto.delete({
      where: { acao_projeto_id: id },
    });
  }
}
