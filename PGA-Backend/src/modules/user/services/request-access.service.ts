import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { RequestAccessDto } from '../dto/request-access.dto';

@Injectable()
export class RequestAccessService {
  constructor(private prisma: PrismaService) {}

  async execute(data: RequestAccessDto) {
    // 1. Buscar a unidade pelo campo codigo_fnnn (não pelo ID)
    const unidade = await this.prisma.unidade.findFirst({
      where: {
        codigo_fnnn: data.codigo_unidade.toUpperCase(),
      },
    });

    if (!unidade) {
      throw new NotFoundException(
        `Unidade com código ${data.codigo_unidade} não encontrada ou inativa`,
      );
    }

    // 2. Verificar se já existe solicitação pendente com este email
    const existingSolicitation = await this.prisma.solicitacaoAcesso.findFirst({
      where: {
        email: data.email,
        status: 'Pendente',
      },
    });

    if (existingSolicitation) {
      throw new ConflictException('Já existe uma solicitação pendente para este email');
    }

    // 3. Criar nova solicitação usando o unidade_id encontrado
    const solicitacao = await this.prisma.solicitacaoAcesso.create({
      data: {
        nome: data.nome,
        email: data.email,
        unidade_id: unidade.unidade_id, // Usar o ID da unidade encontrada
        status: 'Pendente',
        data_solicitacao: new Date(),
      },
      include: {
        unidade: {
          select: {
            unidade_id: true,
            codigo_fnnn: true,
            nome_completo: true,
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