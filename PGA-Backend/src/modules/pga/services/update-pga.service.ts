import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { UpdatePgaDto } from '../dto/update-pga.dto';
import { PGA } from '../entities/pga.entity';
import { StatusPGA } from '@prisma/client';
@Injectable()
export class UpdatePgaService {
  constructor(
    private readonly repository: PgaRepository,
  ) {}

  async execute(id: string, data: UpdatePgaDto, user?: any): Promise<PGA> {
    const pga = await this.repository.findOne(id);
    if (!pga) throw new NotFoundException('PGA não encontrada');

    const tipo: string = user?.tipo_usuario ?? '';
    const isAdminCps = tipo === 'Administrador' || tipo === 'CPS';

    if (!isAdminCps) {
      // Diretor só pode editar o PGA da própria unidade e somente quando EmElaboracao.
      // Verifica explicitamente que o contexto ativo é do tipo 'unidade' e corresponde
      // ao PGA — impede falso-positivo quando o contexto ativo for de regional.
      if (tipo === 'Diretor') {
        const contextIsUnit =
          user?.active_context?.tipo === 'unidade' &&
          user?.active_context?.id === pga.unidade_id;
        if (!contextIsUnit) {
          throw new ForbiddenException('Você só pode editar o PGA da sua própria unidade.');
        }
        if (pga.status !== StatusPGA.EmElaboracao) {
          throw new ForbiddenException(
            'O PGA só pode ser editado enquanto estiver em elaboração.',
          );
        }
      } else {
        throw new ForbiddenException('Você não tem permissão para editar este PGA.');
      }
    }

    const payload: any = { ...data };
    if (
      data &&
      (data as any).status === StatusPGA.Submetido &&
      pga.status !== StatusPGA.Submetido
    ) {
      payload.data_elaboracao = new Date();
    }

    return this.repository.update(id, payload);
  }
}

