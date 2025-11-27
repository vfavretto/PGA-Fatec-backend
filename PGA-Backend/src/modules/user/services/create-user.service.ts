import {
  Injectable,
  Inject,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { UserRepository } from '../user.repository';
import { Prisma, Pessoa } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordService } from './forgot-password.service';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(ForgotPasswordService)
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  async execute(
    data: CreateUserDto,
    reqUser?: Partial<Pessoa> | null,
  ): Promise<{ user: Pessoa; email_sent: boolean }> {
    const total = await this.userRepository.countActiveUsers();

    if (total > 0) {
      if (!reqUser) {
        throw new ForbiddenException(
          'Apenas usuários autenticados podem criar novos usuários diretamente',
        );
      }

      const creatorType = (reqUser as any).tipo_usuario;

      if (creatorType === 'Administrador' || creatorType === 'CPS') {
      } else if (creatorType === 'Regional') {
        const allowed = ['Diretor', 'Coordenador', 'Administrativo', 'Docente'];
        if (!allowed.includes(String(data.tipo_usuario))) {
          throw new ForbiddenException(
            'Regional só pode criar usuários do tipo Diretor ou inferiores',
          );
        }
      } else if (creatorType === 'Diretor') {
        const allowed = ['Coordenador', 'Administrativo', 'Docente'];
        if (!allowed.includes(String(data.tipo_usuario))) {
          throw new ForbiddenException(
            'Diretor só pode criar Coordenador, Administrativo ou Docente',
          );
        }
        let creatorUnidades = (reqUser as any)?.unidades || [];
        if (!creatorUnidades || creatorUnidades.length === 0) {
          try {
            const full = await this.userRepository.findById(
              (reqUser as any).pessoa_id,
            );
            creatorUnidades = (full as any)?.unidades || [];
          } catch (err) {
            creatorUnidades = [];
          }
        }
        const creatorUnitIds = creatorUnidades
          .map((u: any) => u.unidade_id ?? u.unidade?.unidade_id)
          .filter(Boolean);
        if (!creatorUnitIds.length) {
          throw new ForbiddenException(
            'Diretor não tem unidade associada para criação de usuários',
          );
        }
        if (!data.unidade_id || !creatorUnitIds.includes(data.unidade_id)) {
          throw new ForbiddenException(
            'Diretor só pode criar usuários na sua própria unidade',
          );
        }
      } else {
        throw new ForbiddenException(
          'Apenas administradores, CPS, regionais ou diretores podem criar usuários diretamente',
        );
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
      return { user, email_sent: false };
    }

    const createData = { ...data } as Prisma.PessoaCreateInput;
    createData.senha = null;

    this.logger.debug(
      `Criando usuário com payload: ${JSON.stringify(createData)}`,
    );
    const user = await this.userRepository.create(createData);

    let emailSent = false;
    try {
      if (user.email) {
        await this.forgotPasswordService.execute(user.email);
        emailSent = true;
      }
    } catch (err) {}

    return { user, email_sent: emailSent };
  }
}
