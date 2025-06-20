import { Injectable, NotFoundException } from '@nestjs/common';
import { Project1Repository } from '../project1.repository';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class DeleteProject1Service {
  constructor(
    private readonly project1Repository: Project1Repository,
    private readonly prisma: PrismaService
  ) {}

  async execute(id: number, usuarioLogadoId?: number, motivo?: string) {
    const project = await this.project1Repository.findOne(id);
    if (!project) throw new NotFoundException('Ação de projeto não encontrada');
    
    // Usar transação para garantir consistência
    return this.prisma.$transaction(async (tx) => {
      // Inativar etapas vinculadas
      await tx.etapaProcesso.updateMany({
        where: {
          acao_projeto_id: id,
          ativo: true
        },
        data: { ativo: false }
      });
      
      // Inativar pessoas vinculadas ao projeto
      await tx.projetoPessoa.updateMany({
        where: {
          acao_projeto_id: id,
          ativo: true
        },
        data: { ativo: false }
      });
      
      // Inativar aquisições vinculadas
      await tx.aquisicao.updateMany({
        where: {
          acao_projeto_id: id,
          ativo: true
        },
        data: { ativo: false }
      });
      
      // Inativar situações problema vinculadas
      await tx.acaoProjetoSituacaoProblema.updateMany({
        where: {
          acao_projeto_id: id,
          ativo: true
        },
        data: { ativo: false }
      });
      
      // Soft delete da ação de projeto
      return this.project1Repository.delete(id);
    });
  }
}