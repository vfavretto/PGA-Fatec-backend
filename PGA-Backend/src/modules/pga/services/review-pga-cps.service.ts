import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusPGA } from '@prisma/client';
import { PgaRepository } from '../pga.repository';

@Injectable()
export class ReviewPgaCpsService {
  constructor(private readonly repository: PgaRepository) {}

  async aprovar(pgaId: string, pessoaId: string, parecer?: string) {
    const pga = await this.repository.findOne(pgaId);
    if (!pga) throw new NotFoundException('PGA não encontrado');

    if (pga.status !== StatusPGA.AguardandoCPS) {
      throw new BadRequestException(
        `PGA não está aguardando aprovação CPS (status atual: ${pga.status}).`,
      );
    }

    return this.repository.updateWorkflow(pgaId, {
      status: StatusPGA.AprovadoCPS,
      parecer_cps: parecer ?? null,
      cps_aprovador_id: pessoaId,
      data_parecer_cps: new Date(),
    });
  }

  async reprovar(pgaId: string, pessoaId: string, parecer: string) {
    if (!parecer?.trim()) {
      throw new BadRequestException('O parecer é obrigatório ao reprovar o PGA.');
    }

    const pga = await this.repository.findOne(pgaId);
    if (!pga) throw new NotFoundException('PGA não encontrado');

    if (pga.status !== StatusPGA.AguardandoCPS) {
      throw new BadRequestException(
        `PGA não está aguardando aprovação CPS (status atual: ${pga.status}).`,
      );
    }

    return this.repository.updateWorkflow(pgaId, {
      status: StatusPGA.Reprovado,
      parecer_cps: parecer,
      cps_aprovador_id: pessoaId,
      data_parecer_cps: new Date(),
    });
  }
}
