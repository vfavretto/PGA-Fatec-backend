import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';
import { ReviewPgaDto } from '../dto/review-pga.dto';
import { StatusPGA } from '@prisma/client';

@Injectable()
export class ReviewRegionalPgaService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: number, pgaId: number, data: ReviewPgaDto) {
    if (
      data.status !== StatusPGA.Aprovado &&
      data.status !== StatusPGA.Reprovado
    ) {
      throw new BadRequestException(
        'Status inválido. Utilize "Aprovado" ou "Reprovado".',
      );
    }

    const pga = await this.repository.findPgaForRegional(regionalId, pgaId);

    if (!pga) {
      throw new NotFoundException(
        'PGA não encontrado ou não pertence às unidades sob sua responsabilidade.',
      );
    }

    const parecer = data.parecer?.trim();

    return this.repository.updatePgaReview(pgaId, {
      status: data.status,
      parecer: parecer?.length ? parecer : undefined,
      regionalId,
    });
  }
}

