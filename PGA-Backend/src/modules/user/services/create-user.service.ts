import {
  Injectable,
  Inject,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { UserRepository } from '../user.repository';
import { Prisma, Pessoa } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../config/prisma.service';
import { ForgotPasswordService } from './forgot-password.service';

const TIPOS_AUTORIZADOS_CRIACAO = ['Administrador', 'CPS', 'Diretor'] as const;

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
    @Inject(ForgotPasswordService)
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  async execute(
    data: CreateUserDto,
    reqUser?: Partial<Pessoa> | null,
  ): Promise<{ user: Pessoa; email_sent: boolean }> {
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

      if (tipo === 'Diretor') {
        if (!data.unidade_id) {
          throw new BadRequestException(
            'Diretor precisa informar a unidade_id ao criar um usuário',
          );
        }

        const diretorUnidades = await this.prisma.pessoaUnidade.findMany({
          where: {
            pessoa_id: reqUser!.pessoa_id as string,
            ativo: true,
          },
          select: { unidade_id: true },
        });

        const unidadesPermitidas = diretorUnidades.map((u) => u.unidade_id);

        if (!unidadesPermitidas.includes(data.unidade_id as string)) {
          throw new ForbiddenException(
            'Diretor só pode criar usuários da sua própria unidade',
          );
        }

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

    if (
      data.tipo_usuario === (TipoUsuario as any).Regional ||
      data.tipo_usuario === 'Regional'
    ) {
      if (!data.regional_id) {
        throw new BadRequestException(
          'Campo regional_id é obrigatório para tipo Regional',
        );
      }
    }

    const unitRoles = ['Docente', 'Diretor', 'Coordenador', 'Administrativo'];
    if (unitRoles.includes(String(data.tipo_usuario)) && !data.unidade_id) {
      throw new BadRequestException(
        'Campo unidade_id é obrigatório para o tipo de usuário selecionado',
      );
    }

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
      const user = await this.userRepository.create(
        data as Prisma.PessoaCreateInput,
      );
      if (String(data.tipo_usuario) === 'Diretor' && data.unidade_id) {
        await this.setAsUnitDirector(user.pessoa_id, data.unidade_id as string);
      }
      const { senha: _s, ...userSafe } = user;
      return { user: userSafe as Pessoa, email_sent: false };
    }

    const createData = { ...data } as Prisma.PessoaCreateInput;
    createData.senha = null;

    this.logger.debug(
      `Criando usuário com payload: ${JSON.stringify(createData)}`,
    );
    const user = await this.userRepository.create(createData);

    if (String(data.tipo_usuario) === 'Diretor' && data.unidade_id) {
      await this.setAsUnitDirector(user.pessoa_id, data.unidade_id as string);
    }

    let emailSent = false;
    try {
      if (user.email) {
        await this.forgotPasswordService.execute(user.email, true);
        emailSent = true;
      }
    } catch (err) {}

    const { senha: _senha, ...userSafe } = user;
    return { user: userSafe as Pessoa, email_sent: emailSent };
  }

  private async setAsUnitDirector(
    pessoaId: string,
    unidadeId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const unidade = await tx.unidade.findUnique({
        where: { unidade_id: unidadeId },
        select: { diretor_id: true },
      });

      if (unidade?.diretor_id && unidade.diretor_id !== pessoaId) {
        await tx.pessoa.update({
          where: { pessoa_id: unidade.diretor_id },
          data: { tipo_usuario: 'Coordenador' },
        });
      }

      await tx.unidade.update({
        where: { unidade_id: unidadeId },
        data: { diretor_id: pessoaId },
      });
    });
  }
}
