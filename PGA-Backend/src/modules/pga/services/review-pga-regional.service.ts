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
export class ReviewPgaRegionalService {
  constructor(
    private readonly repository: PgaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async aprovar(pgaId: string, pessoaId: string, parecer?: string) {
    const pga = await this.repository.findOne(pgaId);
    if (!pga) throw new NotFoundException('PGA não encontrado');

    if (pga.status !== StatusPGA.Submetido) {
      throw new BadRequestException(
        `PGA não está aguardando revisão regional (status atual: ${pga.status}).`,
      );
    }

    await this.checkRegionalAccess(pga.unidade_id, pessoaId);

    return this.repository.updateWorkflow(pgaId, {
      status: StatusPGA.AguardandoCPS,
      parecer_regional: parecer ?? null,
      data_parecer_regional: new Date(),
      regionalResponsavel: { connect: { pessoa_id: pessoaId } },
    });
  }

  async reprovar(pgaId: string, pessoaId: string, parecer: string) {
    if (!parecer?.trim()) {
      throw new BadRequestException(
        'O parecer é obrigatório ao reprovar o PGA.',
      );
    }

    const pga = await this.repository.findOne(pgaId);
    if (!pga) throw new NotFoundException('PGA não encontrado');

    if (pga.status !== StatusPGA.Submetido) {
      throw new BadRequestException(
        `PGA não está aguardando revisão regional (status atual: ${pga.status}).`,
      );
    }

    await this.checkRegionalAccess(pga.unidade_id, pessoaId);

    return this.repository.updateWorkflow(pgaId, {
      status: StatusPGA.Reprovado,
      parecer_regional: parecer,
      data_parecer_regional: new Date(),
      regionalResponsavel: { connect: { pessoa_id: pessoaId } },
    });
  }

  private async checkRegionalAccess(
    unidadeId: string | null,
    pessoaId: string,
  ) {
    if (!unidadeId) {
      throw new BadRequestException(
        'PGA template não pode ser revisado pela regional.',
      );
    }

    const unidade = await this.prisma.unidade.findUnique({
      where: { unidade_id: unidadeId },
      select: { regional_id: true },
    });
    if (!unidade) throw new NotFoundException('Unidade do PGA não encontrada');

    // Verifica se o usuário Regional tem vínculo com a regional desta unidade
    const vinculo = await this.prisma.pessoaRegional.findFirst({
      where: {
        pessoa_id: pessoaId,
        regional_id: unidade.regional_id,
        ativo: true,
      },
    });

    if (!vinculo) {
      throw new ForbiddenException(
        'Você não tem permissão para revisar PGAs desta regional.',
      );
    }
  }
}
