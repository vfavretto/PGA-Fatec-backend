import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { ConfiguracaoAuditoria, TipoOperacaoAuditoria } from '@prisma/client';

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAuditLog(data: {
    tabela: string;
    registro_id: number;
    ano: number;
    operacao: TipoOperacaoAuditoria;
    dados_antes?: any;
    dados_depois?: any;
    usuario_id?: number;
    motivo?: string;
  }): Promise<ConfiguracaoAuditoria> {
    return this.prisma.configuracaoAuditoria.create({
      data: {
        tabela: data.tabela,
        registro_id: data.registro_id,
        ano: data.ano,
        operacao: data.operacao,
        dados_antes: data.dados_antes,
        dados_depois: data.dados_depois,
        usuario_id: data.usuario_id,
        motivo: data.motivo,
      },
    });
  }

  async getAuditHistory(tabela: string, registro_id: number) {
    return this.prisma.configuracaoAuditoria.findMany({
      where: {
        tabela,
        registro_id,
      },
      include: {
        usuario: {
          select: {
            pessoa_id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        data_operacao: 'desc',
      },
    });
  }

  async getAuditByYear(ano: number) {
    return this.prisma.configuracaoAuditoria.findMany({
      where: { ano },
      include: {
        usuario: {
          select: {
            pessoa_id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        data_operacao: 'desc',
      },
    });
  }
}