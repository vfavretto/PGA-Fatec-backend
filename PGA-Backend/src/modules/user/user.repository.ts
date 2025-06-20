import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { Pessoa, Prisma } from '@prisma/client';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<Pessoa> {
  constructor(protected readonly prisma: PrismaService) { 
    super(prisma);
  }

  async create(data: Prisma.PessoaCreateInput): Promise<Pessoa> {
    return this.prisma.pessoa.create({ data });
  }

  async findAll(): Promise<Pessoa[]> {
    return this.prisma.pessoa.findMany({
      where: this.whereActive(), // 👈 Adicionado para filtrar apenas ativos
      include: {
        unidades: {
          where: { ativo: true }, // 👈 Filtrar apenas unidades ativas
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
          include: { unidade: true }
        }
      }
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

  async update(pessoa_id: number, data: Prisma.PessoaUpdateInput): Promise<Pessoa> {
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
            ativo: true
          }
        }
      }),
      include: {
        unidades: {
          where: { ativo: true },
          include: {
            unidade: true
          }
        }
      }
    });
  }
}
