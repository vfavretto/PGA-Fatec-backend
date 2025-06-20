import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { CreateProject1Dto } from '../dto/create-project1.dto';

@Injectable()
export class CreateProject1Service {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateProject1Dto) {
    const eixo = await this.prisma.eixoTematico.findUnique({
      where: { eixo_id: dto.eixo_id },
    });
    if (!eixo) throw new Error('Eixo temático não encontrado');

    const projetosCount = await this.prisma.acaoProjeto.count({
      where: {
        eixo_id: dto.eixo_id,
        pga_id: dto.pga_id,
        ativo: true,
      },
    });

    const sequencial = (projetosCount + 1).toString().padStart(2, '0');

    const codigo_projeto = `${eixo.numero}${sequencial}`;

    return this.prisma.acaoProjeto.create({
      data: {
        ...dto,
        codigo_projeto,
      },
    });
  }
}
