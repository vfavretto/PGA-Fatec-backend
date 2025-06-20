import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { Pessoa, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.PessoaCreateInput): Promise<Pessoa> {
    return this.prisma.pessoa.create({ data });
  }

  async findAll(): Promise<Pessoa[]> {
    return this.prisma.pessoa.findMany({
      include: {
        unidades: {
          include: {
            unidade: true,
          },
        },
      },
    });
  }

  async findById(pessoa_id: number): Promise<Pessoa | null> {
    return this.prisma.pessoa.findUnique({
      where: { pessoa_id },
      include: {
        unidades: {
          include: {
            unidade: true,
          },
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

  async update(pessoa_id: number, data: Prisma.PessoaUpdateInput): Promise<Pessoa> {
    return this.prisma.pessoa.update({
      where: { pessoa_id },
      data,
    });
  }

  async delete(pessoa_id: number): Promise<Pessoa> {
    return this.prisma.pessoa.delete({
      where: { pessoa_id },
    });
  }

  async findByUnidadeId(unidadeId: number): Promise<Pessoa[]> {
    return this.prisma.pessoa.findMany({
      where: {
        unidades: {
          some: {
            unidade_id: unidadeId,
            ativo: true
          }
        }
      },
      include: {
        unidades: {
          include: {
            unidade: true
          }
        }
      }
    });
  }
}
