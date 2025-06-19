import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { TipoUsuario } from '@prisma/client';

@Injectable()
export class ListAccessRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(usuarioId: number, tipoUsuario: TipoUsuario) {
    let solicitacoes: any[];

    // Administrador vê todas as solicitações
    if (tipoUsuario === 'Administrador') {
      solicitacoes = await this.prisma.solicitacaoAcesso.findMany({
        include: {
          unidade: {
            select: {
              unidade_id: true,
              nome_completo: true,
              codigo_fnnn: true
            }
          },
          processador: {
            select: {
              pessoa_id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          data_solicitacao: 'desc'
        }
      });
    }
    // Diretor vê apenas solicitações das unidades que ele gerencia
    else if (tipoUsuario === 'Diretor') {
      // Buscar unidades vinculadas ao usuário
      const usuarioUnidades = await this.prisma.pessoaUnidade.findMany({
        where: { 
          pessoa_id: usuarioId,
          ativo: true
        },
        select: {
          unidade_id: true
        }
      });

      const unidadeIds = usuarioUnidades.map(pu => pu.unidade_id);

      if (unidadeIds.length === 0) {
        return {
          pendingRequests: [],
          processedRequests: []
        };
      }

      solicitacoes = await this.prisma.solicitacaoAcesso.findMany({
        where: {
          unidade_id: {
            in: unidadeIds
          }
        },
        include: {
          unidade: {
            select: {
              unidade_id: true,
              nome_completo: true,
              codigo_fnnn: true
            }
          },
          processador: {
            select: {
              pessoa_id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          data_solicitacao: 'desc'
        }
      });
    }
    // Outros tipos de usuário não têm acesso às solicitações
    else {
      throw new ForbiddenException('Você não tem permissão para visualizar solicitações de acesso');
    }

    // Separar entre pendentes e processadas
    const pendingRequests = solicitacoes.filter(solicitacao => solicitacao.status === 'Pendente');
    const processedRequests = solicitacoes.filter(solicitacao => 
      solicitacao.status === 'Aprovada' || solicitacao.status === 'Rejeitada'
    );

    return {
      pendingRequests,
      processedRequests
    };
  }
}