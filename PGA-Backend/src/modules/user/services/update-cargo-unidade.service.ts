import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CargoUnidade } from '@prisma/client';

@Injectable()
export class UpdateCargoUnidadeService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(pessoaId: string, unidadeId: string, cargo: CargoUnidade | null) {
    const vinculo = await this.prisma.pessoaUnidade.findUnique({
      where: { pessoa_id_unidade_id: { pessoa_id: pessoaId, unidade_id: unidadeId } },
    });

    if (!vinculo) {
      throw new NotFoundException('Vínculo pessoa-unidade não encontrado');
    }

    return this.prisma.pessoaUnidade.update({
      where: { pessoa_id_unidade_id: { pessoa_id: pessoaId, unidade_id: unidadeId } },
      data: { cargo: cargo ?? null },
    });
  }
}
