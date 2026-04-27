import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { CreatePgaDto } from '../dto/create-pga.dto';
import { PGA } from '../entities/pga.entity';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class CreatePgaService {
  constructor(
    private readonly repository: PgaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(data: CreatePgaDto, user?: any): Promise<PGA> {
    const isTemplate = data.is_template ?? false;

    if (!isTemplate && !data.unidade_id) {
      throw new BadRequestException(
        'unidade_id é obrigatório para PGAs que não são templates.',
      );
    }

    if (!isTemplate && data.unidade_id) {
      const unidade = await this.prisma.unidade.findUnique({
        where: { unidade_id: data.unidade_id },
      });
      if (!unidade) {
        throw new NotFoundException('Unidade informada não encontrada');
      }
    }

    return this.repository.create({
      ...data,
      is_template: isTemplate,
      usuario_criacao_id: user?.pessoa_id ?? null,
    });
  }
}

