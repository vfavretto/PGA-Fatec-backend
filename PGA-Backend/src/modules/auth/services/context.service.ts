import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class ContextService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getAvailableContexts(user: any) {
    const tipo = user.tipo_usuario;

    if (tipo === 'Administrador' || tipo === 'CPS') {
      const regionais = await this.prisma.pessoa.findMany({
        where: { ativo: true, tipo_usuario: 'Regional' },
        select: { pessoa_id: true, nome: true, email: true },
        orderBy: { nome: 'asc' },
      });

      const unidades = await this.prisma.unidade.findMany({
        where: { ativo: true },
        select: { unidade_id: true, nome_unidade: true },
        orderBy: { nome_unidade: 'asc' },
      });

      return { regionais, unidades };
    }

    if (tipo === 'Regional') {
      const vinculos = await this.prisma.pessoaUnidade.findMany({
        where: { pessoa_id: user.pessoa_id, ativo: true },
        include: { unidade: true },
        orderBy: { unidade: { nome_unidade: 'asc' } },
      });

      const unidades = vinculos
        .map((v) => v.unidade)
        .filter((u) => Boolean(u))
        .map((u) => ({ unidade_id: u!.unidade_id, nome_unidade: u!.nome_unidade }));

      return { regionais: [{ pessoa_id: user.pessoa_id, nome: user.nome }], unidades };
    }

    const pessoa = await this.prisma.pessoa.findUnique({
      where: { pessoa_id: Number(user.pessoa_id) },
      include: { unidades: { where: { ativo: true }, include: { unidade: true } } },
    });

    if (!pessoa) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const unidades = (pessoa.unidades ?? []).map((u) => ({
      unidade_id: u.unidade.unidade_id,
      nome_unidade: u.unidade.nome_unidade,
    }));

    return { unidades };
  }

  async selectContext(user: any, tipo: string, id?: number) {
    const userTipo = user.tipo_usuario;

    if (userTipo === 'Administrador' || userTipo === 'CPS') {
      if (tipo === 'unidade') {
        const unidade = await this.prisma.unidade.findFirst({ where: { unidade_id: Number(id), ativo: true } });
        if (!unidade) throw new BadRequestException('Unidade inválida');
      }

      if (tipo === 'regional') {
        const regional = await this.prisma.pessoa.findFirst({ where: { pessoa_id: Number(id), ativo: true, tipo_usuario: 'Regional' } });
        if (!regional) throw new BadRequestException('Regional inválida');
      }
    } else {
      if (tipo === 'unidade') {
        const vinculo = await this.prisma.pessoaUnidade.findFirst({
          where: { pessoa_id: user.pessoa_id, unidade_id: Number(id), ativo: true },
        });
        if (!vinculo) throw new BadRequestException('Usuário não possui vínculo com a unidade informada');
      }

      if (tipo === 'regional') {
        if (Number(id) !== Number(user.pessoa_id)) {
          throw new BadRequestException('Usuário não autorizado a acessar essa regional');
        }
      }
    }

    const payload = {
      email: user.email,
      pessoa_id: user.pessoa_id,
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
      active_context: { tipo, id: id ?? null },
    };

    const access = this.jwtService.sign(payload, { expiresIn: '24h' });
    const refresh = this.jwtService.sign(payload, { expiresIn: '30d' });

    return { access_token: access, refresh_token: refresh };
  }
}
