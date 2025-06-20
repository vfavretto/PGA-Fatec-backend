import { Injectable, ConflictException } from '@nestjs/common';
import { ProblemSituationRepository } from '../problemSituation.repository';
import { CreateProblemSituationDto } from '../dto/create-problemSituation.dto';

@Injectable()
export class CreateProblemSituationService {
  constructor(private readonly repo: ProblemSituationRepository) {}

  async execute(data: CreateProblemSituationDto) {
    const existeAtivo = await this.repo.findByCodigoCategoria(
      data.codigo_categoria,
    );

    if (existeAtivo && existeAtivo.ativo) {
      throw new ConflictException(
        'Código já está em uso por uma situação ativa',
      );
    }

    return this.repo.create(data);
  }
}
