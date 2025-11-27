import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CreateProject1Dto } from '../dto/create-project1.dto';

@Injectable()
export class CreateProject1Service {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateProject1Dto) {
    const eixo = await this.prisma.eixoTematico.findUnique({
      where: { eixo_id: dto.eixo_id },
    });
    if (!eixo) throw new Error('Eixo temático não encontrado');

    const projetosCount = await this.prisma.acaoProjeto.count({
      where: {
        eixo_id: dto.eixo_id,
        pga_id: dto.pga_id,
        ativo: true,
      },
    });

    const sequencial = (projetosCount + 1).toString().padStart(2, '0');

    const codigo_projeto = `${eixo.numero}${sequencial}`;

    const { situacao_problema_ids, ...projectData } = dto;

    const projeto = await this.prisma.acaoProjeto.create({
      data: {
        ...projectData,
        codigo_projeto,
      },
      include: {
        situacoesProblemas: {
          include: {
            situacaoProblema: true,
          },
        },
      },
    });

    
    if (situacao_problema_ids && situacao_problema_ids.length > 0) {
      for (const situacao_id of situacao_problema_ids) {
        await this.prisma.acaoProjetoSituacaoProblema.create({
          data: {
            acao_projeto_id: projeto.acao_projeto_id,
            situacao_problema_id: situacao_id,
            ativo: true,
          },
        });
      }

      
      return this.prisma.acaoProjeto.findUnique({
        where: { acao_projeto_id: projeto.acao_projeto_id },
        include: {
          situacoesProblemas: {
            include: {
              situacaoProblema: true,
            },
          },
        },
      });
    }

    return projeto;
  }
}
