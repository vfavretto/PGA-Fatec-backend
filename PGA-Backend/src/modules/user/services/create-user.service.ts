import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Prisma, Pessoa } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    data: CreateUserDto,
    reqUser?: Partial<Pessoa> | null,
  ): Promise<Pessoa> {
    const total = await this.userRepository.countActiveUsers();

    if (total > 0) {
      if (!reqUser || reqUser.tipo_usuario !== 'Administrador') {
        throw new ForbiddenException(
          'Apenas usuários administradores podem criar novos usuários diretamente',
        );
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
