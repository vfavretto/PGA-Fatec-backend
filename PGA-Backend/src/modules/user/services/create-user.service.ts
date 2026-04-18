import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Prisma, Pessoa } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';

const TIPOS_AUTORIZADOS_CRIACAO = ['Administrador', 'CPS', 'Diretor'] as const;

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    data: CreateUserDto,
    reqUser?: Partial<Pessoa> | null,
  ): Promise<Pessoa> {
    const total = await this.userRepository.countActiveUsers();

    if (total > 0) {
      const tipo = reqUser?.tipo_usuario as string | undefined;
      if (
        !reqUser ||
        !tipo ||
        !TIPOS_AUTORIZADOS_CRIACAO.includes(tipo as any)
      ) {
        throw new ForbiddenException(
          'Apenas Administrador, CPS ou Diretor podem criar novos usuários diretamente',
        );
      }

      // Diretor só pode criar pessoa da própria unidade
      if (tipo === 'Diretor') {
        if (!data.unidade_id) {
          throw new BadRequestException(
            'Diretor precisa informar a unidade_id ao criar um usuário',
          );
        }

        const diretorUnidades = await this.prisma.pessoaUnidade.findMany({
          where: {
            pessoa_id: reqUser!.pessoa_id as number,
            ativo: true,
          },
          select: { unidade_id: true },
        });

        const unidadesPermitidas = diretorUnidades.map((u) => u.unidade_id);

        if (!unidadesPermitidas.includes(Number(data.unidade_id))) {
          throw new ForbiddenException(
            'Diretor só pode criar usuários da sua própria unidade',
          );
        }

        // Diretor não pode criar Administrador, CPS ou Regional
        const tipoAlvo = data.tipo_usuario as string;
        if (
          tipoAlvo === 'Administrador' ||
          tipoAlvo === 'CPS' ||
          tipoAlvo === 'Regional'
        ) {
          throw new ForbiddenException(
            'Diretor só pode criar usuários dos tipos Diretor, Coordenador, Administrativo ou Docente',
          );
        }
      }
    } else {
      data.tipo_usuario = 'Administrador';
    }

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return this.userRepository.create(data as Prisma.PessoaCreateInput);
  }
}
