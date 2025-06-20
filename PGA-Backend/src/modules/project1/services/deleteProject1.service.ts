import { Injectable, NotFoundException } from '@nestjs/common';
import { Project1Repository } from '../project1.repository';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class DeleteProject1Service {
  constructor(
    private readonly project1Repository: Project1Repository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const project = await this.project1Repository.findOne(id);
    if (!project) throw new NotFoundException('Ação de projeto não encontrada');

    return this.prisma.$transaction(async (tx) => {
      await tx.etapaProcesso.updateMany({
        where: {
          acao_projeto_id: id,
          ativo: true,
        },
        data: { ativo: false },
      });

      await tx.projetoPessoa.updateMany({
        where: {
          acao_projeto_id: id,
          ativo: true,
        },
        data: { ativo: false },
      });

      // Corrigido: atualizar attachments em vez de aquisicao
      await tx.anexo.updateMany({
        where: {
          etapaProcesso: {
            acao_projeto_id: id,
          },
          ativo: true,
        },
        data: { ativo: false },
      });

      await tx.acaoProjetoSituacaoProblema.updateMany({
        where: {
          acao_projeto_id: id,
          ativo: true,
        },
        data: { ativo: false },
      });

      return this.project1Repository.delete(id);
    });
  }
}
