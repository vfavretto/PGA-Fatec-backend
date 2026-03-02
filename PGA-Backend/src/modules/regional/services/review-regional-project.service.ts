import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegionalRepository } from '../regional.repository';
import { ReviewProjectDto } from '../dto/review-project.dto';
import { StatusProjetoRegional } from '@prisma/client';

@Injectable()
export class ReviewRegionalProjectService {
  constructor(private readonly repository: RegionalRepository) {}

  async execute(regionalId: number, projectId: number, data: ReviewProjectDto) {
    if (
      data.status !== StatusProjetoRegional.Aprovado &&
      data.status !== StatusProjetoRegional.Reprovado
    ) {
      throw new BadRequestException(
        'Status inválido. Utilize "Aprovado" ou "Reprovado".',
      );
    }

    const projeto = await this.repository.findProjectForRegional(
      regionalId,
      projectId,
    );

    if (!projeto) {
      throw new NotFoundException(
        'Projeto não encontrado ou não pertence às unidades sob sua responsabilidade.',
      );
    }

    const parecer = data.parecer?.trim();

    return this.repository.updateProjectReview(projectId, {
      status: data.status,
      parecer: parecer?.length ? parecer : undefined,
      regionalId,
    });
  }
}

