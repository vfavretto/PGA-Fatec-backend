import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusPGA } from '@prisma/client';
import { PrismaService } from '../../../config/prisma.service';
import { PgaRepository } from '../pga.repository';

@Injectable()
export class PublishPgaService {
  constructor(
    private readonly repository: PgaRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Publica um PGA template: altera o status do template para Publicado e
   * cria uma cópia (EmElaboracao) para cada unidade ativa do sistema.
   */
  async execute(pgaId: string, pessoaId: string) {
    const template = await this.repository.findOne(pgaId);
    if (!template) {
      throw new NotFoundException('PGA não encontrado');
    }

    if (!template.is_template) {
      throw new BadRequestException('Apenas PGAs template podem ser publicados.');
    }

    if (template.status !== StatusPGA.EmElaboracao) {
      throw new BadRequestException(
        `Este PGA template já foi publicado (status atual: ${template.status}).`,
      );
    }

    // Verifica se já há cópias para este template/ano (evita dupla publicação)
    const copiaExistente = await this.prisma.pGA.findFirst({
      where: {
        template_pga_id: pgaId,
        ativo: true,
      },
    });
    if (copiaExistente) {
      throw new BadRequestException(
        'Este PGA template já gerou cópias para as unidades.',
      );
    }

    const unidades = await this.prisma.unidade.findMany({
      where: { ativo: true },
      select: { unidade_id: true },
    });

    if (!unidades.length) {
      throw new BadRequestException('Nenhuma unidade ativa encontrada no sistema.');
    }

    // Usa transação: marca template como Publicado e cria todas as cópias
    return this.prisma.$transaction(async (tx) => {
      await tx.pGA.update({
        where: { pga_id: pgaId },
        data: { status: StatusPGA.Publicado },
      });

      const copias = await Promise.all(
        unidades.map((u) =>
          tx.pGA.create({
            data: {
              unidade_id: u.unidade_id,
              ano: template.ano,
              versao: template.versao,
              analise_cenario: template.analise_cenario,
              configuracoes_snapshot: template.configuracoes_snapshot ?? undefined,
              is_template: false,
              template_pga_id: pgaId,
              status: StatusPGA.EmElaboracao,
              usuario_criacao_id: pessoaId,
              data_limite_submissao: template.data_limite_submissao ?? undefined,
            },
          }),
        ),
      );

      return {
        template_pga_id: pgaId,
        ano: template.ano,
        copias_geradas: copias.length,
        unidades: copias.map((c) => ({ pga_id: c.pga_id, unidade_id: c.unidade_id })),
      };
    });
  }
}
