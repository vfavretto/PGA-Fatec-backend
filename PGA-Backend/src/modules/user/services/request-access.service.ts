import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { RequestAccessDto } from '../dto/request-access.dto';

@Injectable()
export class RequestAccessService {
  constructor(private prisma: PrismaService) {}

  async execute(data: RequestAccessDto) {
    const unidade = await this.prisma.unidade.findFirst({
      where: {
        codigo_fnnn: {
          equals: data.codigo_unidade,
          mode: 'insensitive',
        },
      },
    });

    if (!unidade) {
      throw new NotFoundException(
        'Unidade não encontrada com o código fornecido',
      );
    }

    const existingSolicitation = await this.prisma.solicitacaoAcesso.findFirst({
      where: {
        email: data.email,
        status: 'Pendente',
      },
    });

    if (existingSolicitation) {
      throw new ConflictException(
        'Você já possui uma solicitação pendente com este email',
      );
    }

    const solicitacao = await this.prisma.solicitacaoAcesso.create({
      data: {
        nome: data.nome,
        email: data.email,
        unidade_id: unidade.unidade_id,
        status: 'Pendente',
        data_solicitacao: new Date(),
      },
      include: {
        unidade: {
          select: {
            unidade_id: true,
            codigo_fnnn: true,
            nome_unidade: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Solicitação de acesso criada com sucesso',
      data: solicitacao,
    };
  }
}
