import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { Pessoa, Prisma } from '@prisma/client';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<Pessoa> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create(data: Prisma.PessoaCreateInput): Promise<Pessoa> {
    // Permitir criação aninhada de relações PessoaUnidade e PessoaRegional
    const payload: any = { ...data };

    // validar existência da unidade/regional antes de tentar conectar
    if ((data as any).unidade_id) {
      const unidadeId = (data as any).unidade_id;
      const unidade = await this.prisma.unidade.findUnique({ where: { unidade_id: unidadeId } });
      if (!unidade) {
        throw new BadRequestException(`Unidade com id ${unidadeId} não encontrada`);
      }
    }

    if ((data as any).regional_id) {
      const regionalId = (data as any).regional_id;
      const regional = await this.prisma.regional.findUnique({ where: { regional_id: regionalId } });
      if (!regional) {
        throw new BadRequestException(`Regional com id ${regionalId} não encontrada`);
      }
    }

    // se foi passado unidade_id no DTO, conectar a unidade através da tabela de junção
    if ((data as any).unidade_id) {
      payload.unidades = {
        create: [
          {
            unidade: { connect: { unidade_id: (data as any).unidade_id } },
          },
        ],
      };
      // remover campo plano para evitar conflito com o schema
      delete payload.unidade_id;
    }

    // se foi passado regional_id no DTO, conectar a regional através da tabela de junção
    if ((data as any).regional_id) {
      payload.pessoaRegionais = {
        create: [
          {
            regional: { connect: { regional_id: (data as any).regional_id } },
          },
        ],
      };
      delete payload.regional_id;
    }

    return this.prisma.pessoa.create({ data: payload });
  }

  async findAll(): Promise<Pessoa[]> {
    return this.prisma.pessoa.findMany({
      where: this.whereActive(),
      include: {
        unidades: {
          where: { ativo: true },
          include: {
            unidade: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Pessoa | null> {
    return this.prisma.pessoa.findFirst({
      where: this.whereActive({ pessoa_id: id }),
      include: {
        unidades: {
          where: { ativo: true },
          include: { unidade: true },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<Pessoa | null> {
    return this.prisma.pessoa.findUnique({
      where: { email },
      include: {
        unidades: {
          include: {
            unidade: true,
          },
        },
      },
    });
  }

  async findByUsername(nome_usuario: string): Promise<Pessoa | null> {
    return this.prisma.pessoa.findUnique({
      where: { nome_usuario },
      include: {
        unidades: {
          include: {
            unidade: true,
          },
        },
      },
    });
  }

  async update(
    pessoa_id: number,
    data: Prisma.PessoaUpdateInput,
  ): Promise<Pessoa> {
    return this.prisma.pessoa.update({
      where: { pessoa_id },
      data,
    });
  }

  async delete(id: number): Promise<Pessoa> {
    return this.prisma.pessoa.update({
      where: { pessoa_id: id },
      data: { ativo: false },
    });
  }

  async findByUnidadeId(unidadeId: number): Promise<Pessoa[]> {
    return this.prisma.pessoa.findMany({
      where: this.whereActive({
        unidades: {
          some: {
            unidade_id: unidadeId,
            ativo: true,
          },
        },
      }),
      include: {
        unidades: {
          where: { ativo: true },
          include: {
            unidade: true,
          },
        },
      },
    });
  }

  async countActiveUsers(): Promise<number> {
    return this.prisma.pessoa.count({ where: this.whereActive() });
  }
}
