import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProblemSituationRepository } from '../problemSituation.repository';
import { UpdateProblemSituationDto } from '../dto/update-problemSituation.dto';

@Injectable()
export class UpdateProblemSituationService {
  constructor(private readonly repo: ProblemSituationRepository) {}

  async execute(id: number, data: UpdateProblemSituationDto) {
    const situacaoExistente = await this.repo.findOne(id);

    if (!situacaoExistente) {
      throw new NotFoundException('Situação problema não encontrada');
    }

    if (data.codigo_categoria) {
      const existeAtivo = await this.repo.findByCodigoCategoria(
        data.codigo_categoria,
      );

      if (existeAtivo && existeAtivo.situacao_id !== id && existeAtivo.ativo) {
        throw new ConflictException(
          'Código já está em uso por outra situação ativa',
        );
      }
    }

    return this.repo.update(id, data);
  }
}
