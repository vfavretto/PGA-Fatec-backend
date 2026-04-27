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
export class SubmitPgaService {
  constructor(
    private readonly repository: PgaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(pgaId: string, pessoaId: string) {
    const pga = await this.repository.findOne(pgaId);
    if (!pga) {
      throw new NotFoundException('PGA não encontrado');
    }

    const statusPermitidos: StatusPGA[] = [StatusPGA.EmElaboracao, StatusPGA.Reprovado];
    if (!statusPermitidos.includes(pga.status)) {
      throw new BadRequestException(
        `PGA não pode ser submetido pois está com status "${pga.status}".`,
      );
    }

    const pessoa = await this.prisma.pessoa.findUnique({
      where: { pessoa_id: pessoaId },
      select: {
        tipo_usuario: true,
        unidades: {
          where: { ativo: true },
          select: { unidade_id: true },
        },
      },
    });

    if (!pessoa) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Diretor só pode submeter PGA da própria unidade; ADM/CPS sem restrição
    if (pessoa.tipo_usuario === 'Diretor') {
      const vinculado = pessoa.unidades.some(
        (u) => u.unidade_id === pga.unidade_id,
      );
      if (!vinculado) {
        throw new ForbiddenException(
          'Diretor só pode submeter PGA da sua própria unidade.',
        );
      }
    }

    return this.repository.update(pgaId, {
      status: StatusPGA.Submetido,
    } as any);
  }
}
